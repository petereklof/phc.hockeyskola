"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ContactRefKey,
  DaySchedule,
  Location,
  Menu,
  ScheduleEvent,
  SharedContact,
} from "@/lib/content";
import EventModal from "@/components/EventModal/EventModal";
import ScheduleDay from "@/components/ScheduleDay/ScheduleDay";
import styles from "./ScheduleSection.module.scss";

interface ScheduleSectionProps {
  schedule: DaySchedule[];
  locations: Record<string, Location>;
  menu: Menu;
  contactsShared: Record<ContactRefKey, SharedContact>;
}

interface Selected {
  event: ScheduleEvent;
  date: string;
}

// Local ISO date (not UTC) so the "today" check flips at Swedish midnight.
function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// "Måndag" + "2026-08-03" -> "Mån 3/8"
function tabLabel(day: DaySchedule): string {
  return `${day.weekday.slice(0, 3)} ${Number(day.date.slice(8, 10))}/${Number(day.date.slice(5, 7))}`;
}

export default function ScheduleSection({
  schedule,
  locations,
  menu,
  contactsShared,
}: ScheduleSectionProps) {
  const [selected, setSelected] = useState<Selected | null>(null);
  const [active, setActive] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // The slider is only as tall as the day being shown. The height is driven
  // directly from the swipe position (lerp between the outgoing and incoming
  // panel heights), so the bottom edge follows the finger instead of clipping
  // the taller day or leaving dead space under the shorter one.
  const syncHeight = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const panels = Array.from(slider.children) as HTMLElement[];
    if (panels.length === 0) return;

    const heights = panels.map((panel) => (panel.firstElementChild as HTMLElement).offsetHeight);
    const progress = slider.clientWidth > 0 ? slider.scrollLeft / slider.clientWidth : 0;
    const from = Math.min(Math.floor(progress), heights.length - 1);
    const to = Math.min(from + 1, heights.length - 1);
    const fraction = progress - from;

    slider.style.height = `${heights[from] + (heights[to] - heights[from]) * fraction}px`;
  };

  const goTo = (index: number, smooth: boolean) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slider.scrollTo({
      left: index * slider.clientWidth,
      behavior: smooth && !reduce ? "smooth" : "auto",
    });
    setActive(index);
  };

  // Initial height + keep it in sync when panel content or viewport resizes.
  useEffect(() => {
    syncHeight();
    const slider = sliderRef.current;
    if (!slider) return;
    const observer = new ResizeObserver(syncHeight);
    observer.observe(slider);
    for (const panel of slider.children) observer.observe(panel.firstElementChild as Element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default day: today if we're mid-camp, otherwise Monday. Runs client-side
  // only — the pages are prerendered, so the server can't know "today".
  useEffect(() => {
    const index = schedule.findIndex((day) => day.date === todayIso());
    if (index > 0) goTo(index, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    syncHeight();
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    if (index !== active) setActive(index);
  };

  return (
    <section className={styles.schedule}>
      <h2 className={styles.heading}>Schema</h2>

      <div className={styles.tabs} role="tablist" aria-label="Välj dag">
        {schedule.map((day, index) => (
          <button
            key={day.date}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={styles.tab}
            onClick={() => goTo(index, true)}
          >
            {tabLabel(day)}
          </button>
        ))}
      </div>

      <div className={styles.slider} ref={sliderRef} onScroll={onScroll}>
        {schedule.map((day, index) => (
          <div className={styles.panel} key={day.date}>
            <div className={styles.panelInner}>
              <ScheduleDay
                day={day}
                locations={locations}
                isActive={index === active}
                onSelect={(event) => setSelected({ event, date: day.date })}
              />
            </div>
          </div>
        ))}
      </div>

      <EventModal
        event={selected?.event ?? null}
        date={selected?.date ?? null}
        locations={locations}
        menu={menu}
        contactsShared={contactsShared}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
