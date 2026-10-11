import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // The dev server only serves its scripts to localhost, so opened from another device (a phone,
  // over Tailscale) the page never hydrates. Dev only; production builds ignore it.
  allowedDevOrigins: ["100.119.128.107"],
  async redirects() {
    return [{ source: "/support", destination: "/contact", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
