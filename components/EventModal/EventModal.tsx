"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type {
  ContactRefKey,
  Location,
  Menu,
  ScheduleEvent,
  SharedContact,
} from "@/lib/content";
import styles from "./EventModal.module.scss";

interface EventModalProps {
  event: ScheduleEvent | null;
  date: string | null;
  locations: Record<string, Location>;
  menu: Menu;
  contactsShared: Record<ContactRefKey, SharedContact>;
  onClose: () => void;
}

function Tba() {
  return <span className={styles.tba}>Information kommer</span>;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function EventModal({
  event,
  date,
  locations,
  menu,
  contactsShared,
  onClose,
}: EventModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const dialog = dialogRef.current;
      if (!dialog || !event) return;
      if (!dialog.open) dialog.showModal();
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" },
        );
      }
    },
    { dependencies: [event], scope: dialogRef },
  );

  const close = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }
    gsap.to(dialog, {
      opacity: 0,
      scale: 0.96,
      duration: 0.18,
      ease: "power1.in",
      onComplete: () => dialog.close(),
    });
  });

  if (!event) return null;

  const content = event.modalContent;
  const location = content?.locationId ? locations[content.locationId] : null;
  const contact = content?.contactRef ? contactsShared[content.contactRef] : null;
  const dish = date ? menu.byDate[date] : undefined;
  const timeLabel = event.timeEnd
    ? `${event.timeStart}–${event.timeEnd}`
    : event.timeStart;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="event-modal-title"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="event-modal-title" className={styles.title}>
            {event.title}
          </h2>
          <button type="button" className={styles.close} onClick={close} aria-label="Stäng">
            ✕
          </button>
        </header>

        <dl className={styles.fields}>
          <div className={styles.field}>
            <dt className={styles.label}>Tid</dt>
            <dd className={styles.value}>{timeLabel}</dd>
          </div>

          {content != null && "locationId" in content && (
            <div className={styles.field}>
              <dt className={styles.label}>Plats</dt>
              <dd className={styles.value}>
                {location ? (
                  <>
                    {location.name}
                    <a
                      className={styles.maps}
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hitta hit <i aria-hidden="true">↗</i>
                    </a>
                  </>
                ) : (
                  <Tba />
                )}
              </dd>
            </div>
          )}

          {content?.showMenu && (
            <div className={styles.field}>
              <dt className={styles.label}>Dagens meny</dt>
              <dd className={styles.value}>
                {dish ?? <Tba />}
                <span className={styles.note}>{menu.note}</span>
              </dd>
            </div>
          )}

          {content?.details?.map(({ label, value }) => (
            <div className={styles.field} key={label}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value ?? <Tba />}</dd>
            </div>
          ))}

          {contact && (
            <div className={styles.field}>
              <dt className={styles.label}>{contact.role}</dt>
              <dd className={styles.value}>
                {contact.name}
                <a className={styles.phone} href={`tel:${contact.phone.replace(/[\s-]/g, "")}`}>
                  {contact.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </dialog>
  );
}
