import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/planner",
        destination: "/",
      },
      {
        source: "/media",
        destination: "/",
      },
      {
        source: "/channels",
        destination: "/",
      },
      {
        source: "/settings",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
