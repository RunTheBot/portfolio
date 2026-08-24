import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boids Flocking Simulation | Aaron Huang",
  description:
    "Interactive emergent flocking simulation demonstrating Craig Reynolds' Boids algorithm with predator avoidance and customizable shader themes.",
  alternates: {
    canonical: "/boids",
  },
  openGraph: {
    title: "Boids Flocking Simulation | Aaron Huang",
    description:
      "Interactive emergent flocking simulation demonstrating Craig Reynolds' Boids algorithm with predator avoidance and customizable shader themes.",
    url: "https://aaronhuang.dev/boids",
    type: "website",
    images: [
      {
        url: "/images/me.png",
        width: 1200,
        height: 630,
        alt: "Boids Simulation by Aaron Huang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boids Flocking Simulation | Aaron Huang",
    description:
      "Interactive emergent flocking simulation demonstrating Craig Reynolds' Boids algorithm with predator avoidance and customizable shader themes.",
    creator: "@RunTheBot",
    images: ["/images/me.png"],
  },
};

export default function BoidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
