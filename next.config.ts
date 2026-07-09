import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // Lets every .module.scss do `@use "tokens" as *;` regardless of nesting depth.
    includePaths: [path.join(process.cwd(), "styles")],
  },
};

export default nextConfig;
