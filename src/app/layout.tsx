import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Background from "@/components/Background";
import { ThemeProvider } from "@/lib/theme";
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
  metadataBase: new URL("https://aaronhuang.dev"),
  title: {
    default: "Aaron Huang",
    template: "%s | Aaron Huang",
  },
  description:
    "Engineering Science (Robotics) at University of Toronto. Chief Engineer for FRC 7520. Embedded hardware, robotics, and software engineer.",
  keywords: [
    "Aaron Huang",
    "Robotics",
    "Engineering Science",
    "University of Toronto",
    "FRC 7520",
    "Embedded Systems",
    "Control Systems",
    "RunTheBot",
    "Portfolio",
  ],
  authors: [{ name: "Aaron Huang", url: "https://aaronhuang.dev" }],
  creator: "Aaron Huang",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "76x76" },
    ],
  },
  manifest: "/favicons/site.webmanifest",
  openGraph: {
    title: "Aaron Huang",
    description:
      "Engineering Science (Robotics) at University of Toronto. Chief Engineer for FRC 7520. Embedded hardware, robotics, and software engineer.",
    url: "https://aaronhuang.dev",
    siteName: "Aaron Huang",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/images/me.png",
        width: 1200,
        height: 630,
        alt: "Aaron Huang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaron Huang",
    description:
      "Engineering Science (Robotics) at University of Toronto. Chief Engineer for FRC 7520.",
    site: "@RunTheBot",
    creator: "@RunTheBot",
    images: ["/images/me.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aaron Huang",
  alternateName: "RunTheBot",
  url: "https://aaronhuang.dev",
  image: "https://aaronhuang.dev/images/me.png",
  jobTitle: "Robotics & Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Toronto",
  },
  sameAs: [
    "https://github.com/RunTheBot",
    "https://linkedin.com/in/haaron",
    "https://twitter.com/RunTheBot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className="dark scroll-smooth">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased bg-[#0a0a0b] text-[#e8e6e1] min-h-screen relative`}
        >
          <ThemeProvider initial="prism">
            <Background />
            <div className="relative z-10">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
