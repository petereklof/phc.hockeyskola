"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { DaySchedule, Location, ScheduleEvent } from "@/lib/content";
import styles from "./ScheduleDay.module.scss";

interface ScheduleDayProps {
  day: DaySchedule;
  locations: Record<string, Location>;
  onSelect: (event: ScheduleEvent) => void;
}

// All camp dates are in August 2026; show "3 augusti" from the ISO date.
function dayLabel(isoDate: string): string {
  return `${Number(isoDate.slice(8, 10))} augusti`;
}

function timeLabel(event: ScheduleEvent): string {
  return event.timeEnd ? `${event.timeStart}–${event.timeEnd}` : event.timeStart;
}

export default function ScheduleDay({ day, locations, onSelect }: ScheduleDayProps) {
  const root = useRef<HTMLElement>(null);

  // Light stagger-in as the day's list scrolls into view. gsap.from (not a
  // CSS-hidden initial state) so the schedule stays readable without JS.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(`.${styles.row}`, {
        opacity: 0,
        y: 14,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.day} ref={root}>
      <header className={styles.dayHead}>
        <h3 className={styles.weekday}>{day.weekday}</h3>
        <span className={styles.date}>{dayLabel(day.date)}</span>
      </header>

      <ul className={styles.list}>
        {day.events.map((event) => {
          const location = event.modalContent?.locationId
            ? locations[event.modalContent.locationId]
            : null;
          const clickable = event.modalContent !== null;
          const rowClass = `${styles.row} ${event.category === "training" ? styles.training : styles.other}`;

          const inner = (
            <>
              <span className={styles.time}>{timeLabel(event)}</span>
              <span className={styles.body}>
                <span className={styles.title}>{event.title}</span>
                {location && <span className={styles.location}>{location.name}</span>}
              </span>
              {clickable && (
                <span className={styles.chevron} aria-hidden="true">
                  →
                </span>
              )}
            </>
          );

          return (
            <li key={event.id}>
              {clickable ? (
                <button type="button" className={rowClass} onClick={() => onSelect(event)}>
                  {inner}
                </button>
              ) : (
                <div className={`${rowClass} ${styles.static}`}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
