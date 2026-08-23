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
  colorIdx: number;
}

interface ObstacleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum RenderMode {
  Spread = "spread",
  Prism = "prism",
  Gradient = "gradient",
  Dither = "dither",
  Chroma = "chroma",
  Solid = "solid",
}

export const BoidsRenderMode = RenderMode;
export type BoidsRenderMode = RenderMode;

export interface BoidsBackgroundProps {
  mode?: RenderMode | "spread" | "prism" | "gradient" | "dither" | "chroma" | "solid";
  className?: string;
}

export default function BoidsBackground({
  mode = RenderMode.Dither,
  className,
}: BoidsBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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
      const count = Math.floor(area / 10000);
      return Math.max(18, Math.min(count, 500));
    };

    const HISTORY_LEN = 5;

    const createBoid = (spawnX?: number, spawnY?: number, idx?: number): Boid => {
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
        colorIdx: (idx ?? Math.floor(Math.random() * 4)) % 4,
      };
    };

    const boids: Boid[] = [];
    let targetCount = calcBoidCount(width, height);

    for (let i = 0; i < targetCount; i++) {
      boids.push(createBoid(undefined, undefined, i));
    }

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
          boids.push(createBoid(undefined, undefined, boids.length + i));
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
    const separationRadius = 32;
    const textPadding = 12;

    const edgeMargin = 70;
    const cornerMargin = 110;

    let lastTime = 0;

    // --- SPRITE GENERATORS ---
    
    // 1. Spread (Monochrome obsidian purple density kernel)
    const DENSITY_RADIUS = 280;
    const createObsidianPurpleSprite = (radius: number) => {
      const sprite = document.createElement("canvas");
      sprite.width = radius * 2;
      sprite.height = radius * 2;
      const sCtx = sprite.getContext("2d");
      if (!sCtx) return sprite;

      const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      const STEPS = 40;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const smoothT = Math.cos(t * Math.PI * 0.5);
        const weight = Math.pow(smoothT, 3.0);

        const hue = 268 + weight * 12;
        const saturation = 92 + weight * 6;
        const lightness = 8 + weight * 16;
        const alpha = weight * 0.055;

        grad.addColorStop(
          t,
          `hsla(${hue.toFixed(1)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%, ${alpha.toFixed(4)})`
        );
      }

      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      sCtx.fill();
      return sprite;
    };

    // 2. Prism (Multi-color non-monochrome mesh spread)
    const createPrismSprite = (radius: number, hue: number, sat = 90) => {
      const sprite = document.createElement("canvas");
      sprite.width = radius * 2;
      sprite.height = radius * 2;
      const sCtx = sprite.getContext("2d");
      if (!sCtx) return sprite;

      const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      const STEPS = 30;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const smoothT = Math.cos(t * Math.PI * 0.5);
        const weight = Math.pow(smoothT, 2.4);

        const lightness = 8 + weight * 18;
        const alpha = weight * 0.052;

        grad.addColorStop(
          t,
          `hsla(${hue}, ${sat}%, ${lightness.toFixed(0)}%, ${alpha.toFixed(4)})`
        );
      }

      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      sCtx.fill();
      return sprite;
    };

    // 3. Chroma sprites
    const glowSpread = createObsidianPurpleSprite(DENSITY_RADIUS);
    const glowMagenta = createPrismSprite(DENSITY_RADIUS, 308, 100);
    const glowCyan = createPrismSprite(DENSITY_RADIUS, 192, 100);

    const prismSprites = [
      createPrismSprite(DENSITY_RADIUS, 165, 95), // Electric Teal
      createPrismSprite(DENSITY_RADIUS, 225, 98), // Sapphire Blue
      createPrismSprite(DENSITY_RADIUS, 278, 96), // Amethyst Violet
      createPrismSprite(DENSITY_RADIUS, 338, 94), // Hot Rose
    ];

    // 4. Dither Kernel: Extended gradual radius (42px on grid = ~126px on screen)
    const DITHER_SCALE = 3;
    const DITHER_RADIUS = 42;
    const createDitherKernelSprite = (radius: number) => {
      const sprite = document.createElement("canvas");
      sprite.width = radius * 2;
      sprite.height = radius * 2;
      const sCtx = sprite.getContext("2d");
      if (!sCtx) return sprite;

      const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      const STEPS = 28;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        // Farther, extended gradual falloff
        const weight = Math.pow(Math.cos(t * Math.PI * 0.5), 1.35);
        // Moderate per-boid alpha — keeps pattern readable without feeling busy
        const alpha = weight * 0.15;
        grad.addColorStop(t, `rgba(255, 255, 255, ${alpha.toFixed(4)})`);
      }

      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      sCtx.fill();
      return sprite;
    };

    const glowDitherKernel = createDitherKernelSprite(DITHER_RADIUS);

    // Standard 4x4 Bayer matrix normalized
    const BAYER_4X4 = new Float32Array([
      0 / 16,  8 / 16,  2 / 16, 10 / 16,
      12 / 16,  4 / 16, 14 / 16,  6 / 16,
      3 / 16, 11 / 16,  1 / 16,  9 / 16,
      15 / 16,  7 / 16, 13 / 16,  5 / 16,
    ]);

    // Brighter violet post-dither color (ABGR: rgb(118, 50, 196), alpha 224)
    // 0 is black (transparent 0x00000000), 1 is vivid violet
    const DITHER_COLOR = 0xE0C43276;

    // Pre-allocated offscreen canvas with willReadFrequently
    const ditherCanvas = document.createElement("canvas");
    const ditherCtx = ditherCanvas.getContext("2d", { willReadFrequently: true });

    const tick = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const rawDelta = (currentTime - lastTime) / 16.667;
      const dt = Math.max(0.5, Math.min(rawDelta, 2.0));
      lastTime = currentTime;

      // Smooth predator position
      mouse.x += (mouse.targetX - mouse.x) * 0.18 * dt;
      mouse.y += (mouse.targetY - mouse.y) * 0.18 * dt;

      ctx.clearRect(0, 0, width, height);

      const boidLen = boids.length;
      const rectLen = textRects.length;

      // 1. Update boids physics
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

        if (alignCount > 0) {
          alignX /= alignCount;
          alignY /= alignCount;
          const mag = Math.hypot(alignX, alignY) || 1;
          alignX = (alignX / mag) * b.baseSpeed - b.vx;
          alignY = (alignY / mag) * b.baseSpeed - b.vy;
          ax += alignX * 0.4;
          ay += alignY * 0.4;
        }

        if (cohesionCount > 0) {
          cohesionX = cohesionX / cohesionCount - b.x;
          cohesionY = cohesionY / cohesionCount - b.y;
          const mag = Math.hypot(cohesionX, cohesionY) || 1;
          cohesionX = (cohesionX / mag) * b.baseSpeed - b.vx;
          cohesionY = (cohesionY / mag) * b.baseSpeed - b.vy;
          ax += cohesionX * 0.04;
          ay += cohesionY * 0.04;
        }

        if (separationCount > 0) {
          ax += separationX * 2;
          ay += separationY * 2;
        }

        const centerDX = (width * 0.5 - b.x) / (width * 0.5);
        const centerDY = (height * 0.5 - b.y) / (height * 0.5);
        ax += centerDX * 0.0002;
        ay += centerDY * 0.0002;

        b.wanderAngle += (Math.random() - 0.5) * 0.25 * dt;
        ax += Math.cos(b.wanderAngle) * 0.15;
        ay += Math.sin(b.wanderAngle) * 0.15;

        // Obstacle avoidance
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
            const normalX = rdist === 0 ? (b.x > rect.x + rect.width / 2 ? 1 : -1) : rdx / rdist;
            const normalY = rdist === 0 ? (b.y > rect.y + rect.height / 2 ? 1 : -1) : rdy / rdist;

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

        // Mouse avoidance
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

        // Edge Repulsion
        if (b.x < edgeMargin) {
          ax += Math.pow((edgeMargin - b.x) / edgeMargin, 1.4) * 2.2;
        } else if (b.x > width - edgeMargin) {
          ax -= Math.pow((b.x - (width - edgeMargin)) / edgeMargin, 1.4) * 2.2;
        }

        if (b.y < edgeMargin) {
          ay += Math.pow((edgeMargin - b.y) / edgeMargin, 1.4) * 2.2;
        } else if (b.y > height - edgeMargin) {
          ay -= Math.pow((b.y - (height - edgeMargin)) / edgeMargin, 1.4) * 2.2;
        }

        // Corner Repulsion
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

        // Acceleration limit
        const aMag = Math.hypot(ax, ay);
        if (aMag > b.maxForce) {
          ax = (ax / aMag) * b.maxForce;
          ay = (ay / aMag) * b.maxForce;
        }

        b.vx += ax * dt;
        b.vy += ay * dt;

        // Speed regulation
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

        b.historyIdx = (b.historyIdx + 1) % HISTORY_LEN;
        b.historyX[b.historyIdx] = b.x;
        b.historyY[b.historyIdx] = b.y;
      }

      // --- RENDERING MODES ---

      // 1. SPREAD (Monochrome obsidian purple density field)
      const renderSpread = () => {
        ctx.globalCompositeOperation = "lighter";
        const glowDiameter = DENSITY_RADIUS * 2;
        for (let i = 0; i < boidLen; i++) {
          const b = boids[i];
          ctx.drawImage(
            glowSpread,
            b.x - DENSITY_RADIUS,
            b.y - DENSITY_RADIUS,
            glowDiameter,
            glowDiameter
          );
        }
        ctx.globalCompositeOperation = "source-over";
      };

      // 2. PRISM (Multi-color non-monochrome mesh spread - Silky smooth & jitter-free)
      const renderPrism = () => {
        ctx.globalCompositeOperation = "lighter";
        const glowDiameter = DENSITY_RADIUS * 2;
        for (let i = 0; i < boidLen; i++) {
          const b = boids[i];
          const sprite = prismSprites[b.colorIdx];

          ctx.drawImage(
            sprite,
            b.x - DENSITY_RADIUS,
            b.y - DENSITY_RADIUS,
            glowDiameter,
            glowDiameter
          );
        }
        ctx.globalCompositeOperation = "source-over";
      };

      // 3. DITHER (Compact Radius, Solid Core, Steady Dropoff, Reduced Max Lightness)
      const renderDither = () => {
        const offW = Math.ceil(width / DITHER_SCALE);
        const offH = Math.ceil(height / DITHER_SCALE);
        if (ditherCanvas.width !== offW || ditherCanvas.height !== offH) {
          ditherCanvas.width = offW;
          ditherCanvas.height = offH;
        }
        if (!ditherCtx) return;

        ditherCtx.clearRect(0, 0, offW, offH);
        ditherCtx.globalCompositeOperation = "lighter";

        const dDiam = DITHER_RADIUS * 2;
        const invScale = 1 / DITHER_SCALE;
        for (let i = 0; i < boidLen; i++) {
          const b = boids[i];
          ditherCtx.drawImage(
            glowDitherKernel,
            b.x * invScale - DITHER_RADIUS,
            b.y * invScale - DITHER_RADIUS,
            dDiam,
            dDiam
          );
        }

        const imgData = ditherCtx.getImageData(0, 0, offW, offH);
        const data32 = new Uint32Array(imgData.data.buffer);

        for (let y = 0, idx = 0; y < offH; y++) {
          const bayerY = (y & 3) << 2;
          for (let x = 0; x < offW; x++, idx++) {
            const pixel = data32[idx];
            if (!pixel) continue;

            const alphaVal = pixel >>> 24;
            if (alphaVal <= 8) {
              data32[idx] = 0;
              continue;
            }

            const density = alphaVal / 255;
            if (density < 0.058) {
              data32[idx] = 0;
              continue;
            }

            // Extended Bayer dithering — lower floor shows finer edge detail
            const bayerThreshold = BAYER_4X4[bayerY | (x & 3)];
            const normDither = (density - 0.058) / (1.40 - 0.058);

            if (normDither > bayerThreshold) {
              data32[idx] = DITHER_COLOR;
            } else {
              data32[idx] = 0; // 0 Black
            }
          }
        }

        ditherCtx.putImageData(imgData, 0, 0);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(ditherCanvas, 0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
      };

      // 4. CHROMA (Chromatic aberration + airy dither spotlight)
      const renderChroma = () => {
        ctx.globalCompositeOperation = "lighter";
        const glowDiameter = DENSITY_RADIUS * 2;

        const time = currentTime * 0.002;
        const shiftX = Math.cos(time) * 7;
        const shiftY = Math.sin(time * 1.3) * 5.5;

        for (let i = 0; i < boidLen; i++) {
          const b = boids[i];
          ctx.drawImage(
            glowMagenta,
            b.x - DENSITY_RADIUS + shiftX,
            b.y - DENSITY_RADIUS + shiftY,
            glowDiameter,
            glowDiameter
          );
          ctx.drawImage(
            glowCyan,
            b.x - DENSITY_RADIUS - shiftX,
            b.y - DENSITY_RADIUS - shiftY,
            glowDiameter,
            glowDiameter
          );
          ctx.drawImage(
            glowSpread,
            b.x - DENSITY_RADIUS,
            b.y - DENSITY_RADIUS,
            glowDiameter,
            glowDiameter
          );
        }

        ctx.globalCompositeOperation = "source-over";

        // Dither spotlight around mouse
        if (mouse.active && mouse.x > 0 && mouse.y > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 260, 0, Math.PI * 2);
          ctx.clip();

          renderDither();

          ctx.restore();
        }
      };

      // 5. SOLID (Original abstract geometric boids)
      const renderSolid = () => {
        ctx.globalCompositeOperation = "source-over";

        // Constellation links
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

        // Render original abstract geometric boids
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

        // Abstract predator reticle around mouse
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
      };

      // Select active render mode
      const currentMode = String(modeRef.current).toLowerCase();
      switch (currentMode) {
        case "prism":
          renderPrism();
          break;
        case "spread":
        case "gradient":
          renderSpread();
          break;
        case "dither":
          renderDither();
          break;
        case "chroma":
          renderChroma();
          break;
        default:
          renderSolid();
          break;
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
      className={`fixed inset-0 pointer-events-none z-0 block w-full h-full ${className ?? ""}`.trim()}
      style={{ opacity: 0.85 }}
    />
  );
}
