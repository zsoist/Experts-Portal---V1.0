import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@experts/config", "@experts/contracts", "@experts/ui"],
};

export default nextConfig;
