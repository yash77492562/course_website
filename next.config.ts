import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
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
  
  // Fix Video.js package.json parsing issue
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore Video.js package.json files that cause parsing errors
      config.resolve.alias = {
        ...config.resolve.alias,
        'video.js/package.json': false,
      };
    }
    return config;
  },
  
  async rewrites() {
    // Use Docker internal network in production, localhost in development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3002';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,  // No /api prefix on backend
      },
    ];
  },
};

export default nextConfig;