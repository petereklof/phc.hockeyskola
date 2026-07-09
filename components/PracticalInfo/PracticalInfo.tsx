import type { Group, Location } from "@/lib/content";
import styles from "./PracticalInfo.module.scss";

interface PracticalInfoProps {
  group: Group;
  locations: Record<string, Location>;
}

function MapsLink({ location }: { location: Location }) {
  return (
    <a
      className={styles.maps}
      href={location.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      Hitta hit <i aria-hidden="true">↗</i>
    </a>
  );
}

export default function PracticalInfo({ group, locations }: PracticalInfoProps) {
  const lunch = locations[group.practicalInfo.lunchLocationId];
  const arena = locations[group.practicalInfo.arenaLocationId];

  return (
    <section className={styles.practical}>
      <h2 className={styles.heading}>Praktisk info</h2>
      <ul className={styles.list}>
        <li className={styles.card}>
          <span className={styles.label}>Omklädningsrum</span>
          <span className={styles.value}>
            #{group.lockerRoom.number} {group.lockerRoom.building}
          </span>
        </li>
        <li className={styles.card}>
          <span className={styles.label}>Lunch</span>
          <span className={styles.value}>{lunch.name}</span>
          <MapsLink location={lunch} />
        </li>
        <li className={styles.card}>
          <span className={styles.label}>Ishall</span>
          <span className={styles.value}>{arena.name}</span>
          <MapsLink location={arena} />
        </li>
      </ul>
    </section>
  );
}
