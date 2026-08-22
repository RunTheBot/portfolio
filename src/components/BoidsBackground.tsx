"use client";

import React, { useEffect, useRef } from "react";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  historyX: Float32Array;
  historyY: Float32Array;
  historyIdx: number;
  size: number;
  baseSpeed: number;
  maxForce: number;
  wanderAngle: number;
}

interface ObstacleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BoidsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Calculate target boids based on viewport area
    const calcBoidCount = (w: number, h: number) => {
      const area = w * h;
      const count = Math.floor(area / 18000);
      return Math.max(18, Math.min(count, 180));
    };

    const HISTORY_LEN = 5;

    const createBoid = (spawnX?: number, spawnY?: number): Boid => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.6 + Math.random() * 0.6;
      const initX = spawnX ?? 80 + Math.random() * (width - 160);
      const initY = spawnY ?? 80 + Math.random() * (height - 160);

      const hX = new Float32Array(HISTORY_LEN);
      const hY = new Float32Array(HISTORY_LEN);
      hX.fill(initX);
      hY.fill(initY);

      return {
        x: initX,
        y: initY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        historyX: hX,
        historyY: hY,
        historyIdx: 0,
        size: 2.5,
        baseSpeed: speed,
        maxForce: 0.12,
        wanderAngle: angle,
      };
    };

    const boids: Boid[] = [];
    let targetCount = calcBoidCount(width, height);

    for (let i = 0; i < targetCount; i++) {
      boids.push(createBoid());
    }

    // Cache on-screen text & container bounding boxes
    let textRects: ObstacleRect[] = [];

    const updateObstacleRects = () => {
      const selectors = "h1, h2, h3, p, a, button, nav, header, ul, li";
      const elements = document.querySelectorAll(selectors);
      const rects: ObstacleRect[] = [];
      const viewH = window.innerHeight;
      const viewW = window.innerWidth;

      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (
          r.bottom > -10 &&
          r.top < viewH + 10 &&
          r.right > -10 &&
          r.left < viewW + 10 &&
          r.width > 8 &&
          r.height > 8
        ) {
          rects.push({
            x: r.left,
            y: r.top,
            width: r.width,
            height: r.height,
          });
        }
      });

      textRects = rects;
    };

    const timer = setTimeout(updateObstacleRects, 100);

    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        updateObstacleRects();
        scrollTimeout = null;
      }, 150);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      targetCount = calcBoidCount(width, height);

      if (boids.length < targetCount) {
        const toAdd = targetCount - boids.length;
        for (let i = 0; i < toAdd; i++) {
          boids.push(createBoid());
        }
      } else if (boids.length > targetCount) {
        boids.splice(targetCount);
      }

      updateObstacleRects();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Mouse predator state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 160,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const perceptionRadius = 50;
    const separationRadius = 24;
    const textPadding = 12;

    const edgeMargin = 70;
    const cornerMargin = 110;

    let lastTime = 0;

    const tick = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const rawDelta = (currentTime - lastTime) / 16.667;
      const dt = Math.max(0.5, Math.min(rawDelta, 2.0));
      lastTime = currentTime;

      // Smooth predator position
      mouse.x += (mouse.targetX - mouse.x) * 0.18 * dt;
      mouse.y += (mouse.targetY - mouse.y) * 0.18 * dt;

      // Central attractor bait/food beacon coordinates (with subtle organic orbital drift)
      const foodX = width * 0.5 + Math.sin(currentTime * 0.0006) * 35;
      const foodY = height * 0.5 + Math.cos(currentTime * 0.0008) * 25;
      const foodAttractionRadius = Math.min(width, height) * 0.65;
      const foodCoreRadius = 28;

      ctx.clearRect(0, 0, width, height);

      const boidLen = boids.length;
      const rectLen = textRects.length;

      // 1. Update boids physics with stable delta time integration
      for (let i = 0; i < boidLen; i++) {
        const b = boids[i];

        let alignX = 0, alignY = 0, alignCount = 0;
        let cohesionX = 0, cohesionY = 0, cohesionCount = 0;
        let separationX = 0, separationY = 0, separationCount = 0;

        for (let j = 0; j < boidLen; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < perceptionRadius * perceptionRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);

            alignX += other.vx;
            alignY += other.vy;
            alignCount++;

            cohesionX += other.x;
            cohesionY += other.y;
            cohesionCount++;

            if (dist < separationRadius) {
              const rep = 1 - dist / separationRadius;
              separationX -= (dx / dist) * rep;
              separationY -= (dy / dist) * rep;
              separationCount++;
            }
          }
        }

        let ax = 0;
        let ay = 0;

        // Alignment steering
        if (alignCount > 0) {
          alignX /= alignCount;
          alignY /= alignCount;
          const mag = Math.hypot(alignX, alignY) || 1;
          alignX = (alignX / mag) * b.baseSpeed - b.vx;
          alignY = (alignY / mag) * b.baseSpeed - b.vy;
          ax += alignX * 0.6;
          ay += alignY * 0.6;
        }

        // Cohesion steering
        if (cohesionCount > 0) {
          cohesionX = cohesionX / cohesionCount - b.x;
          cohesionY = cohesionY / cohesionCount - b.y;
          const mag = Math.hypot(cohesionX, cohesionY) || 1;
          cohesionX = (cohesionX / mag) * b.baseSpeed - b.vx;
          cohesionY = (cohesionY / mag) * b.baseSpeed - b.vy;
          ax += cohesionX * 0.08;
          ay += cohesionY * 0.08;
        }

        // Separation steering
        if (separationCount > 0) {
          ax += separationX * 1.8;
          ay += separationY * 1.8;
        }

        // Wander force
        b.wanderAngle += (Math.random() - 0.5) * 0.25 * dt;
        ax += Math.cos(b.wanderAngle) * 0.15;
        ay += Math.sin(b.wanderAngle) * 0.15;

        // 2. Central Bait / Food Attraction (Gravity well with gentle swirling orbit)
        const fdx = foodX - b.x;
        const fdy = foodY - b.y;
        const fdist = Math.hypot(fdx, fdy);

        if (fdist < foodAttractionRadius && fdist > 0) {
          const normDist = fdist / foodAttractionRadius;
          // Smooth bell curve attraction force peaking mid-range
          const pullStrength = Math.sin(normDist * Math.PI) * 0.45;
          ax += (fdx / fdist) * pullStrength;
          ay += (fdy / fdist) * pullStrength;

          // Tangential vortex spin to make boids swirl organically around the bait rather than stacking
          const tangentX = -fdy / fdist;
          const tangentY = fdx / fdist;
          const swirlStrength = 0.22 * (1 - normDist);
          ax += tangentX * swirlStrength;
          ay += tangentY * swirlStrength;

          // Inner core exclusion so boids orbit around the bait beacon cleanly
          if (fdist < foodCoreRadius) {
            const push = (1 - fdist / foodCoreRadius) * 1.2;
            ax -= (fdx / fdist) * push;
            ay -= (fdy / fdist) * push;
          }
        }

        // 3. Obstacle / Text Slit-Flow Navigation
        for (let r = 0; r < rectLen; r++) {
          const rect = textRects[r];
          if (
            b.x < rect.x - textPadding ||
            b.x > rect.x + rect.width + textPadding ||
            b.y < rect.y - textPadding ||
            b.y > rect.y + rect.height + textPadding
          ) {
            continue;
          }

          const closestX = Math.max(rect.x, Math.min(b.x, rect.x + rect.width));
          const closestY = Math.max(rect.y, Math.min(b.y, rect.y + rect.height));

          const rdx = b.x - closestX;
          const rdy = b.y - closestY;
          const rdist = Math.hypot(rdx, rdy);

          if (rdist < textPadding) {
            let normalX = rdist === 0 ? (b.x > rect.x + rect.width / 2 ? 1 : -1) : rdx / rdist;
            let normalY = rdist === 0 ? (b.y > rect.y + rect.height / 2 ? 1 : -1) : rdy / rdist;

            const pushFactor = Math.pow((textPadding - rdist) / textPadding, 1.1) * 3.0;
            ax += normalX * pushFactor;
            ay += normalY * pushFactor;

            const dot = b.vx * normalX + b.vy * normalY;
            const tangentX = b.vx - dot * normalX;
            const tangentY = b.vy - dot * normalY;
            const tMag = Math.hypot(tangentX, tangentY);
            if (tMag > 0.1) {
              ax += (tangentX / tMag) * 0.8;
              ay += (tangentY / tMag) * 0.8;
            }
          }
        }

        // 4. Mouse Predator Avoidance
        let isFleeingMouse = false;
        if (mouse.active) {
          const pdx = b.x - mouse.x;
          const pdy = b.y - mouse.y;
          const pdistSq = pdx * pdx + pdy * pdy;

          if (pdistSq < mouse.radius * mouse.radius && pdistSq > 0) {
            const pdist = Math.sqrt(pdistSq);
            isFleeingMouse = true;
            const force = Math.pow((mouse.radius - pdist) / mouse.radius, 1.6) * 7.5;
            ax += (pdx / pdist) * force;
            ay += (pdy / pdist) * force;
          }
        }

        // 5. Edge Repulsion
        if (b.x < edgeMargin) {
          const factor = Math.pow((edgeMargin - b.x) / edgeMargin, 1.4) * 2.2;
          ax += factor;
        } else if (b.x > width - edgeMargin) {
          const factor = Math.pow((b.x - (width - edgeMargin)) / edgeMargin, 1.4) * 2.2;
          ax -= factor;
        }

        if (b.y < edgeMargin) {
          const factor = Math.pow((edgeMargin - b.y) / edgeMargin, 1.4) * 2.2;
          ay += factor;
        } else if (b.y > height - edgeMargin) {
          const factor = Math.pow((b.y - (height - edgeMargin)) / edgeMargin, 1.4) * 2.2;
          ay -= factor;
        }

        // 6. Corner Repulsion
        const corners = [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: 0, y: height },
          { x: width, y: height },
        ];

        for (let c = 0; c < 4; c++) {
          const cdx = b.x - corners[c].x;
          const cdy = b.y - corners[c].y;
          const cdistSq = cdx * cdx + cdy * cdy;

          if (cdistSq < cornerMargin * cornerMargin && cdistSq > 0) {
            const cdist = Math.sqrt(cdistSq);
            const cornerForce = Math.pow((cornerMargin - cdist) / cornerMargin, 1.6) * 3.5;
            ax += (cdx / cdist) * cornerForce;
            ay += (cdy / cdist) * cornerForce;
          }
        }

        // Apply acceleration limit
        const aMag = Math.hypot(ax, ay);
        if (aMag > b.maxForce) {
          ax = (ax / aMag) * b.maxForce;
          ay = (ay / aMag) * b.maxForce;
        }

        b.vx += ax * dt;
        b.vy += ay * dt;

        // Smooth speed regulation
        const currentSpeed = Math.hypot(b.vx, b.vy);
        const targetSpeed = isFleeingMouse ? b.baseSpeed * 2.0 : b.baseSpeed;

        if (currentSpeed > 0) {
          const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * 0.08 * dt;
          b.vx = (b.vx / currentSpeed) * newSpeed;
          b.vy = (b.vy / currentSpeed) * newSpeed;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Boundary clamp
        if (b.x < 12) {
          b.x = 12;
          b.vx = Math.abs(b.vx);
        } else if (b.x > width - 12) {
          b.x = width - 12;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y < 12) {
          b.y = 12;
          b.vy = Math.abs(b.vy);
        } else if (b.y > height - 12) {
          b.y = height - 12;
          b.vy = -Math.abs(b.vy);
        }

        // Circular buffer for kinetic history
        b.historyIdx = (b.historyIdx + 1) % HISTORY_LEN;
        b.historyX[b.historyIdx] = b.x;
        b.historyY[b.historyIdx] = b.y;
      }

      // 7. Abstract Geometric Render
      // A. Food / Bait Target in Center (Minimal architectural reticle with subtle orbital ring)
      ctx.save();
      ctx.translate(foodX, foodY);

      // Outer dashed orbital guide
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, foodCoreRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner hard-edge target cross
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.moveTo(0, -5);
      ctx.lineTo(0, 5);
      ctx.stroke();

      // Center diamond core
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.moveTo(0, -2.5);
      ctx.lineTo(2.5, 0);
      ctx.lineTo(0, 2.5);
      ctx.lineTo(-2.5, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // B. Constellation links
      ctx.lineWidth = 1;
      for (let i = 0; i < boidLen; i++) {
        let connections = 0;
        for (let j = i + 1; j < boidLen; j++) {
          if (connections >= 2) break;
          const dx = boids[j].x - boids[i].x;
          const dy = boids[j].y - boids[i].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 48 * 48) {
            connections++;
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 48) * 0.09;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(boids[i].x, boids[i].y);
            ctx.lineTo(boids[j].x, boids[j].y);
            ctx.stroke();
          }
        }
      }

      // C. Render abstract boids
      for (let i = 0; i < boidLen; i++) {
        const b = boids[i];
        const angle = Math.atan2(b.vy, b.vx);

        // Kinetic trail from static ring buffer
        ctx.beginPath();
        const startIdx = (b.historyIdx + 1) % HISTORY_LEN;
        ctx.moveTo(b.historyX[startIdx], b.historyY[startIdx]);
        for (let k = 1; k < HISTORY_LEN; k++) {
          const idx = (startIdx + k) % HISTORY_LEN;
          ctx.lineTo(b.historyX[idx], b.historyY[idx]);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
        ctx.stroke();

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);

        const isFleeing = mouse.active && Math.hypot(b.x - mouse.x, b.y - mouse.y) < mouse.radius;
        const mainAlpha = isFleeing ? 0.42 : 0.2;

        ctx.strokeStyle = `rgba(255, 255, 255, ${mainAlpha})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${mainAlpha * 1.2})`;

        const len = 9;
        ctx.beginPath();
        ctx.moveTo(len, 0);
        ctx.lineTo(-len * 0.4, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 2);
        ctx.stroke();

        ctx.fillRect(-0.75, -0.75, 1.5, 1.5);

        ctx.restore();
      }

      // D. Abstract predator reticle around mouse
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        ctx.save();
        ctx.translate(mouse.x, mouse.y);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, mouse.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
