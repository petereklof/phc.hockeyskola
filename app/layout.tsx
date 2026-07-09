import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { headingFont, bodyFont } from "./fonts";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Hockeyskola 2026 – Piteå Hockey",
  description:
    "Schema och praktisk information för Piteå Hockeys sommarhockeyskola, 3–8 augusti 2026 i Piteå.",
};

export const viewport: Viewport = {
  themeColor: "#211E1E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
