import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // Lets every .module.scss do `@use "tokens" as *;` regardless of nesting
    // depth. Turbopack uses the modern Sass API (loadPaths); includePaths kept
    // for the legacy webpack path.
    loadPaths: [path.join(process.cwd(), "styles")],
    includePaths: [path.join(process.cwd(), "styles")],
  },
};

export default nextConfig;
