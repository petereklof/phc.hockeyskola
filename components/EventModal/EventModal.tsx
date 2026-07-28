"use client";

import type {
  ContactRefKey,
  Location,
  Menu,
  ScheduleEvent,
  SharedContact,
} from "@/lib/content";
import Modal from "@/components/Modal/Modal";
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

export default function EventModal({
  event,
  date,
  locations,
  menu,
  contactsShared,
  onClose,
}: EventModalProps) {
  if (!event) return null;

  const content = event.modalContent;
  const location = content?.locationId ? locations[content.locationId] : null;
  const contact = content?.contactRef ? contactsShared[content.contactRef] : null;
  const dish = date ? menu.byDate[date] : undefined;
  const timeLabel = event.timeEnd
    ? `${event.timeStart}–${event.timeEnd}`
    : event.timeStart;

  return (
    <Modal open title={event.title} titleId="event-modal-title" onClose={onClose}>
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
                  {location.infoLink && (
                    <a
                      className={styles.infoLink}
                      href={location.infoLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {location.infoLink.label} <i aria-hidden="true">↗</i>
                    </a>
                  )}
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
    </Modal>
  );
}
