"use client";

import React, { useState } from "react";
import type { ProfileData } from "@/lib/mdx";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Header({ profile }: { profile: ProfileData }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-14">
          {/* Name */}
          <a href="#" className="font-serif text-xl text-[#f1eee7] hover:opacity-80 transition-opacity">
            {profile.name}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-white/50 hover:text-white/90 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-3.5 py-1.5 text-[13px] text-[#0a0a0b] bg-[#e8e6e1] rounded-none font-medium hover:bg-white transition-colors"
            >
              Resume
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/50 hover:text-white text-sm"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.06] pt-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-3.5 py-2 text-sm text-[#0a0a0b] bg-[#e8e6e1] rounded-none font-medium text-center hover:bg-white transition-colors"
            >
              Resume
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
