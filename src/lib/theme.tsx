"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  { value: "spread", label: "Spread" },
  { value: "prism", label: "Prism" },
  { value: "dither", label: "Dither" },
  { value: "chroma", label: "Chroma" },
  { value: "solid", label: "Solid" },
] as const;

export type Theme = (typeof THEMES)[number]["value"];

export const isTheme = (value: unknown): value is Theme =>
  THEMES.some((theme) => theme.value === value);

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({
  initial = "chroma",
  children,
}: {
  initial?: Theme;
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>(initial);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved && isTheme(saved)) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
