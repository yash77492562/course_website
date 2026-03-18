import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix turbopack root directory warning
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
