"use client";

import React from "react";
import { THEMES, useTheme } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="group fixed bottom-0 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center px-10 pt-8 pb-3 pointer-events-auto">
      <nav className="pointer-events-none mb-3 flex translate-y-2 items-center gap-1 rounded-full border border-white/15 bg-zinc-950/85 px-2 py-1.5 font-mono text-xs md:text-sm opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {THEMES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`shrink-0 cursor-pointer rounded-full px-3 py-1 transition-all duration-200 ${
              theme === option.value
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </nav>
      {/* Grab handle - hover to reveal the theme switcher */}
      <div className="h-1.5 w-12 rounded-full bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-white/60 shadow-lg cursor-pointer" />
    </div>
  );
}
