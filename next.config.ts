import type { NextConfig } from "next";

const repo = "nats";
/** GitHub Pages lives at /nats; local `next build` + `serve out` uses /. */
const basePath = process.env.GITHUB_PAGES === "true" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
