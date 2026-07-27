"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
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
  const activeRef = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const panelHeight = (index: number): number => {
    const track = trackRef.current;
    const panel = track?.children[index] as HTMLElement | undefined;
    return panel ? (panel.firstElementChild as HTMLElement).offsetHeight : 0;
  };

  const { contextSafe } = useGSAP({ scope: sliderRef });

  // Days are navigated from the tabs only (no swipe): the track slides
  // sideways one full panel per day, and the slider animates to the incoming
  // panel's height in the same tween so the content below moves smoothly.
  const goTo = contextSafe((index: number, smooth: boolean) => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;
    activeRef.current = index;
    setActive(index);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { xPercent: -index * 100, height: panelHeight(index) };
    if (!smooth || reduce) {
      gsap.set(track, { xPercent: target.xPercent });
      gsap.set(slider, { height: target.height });
      return;
    }
    gsap.to(track, {
      xPercent: target.xPercent,
      duration: 0.45,
      ease: "power3.inOut",
      overwrite: "auto",
    });
    gsap.to(slider, {
      height: target.height,
      duration: 0.45,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  });

  useEffect(() => {
    // Default day: today if we're mid-camp, otherwise Monday. Runs client-side
    // only — the pages are prerendered, so the server can't know "today".
    const index = schedule.findIndex((day) => day.date === todayIso());
    goTo(index > 0 ? index : 0, false);

    // Keep the slider height in sync when panel content or viewport resizes.
    // Skipped while the height tween runs — the tween already ends at the
    // measured target, and setting mid-flight would make it jump.
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;
    const observer = new ResizeObserver(() => {
      if (gsap.isTweening(slider)) return;
      gsap.set(slider, { height: panelHeight(activeRef.current) });
    });
    for (const panel of track.children) observer.observe(panel.firstElementChild as Element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className={styles.slider} ref={sliderRef}>
        <div className={styles.track} ref={trackRef}>
          {schedule.map((day, index) => (
            // inert keeps offscreen days out of tab order; focusing them would
            // otherwise scroll the overflow-hidden slider and break the layout.
            <div className={styles.panel} key={day.date} inert={index !== active}>
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
