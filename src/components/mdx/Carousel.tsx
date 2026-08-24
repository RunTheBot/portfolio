"use client";

import React, { useRef, useState, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode;
}

/**
 * A smooth scroll carousel for MDX content.
 * Usage in MDX:
 *   <Carousel>
 *     <MDXImage src="..." alt="Caption A" />
 *     <MDXImage src="..." alt="Caption B" />
 *   </Carousel>
 */
export default function Carousel({ children }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const slides = Children.toArray(children);
  const total = slides.length;

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, total - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setCurrent(clamped);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="my-6 not-prose">
      {/* Scroll container */}
      <div className="relative border border-white/[0.15] bg-white/[0.02] overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {slides.map((child, i) => (
            <div key={i} className="w-full flex-shrink-0 snap-center">
              {child}
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => scrollTo(current - 1)}
              disabled={current === 0}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/60 border border-white/20 text-white/70 hover:text-white hover:bg-black/80 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo(current + 1)}
              disabled={current === total - 1}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/60 border border-white/20 text-white/70 hover:text-white hover:bg-black/80 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-white/70"
                  : "w-1.5 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
