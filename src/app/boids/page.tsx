"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import ScrollArrow from "@/components/ScrollArrow";
import { useTheme } from "@/lib/theme";

export default function BoidsPage() {
  const { setTheme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTheme("solid");
  }, [setTheme]);

  const scrollToSection = (section: HTMLElement | null) => {
    const container = scrollContainerRef.current;
    if (!section || !container) return;

    container.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  };

  const scrollToAbout = () => {
    scrollToSection(aboutRef.current);
  };

  const scrollToWhy = () => {
    scrollToSection(whyRef.current);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {/* Fixed Back Navigation - stays visible while scrolling */}
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

      {/* Hero Section */}
      <section className="relative h-screen snap-start snap-always flex flex-col justify-between p-6 md:p-10">
        {/* Spacer for top nav height */}
        <div className="h-6" />

        {/* Centered animated text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center select-none py-12">
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-lg sm:text-2xl md:text-3xl text-white/60 mb-2 tracking-wide"
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

        <ScrollArrow onClick={scrollToAbout} label="Scroll to about section" className="pb-4" />
      </section>

      {/* Next Section with Blurb */}
      <section
        id="about"
        ref={aboutRef}
        className="relative h-screen snap-start snap-always flex flex-col justify-center max-w-[900px] mx-auto px-6 md:px-10 py-24"
      >
        {/* Spacer for navigation */}
        <div className="h-6" />

        <div className="flex-1 flex justify-center items-center space-y-6 flex-col">
          <p className="text-white/70 text-justify">
            <Link
              href="https://en.wikipedia.org/wiki/Boids"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline text-gray-300 transition-colors hover:text-white"
            >
              <span className="float-left mr-2 mb-[-2rem] font-serif text-8xl font-medium italic leading-[0.55] text-[#f1eee7] decoration-1 transition-colors group-hover:text-white md:text-9xl underline underline-offset-4">
                B
              </span>
              <span className="decoration-1 underline underline-offset-4">oids</span>
            </Link>{" "}is an artificial life algorithm, developed by Craig Reynolds in 1986, which simulates the flocking behaviour of birds, and related group motion. His paper on this topic was published in 1987 in the proceedings of the ACM SIGGRAPH conference. The name "boid" corresponds to a shortened version of "bird-oid object", which refers to a bird-like object, as well as referencing the stereotypical New York pronunciation of 'bird' as /'bəɪd/. Reynolds' boid model is one example of a larger general concept, for which many other variations have been developed since. The closely related work of Ichiro Aoki is noteworthy because it was published in 1982 - five years before Reynolds' boids paper.
          </p>
        </div>

        <ScrollArrow onClick={scrollToWhy} label="Scroll to Why Boids?" className="pt-8 pb-2" />
      </section>

      {/* Why Boids? */}

      <section 
        className="relative h-screen snap-start snap-always flex flex-col justify-center max-w-[900px] mx-auto px-6 md:px-10 py-24"
        id="why-boids"
        ref={whyRef}
      >
        <div className="space-y-6 text-white/70 text-justify">
          <p>
            When making this second version of my portfolio, I asked myself, "How can I make this website feel alive?" Welp, what better way to make a website feel alive than to have a simulated lifeform as the background! I then also make the mouse cursor a predator, and many html elements on the page soft objects that the boids will avoid. 
          </p>
          <span className="block text-center text-gray-200 text-6xl font-serif">Go on! Try it out!</span>
        </div>

      </section>
    </div>
  );
}
