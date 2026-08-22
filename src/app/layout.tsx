import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import BoidsBackground from "@/components/BoidsBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aaron Huang",
  description:
    "Engineering Science (Robotics) at University of Toronto. Chief Engineer for FRC 7520.",
  authors: [{ name: "Aaron Huang", url: "https://aaronhuang.dev" }],
  openGraph: {
    title: "Aaron Huang",
    description:
      "Engineering Science (Robotics) at University of Toronto. Chief Engineer for FRC 7520.",
    url: "https://aaronhuang.dev",
    siteName: "Aaron Huang",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className="dark scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased bg-[#0a0a0b] text-[#e8e6e1] min-h-screen relative`}
        >
          <BoidsBackground />
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
          <div className="relative z-10">{children}</div>
        </body>
      </html>
    </ViewTransitions>
  );
}
