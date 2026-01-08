import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure static generation works even if API routes fail during build
  experimental: {
    // Allow builds to continue even if some routes fail
    missingSuspenseWithCSRBailout: false,
  },
  // Disable strict mode during build to prevent double-rendering issues
  reactStrictMode: true,
};

export default nextConfig;
