"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Hero.module.scss";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const hero = root.current!;

      // Load reveal: logo fades in, then the title lines rise line by line.
      // No overflow mask — it would clip the heading stroke.
      gsap
        .timeline()
        .to(logoRef.current, { opacity: 1, duration: 0.8, ease: "power1.out" }, 0)
        .to(
          `.${styles.line}`,
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.14 },
          0.22,
        );

      // Parallax: background lags behind content (0.30), logo drifts slightly
      // faster than the title (0.07). scrub: true drives the transform straight
      // from the scroll position — no catch-up lag.
      const parallax = (target: gsap.TweenTarget, factor: number) =>
        gsap.to(target, {
          y: () => hero.offsetHeight * factor,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

      parallax(bgRef.current, 0.3);
      parallax(logoRef.current, -0.07);
    },
    { scope: root },
  );

  return (
    <section className={styles.hero} ref={root}>
      <div className={styles.bg} ref={bgRef} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.mid}>
          <span className={styles.logo} ref={logoRef}>
            <img src="/logo/logo.svg" alt="Piteå Hockey" />
          </span>
          <h1 className={styles.title}>
            <span className={`${styles.line} ${styles.stroked}`}>Hockey&shy;skola</span>
            <span className={`${styles.line} ${styles.strokedRed}`}>2026</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
