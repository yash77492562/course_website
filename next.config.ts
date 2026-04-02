import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack optimizations for reduced CPU usage
  turbopack: {
    root: __dirname,
  },
  
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce memory usage and CPU overhead
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 2, // Keep only 2 pages in memory
  },
  
  // Allow R2 videos and images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'influbee.edf54fe3baf509501a8c1ba24eb000dd.r2.cloudflarestorage.com',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com https://*.r2.cloudflarestorage.com; media-src 'self' https://*.r2.cloudflarestorage.com blob: data:; img-src 'self' https://*.r2.cloudflarestorage.com data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3002 https://*.r2.cloudflarestorage.com;",
          },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ];
  },
};

export default nextConfig;