import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
