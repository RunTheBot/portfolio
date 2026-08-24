"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { THEMES, useTheme } from "@/lib/theme";
import { FileQuestionIcon, PaletteIcon } from "lucide-react";

/** A dot swatch for each theme so users can preview before clicking */
const THEME_COLORS: Record<string, string[]> = {
  prism:  ["#a78bfa", "#60a5fa", "#34d399"],
  solid:  ["#6b7280", "#4b5563", "#374151"],
  spread: ["#f472b6", "#fb923c", "#facc15"],
  dither: ["#a3e635", "#22d3ee", "#818cf8"],
  chroma: ["#f87171", "#fbbf24", "#4ade80"],
};

function ThemeDots({ value }: { value: string }) {
  const colors = THEME_COLORS[value] ?? ["#ffffff", "#888888", "#444444"];
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {colors.map((c, i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: c }}
        />
      ))}
    </span>
  );
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const enabledThemes = THEMES.filter((t) => t.enabled);
  const currentTheme = THEMES.find((t) => t.value === theme);

  return (
    <div
      ref={ref}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2"
    >
      {/* Theme options panel */}
      <div
        role="menu"
        aria-label="Theme switcher"
        className={`flex flex-col gap-1 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-md transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <p className="px-2 pb-1 pt-0.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
          Theme
        </p>
        {enabledThemes.map((option) => (
          <button
            key={option.value}
            role="menuitem"
            type="button"
            onClick={() => {
              setTheme(option.value);
              setOpen(false);
            }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left font-mono text-xs transition-all duration-150 ${
              theme === option.value
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ThemeDots value={option.value} />
            <span className="flex-1">{option.label}</span>
            {theme === option.value && (
              <span className="ml-auto text-[10px] text-white/40">✓</span>
            )}
          </button>
        ))}
        {/* <div className="mx-2 my-1 border-t border-white/10" />
        <Link
          href="/boids"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs text-zinc-500 transition-all duration-150 hover:bg-white/5 hover:text-white/70"
        >
          <FileQuestionIcon className="h-3 w-3" />
          About the background
        </Link> */}
      </div>

      {/* FAB trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Change theme (current: ${currentTheme?.label ?? theme})`}
        title="Change theme"
        className={`group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-xl transition-all duration-200 ${
          open
            ? "border-white/20 bg-zinc-800 shadow-white/5"
            : "border-white/10 bg-zinc-950/80 hover:border-white/20 hover:bg-zinc-800 hover:shadow-white/5"
        } backdrop-blur-md`}
      >
        <PaletteIcon
          className={`h-5 w-5 transition-all duration-200 ${
            open ? "text-white/70" : "text-white/30 group-hover:text-white/50"
          }`}
        />
      </button>
    </div>
  );
}
