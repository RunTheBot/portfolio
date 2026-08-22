"use client";

import React, { useState } from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

const SOCIALS = [
  { label: "GitHub", handle: "@RunTheBot", url: PERSONAL_INFO.github },
  { label: "LinkedIn", handle: "in/haaron", url: PERSONAL_INFO.linkedin },
  { label: "Twitter", handle: "@RunTheBot", url: PERSONAL_INFO.twitter },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="space-y-8 scroll-mt-20">
      <h2 className="font-serif text-2xl text-[#f1eee7]">Contact</h2>

      <div className="space-y-6">
        <p className="text-[15px] text-white/50 leading-[1.8] max-w-lg">
          I&rsquo;m open to co-op opportunities, collaborations, and conversations
          about robotics, controls, or anything engineering. Feel free to reach
          out.
        </p>

        {/* Email */}
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="text-[15px] text-[#f1eee7] underline decoration-white/20 underline-offset-[3px] hover:decoration-white/60 transition-colors"
          >
            {PERSONAL_INFO.email}
          </a>
          <button
            onClick={handleCopy}
            className="p-1.5 text-white/25 hover:text-white/60 transition-colors"
            title="Copy email"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          {copied && (
            <span className="text-[11px] text-white/30">Copied</span>
          )}
        </div>

        {/* Socials */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-white/35 hover:text-white/70 transition-colors"
            >
              {s.label}
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-12 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/20 font-mono">
        <span>© {new Date().getFullYear()} Aaron Huang</span>
        <a
          href="https://github.com/RunTheBot/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/40 transition-colors"
        >
          Source
        </a>
      </footer>
    </section>
  );
}
