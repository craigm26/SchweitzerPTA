import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,

  // Keep native modules out of the bundler. @napi-rs/canvas ships a .node
  // binding that Turbopack can't place in an ESM chunk; pdfjs-dist's legacy
  // build is loaded dynamically and shouldn't be split either.
  serverExternalPackages: ['@napi-rs/canvas', 'pdfjs-dist'],

  // pdfjs-dist v5 dynamically imports its worker module, which Vercel's file
  // tracer doesn't statically detect. Force-include it for the upload route.
  outputFileTracingIncludes: {
    '/api/events/upload-flyer': [
      './node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
    ],
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons',
      },
      {
        protocol: 'https',
        hostname: 'icon.horse',
        pathname: '/icon/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        pathname: '/**',
      },
    ],
  },

  // Compiler optimizations - remove console logs in production (except errors and warnings)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
