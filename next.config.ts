import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export the site to static HTML/CSS/JS (the `out/` folder),
  // which the Express server serves in production.
  output: "export",
  // Static export has no server, so image optimization must be disabled.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
