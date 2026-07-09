import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { headingFont, bodyFont } from "./fonts";
import "./globals.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Hockeyskola 2026 – Piteå Hockey",
  description:
    "Schema och praktisk information för Piteå Hockeys sommarhockeyskola, 3–8 augusti 2026 i Piteå.",
  applicationName: "HS2026",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "48x48" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "HS2026",
    statusBarStyle: "black-translucent",
  },
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
        <div className={styles.shell}>{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
