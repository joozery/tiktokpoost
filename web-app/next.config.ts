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
      // Proxy Supabase Storage through our Verified Next.js Domain for TikTok API
      {
        source: "/storage/:path*",
        destination: "https://grrbzmzfoyfmkptqtzhl.supabase.co/storage/v1/object/public/:path*",
      },
    ];
  },
};

export default nextConfig;
