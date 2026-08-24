"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme";

export default function BoidsPage() {
  const { setTheme } = useTheme();
  const aboutRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTheme("solid");
  }, [setTheme]);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWhy = () => {
    whyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">

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
      <section className="relative h-screen snap-start snap-always flex flex-col justify-between px-6 md:px-10 py-6 md:py-10">

        {/* Top-right section counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
          className="self-end font-mono text-[11px] text-white/20 tracking-widest pt-2"
        >
          01 / 03
        </motion.div>

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
          transition={{ duration: 1.2, delay: 4.0, ease: "easeOut" }}
          className="flex justify-center pb-2"
        >
          <button
            type="button"
            onClick={scrollToAbout}
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
        ref={aboutRef}
        className="relative h-screen snap-start snap-always flex flex-col justify-between px-6 md:px-10 py-6 md:py-10"
      >
        {/* Top-right section counter */}
        <div className="self-end font-mono text-[11px] text-white/20 tracking-widest pt-2">
          02 / 03
        </div>

        <div className="w-full max-w-[900px] mx-auto my-auto">
          {/* Top rule + label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[11px] text-white/20 tracking-widest shrink-0">02</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

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
                  Wikipedia
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom rule */}
          <div className="mt-12 h-px bg-white/[0.04]" />
        </div>

        {/* Scroll arrow to Section 03 */}
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={scrollToWhy}
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
        className="relative h-screen snap-start snap-always flex flex-col justify-center max-w-[900px] mx-auto px-6 md:px-10 py-24"
        id="why-boids"
        ref={whyRef}
      >
        <div className="space-y-6 text-white/70 text-justify">
          <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/60 font-sans">
            When making this second version of my portfolio, I asked myself, &quot;How can I make this website feel alive?&quot; Welp, what better way to make a website feel alive than to have a simulated lifeform as the background! I then also make the mouse cursor a predator, and many html elements on the page soft objects that the boids will avoid. 
          </p>
          <span className="block text-center text-gray-200 text-5xl md:text-6xl font-serif pt-4">
            Go on! Try it out!
          </span>
        </div>
      </section>

    </main>
  );
}
