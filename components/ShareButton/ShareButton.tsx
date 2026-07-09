"use client";

import { useState } from "react";
import styles from "./ShareButton.module.scss";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    // Feature-detect: native share sheet on mobile, copy-link fallback elsewhere.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user dismissed the share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently give up rather than crash
    }
  };

  return (
    <button type="button" className={styles.btn} onClick={share}>
      {copied ? "Länk kopierad!" : "Dela schemat"} <i aria-hidden="true">↗</i>
    </button>
  );
}
