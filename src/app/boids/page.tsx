"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { THEMES, Theme, useTheme } from "@/lib/theme";

const THEME_DESCRIPTIONS: Record<string, string> = {
  solid: "High-contrast monochrome focusing on flocking geometry and velocity vectors.",
  prism: "Refractive spectral dispersion casting prismatic trails across the canvas.",
  chroma: "Dynamic velocity-reactive gradients flowing through flock clusters.",
  dither: "Ordered raster matrices channeling retro graphics workstations.",
  spread: "Kinetic spatial variance and dynamic turbulence diffusion.",
};

export default function BoidsPage() {
  const { theme, setTheme } = useTheme();
  const containerRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState<number>(0);

  const enabledThemes = THEMES.filter((t) => t.enabled);

  // Set up robust IntersectionObserver attached directly to the custom scroll container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveSection(index);

            const targetTheme = entry.target.getAttribute("data-theme");
            if (targetTheme) {
              setTheme(targetTheme as Theme);
            } else {
              setTheme("solid");
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setTheme, enabledThemes.length]);

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    sectionRefs.current[0]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {/* Fixed Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        className="fixed top-6 left-6 md:top-10 md:left-10 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </motion.div>

      {/* ─── Section 01 — Hero ─── */}
      <section
        data-index={0}
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="relative h-screen snap-start snap-always flex flex-col justify-between px-6 md:px-10 py-6 md:py-10"
      >
        <div className="h-6" />

        {/* Centered type */}
        <div className="flex-1 flex flex-col items-center justify-center text-center select-none">
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-lg sm:text-2xl md:text-3xl text-white/50 mb-1 tracking-wide"
          >
            These, are
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.4, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-7xl sm:text-9xl md:text-[11rem] font-medium tracking-tight text-[#f1eee7] leading-none"
          >
            BOIDS
          </motion.h1>
        </div>

        {/* Scroll arrow to Section 02 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.2, ease: "easeOut" }}
          className="flex justify-center pb-2"
        >
          <button
            type="button"
            onClick={() => scrollToSection(1)}
            aria-label="Scroll to about section"
            className="group flex flex-col items-center gap-2 cursor-pointer p-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* ─── Section 02 — About ─── */}
      <section
        id="about"
        data-index={1}
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="relative h-screen snap-start snap-always flex flex-col justify-between px-6 md:px-10 py-6 md:py-10"
      >
        <div className="h-6" />

        <div className="w-full max-w-[900px] mx-auto my-auto">
          {/* Two-column editorial layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 items-start">
            {/* Left — section heading */}
            <div className="md:col-span-1">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f1eee7] leading-tight">
                What are<br />
                <span className="italic text-white/50">boids?</span>
              </h2>
            </div>

            {/* Right — blurb & wikipedia link */}
            <div className="md:col-span-2 space-y-6 border-l border-white/[0.08] pl-6 md:pl-10">
              <p className="text-[15px] leading-[1.8] text-white/50 font-sans">
                Developed by Craig Reynolds in 1986, Boids is an artificial life program simulating the flocking behaviour of birds. Instead of a central controller, complex swarm intelligence emerges from simple, local steering rules applied to each autonomous agent.
              </p>
              <div>
                <a
                  href="https://en.wikipedia.org/wiki/Boids"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-white/45 hover:text-white transition-colors underline decoration-white/20 underline-offset-[3px] hover:decoration-white/60"
                >
                  Read the Wikipedia article
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll arrow to Section 03 */}
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={() => scrollToSection(2)}
            aria-label="Scroll to why boids section"
            className="group flex flex-col items-center gap-2 cursor-pointer p-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
            </motion.div>
          </button>
        </div>
      </section>

      {/* ─── Section 03 — Why Boids? ─── */}
      <section
        id="why-boids"
        data-index={2}
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="relative h-screen snap-start snap-always flex flex-col justify-between px-6 md:px-10 py-6 md:py-10"
      >
        <div className="h-6" />

        <div className="w-full max-w-[900px] mx-auto my-auto space-y-8">
          <div className="space-y-6 text-white/70 text-justify">
            <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/60 font-sans">
              When making this second version of my portfolio, I asked myself, &quot;How can I make this website feel alive?&quot; Welp, what better way to make a website feel alive than to have a simulated lifeform as the background! I then also make the mouse cursor a predator, and many html elements on the page soft objects that the boids will avoid. 
            </p>
            <span className="block text-center text-gray-200 text-5xl md:text-6xl font-serif pt-4">
              Go on! Try it out!
            </span>
            <p className="text-center font-mono text-xs text-white/40 pt-2 tracking-wide">
              Hover over particles to scatter the swarm &middot; Scroll down to preview render themes
            </p>
          </div>
        </div>

        {/* Scroll arrow to first Theme section */}
        {enabledThemes.length > 0 && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={() => scrollToSection(3)}
              aria-label="Scroll to themes"
              className="group flex flex-col items-center gap-2 cursor-pointer p-2"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
              </motion.div>
            </button>
          </div>
        )}
      </section>

      {/* ─── Programmatic Theme Sections ─── */}
      {enabledThemes.map((themeOption, idx) => {
        const sectionIndex = 3 + idx;
        const description = THEME_DESCRIPTIONS[themeOption.value] ?? "";
        const isLastSection = idx === enabledThemes.length - 1;
        const isActive = activeSection === sectionIndex;

        return (
          <section
            key={themeOption.value}
            id={`theme-${themeOption.value}`}
            data-index={sectionIndex}
            data-theme={themeOption.value}
            ref={(el) => { sectionRefs.current[sectionIndex] = el; }}
            className="relative h-screen snap-start snap-always flex flex-col justify-between items-center text-center px-6 md:px-10 py-8 select-none"
          >
            <div className="h-6" />

            {/* Big cinematic title with active fade & unblur */}
            <motion.div
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.25,
                y: isActive ? 0 : 20,
                scale: isActive ? 1 : 0.96,
                filter: isActive ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-4 max-w-2xl"
            >
              <p className="font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-white/35">
                Theme name
              </p>
              <h2 className="font-serif text-6xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#f1eee7]">
                {themeOption.label}
              </h2>
              {description && (
                <p className="font-serif italic text-base sm:text-lg text-white/45 pt-2 max-w-lg leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>

            {/* Bottom navigation: next theme or back to top */}
            <div className="flex justify-center pb-2">
              {isLastSection ? (
                <button
                  type="button"
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  className="group flex flex-col items-center gap-1.5 font-mono text-[11px] text-white/30 hover:text-white/80 transition-colors cursor-pointer p-2"
                >
                  <ArrowUp className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  <span>Back to top</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection(sectionIndex + 1)}
                  aria-label="Scroll to next theme"
                  className="group flex flex-col items-center gap-2 cursor-pointer p-2"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
                  </motion.div>
                </button>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}
