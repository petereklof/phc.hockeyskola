"use client";

import { useState } from "react";
import styles from "./SaveAsApp.module.scss";

type Platform = "ios" | "android";

export default function SaveAsApp({ intro }: { intro: string }) {
  const [platform, setPlatform] = useState<Platform>("ios");

  return (
    <section className={styles.app}>
      <h2 className={styles.heading}>Spara som app</h2>
      <p className={styles.intro}>{intro}</p>

      <div className={styles.toggle} role="tablist" aria-label="Välj plattform">
        <button
          type="button"
          role="tab"
          className={styles.pill}
          aria-selected={platform === "ios"}
          onClick={() => setPlatform("ios")}
        >
          iPhone
        </button>
        <button
          type="button"
          role="tab"
          className={styles.pill}
          aria-selected={platform === "android"}
          onClick={() => setPlatform("android")}
        >
          Android
        </button>
      </div>

      <ol className={styles.steps} hidden={platform !== "ios"}>
        <li>
          <span className={styles.stepText}>
            Öppna sajten i <b>Safari</b>
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Tryck på <b>dela-knappen</b> längst ner
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Välj <b>”Lägg till på hemskärmen”</b>
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Tryck <b>Lägg till</b> uppe till höger
          </span>
        </li>
      </ol>

      <ol className={styles.steps} hidden={platform !== "android"}>
        <li>
          <span className={styles.stepText}>
            Öppna sajten i <b>Chrome</b>
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Tryck på <b>⋮</b> uppe till höger
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Välj <b>”Lägg till på startskärmen”</b>
          </span>
        </li>
        <li>
          <span className={styles.stepText}>
            Bekräfta med <b>Lägg till</b>
          </span>
        </li>
      </ol>
    </section>
  );
}
