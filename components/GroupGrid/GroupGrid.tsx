"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import GroupCard, { type GroupCardData } from "../GroupCard/GroupCard";
import styles from "./GroupGrid.module.scss";

export default function GroupGrid({ groups }: { groups: GroupCardData[] }) {
  const root = useRef<HTMLElement>(null);

  // Cards stagger in (fade + rise) when the grid scrolls into view.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to("[data-tile]", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.groups} ref={root}>
      <h2 className={styles.heading}>Välj grupp</h2>
      <nav className={styles.grid} aria-label="Grupper">
        {groups.map((group) => (
          <GroupCard key={group.id} {...group} />
        ))}
      </nav>
    </section>
  );
}
