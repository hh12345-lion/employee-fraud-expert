import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    // Largest generated width is 1920px (the default goes to 3840px, which produced 300–700 KB photos).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
