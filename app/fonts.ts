import localFont from "next/font/local";

export const headingFont = localFont({
  src: "../public/fonts/MBJ Chunky.ttf",
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = localFont({
  src: [
    { path: "../public/fonts/IBMPlexMono-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/IBMPlexMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
