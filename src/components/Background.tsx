"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import BoidsBackground, { RenderMode } from "@/components/BoidsBackground";

export default function Background() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#0a0a0b] pointer-events-none z-0" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <BoidsBackground mode={theme as RenderMode} />
    </div>
  );
}
