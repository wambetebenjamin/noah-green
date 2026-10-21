import type { NextConfig } from "next";

/**
 * Noah Green Next.js configuration.
 * The uploaded zip template is a static Bootstrap 4 site with no build
 * configuration, so nothing is removed here. Only additions, per the brief.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
