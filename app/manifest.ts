import type { MetadataRoute } from "next";

// PWA scope = manifest + installable only. Deliberately NO service worker /
// offline: content changes during the week and a stale cached schedule would
// be worse than none (tech-stack.md §9).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PHC Sommarhockeyskola 2026",
    short_name: "HS2026",
    description:
      "Schema och praktisk information för Piteå Hockeys sommarhockeyskola, 3–8 augusti 2026.",
    lang: "sv",
    start_url: "/",
    display: "standalone",
    theme_color: "#211E1E",
    background_color: "#211E1E",
    icons: [
      {
        src: "/favicons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
