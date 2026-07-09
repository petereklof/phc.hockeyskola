"use client";

import { useState } from "react";
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

export interface ScheduleContext {
  locations: Record<string, Location>;
  menu: Menu;
  contactsShared: Record<ContactRefKey, SharedContact>;
}

interface ScheduleSectionProps extends ScheduleContext {
  schedule: DaySchedule[];
}

interface Selected {
  event: ScheduleEvent;
  date: string;
}

export default function ScheduleSection({
  schedule,
  locations,
  menu,
  contactsShared,
}: ScheduleSectionProps) {
  const [selected, setSelected] = useState<Selected | null>(null);

  return (
    <section className={styles.schedule}>
      <h2 className={styles.heading}>Schema</h2>
      {schedule.map((day) => (
        <ScheduleDay
          key={day.date}
          day={day}
          locations={locations}
          onSelect={(event) => setSelected({ event, date: day.date })}
        />
      ))}
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
