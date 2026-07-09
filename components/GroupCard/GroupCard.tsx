import Link from "next/link";
import styles from "./GroupCard.module.scss";

export interface GroupCardData {
  id: "a" | "b" | "c" | "d";
  letter: string;
  ageLabel: string;
}

export default function GroupCard({ id, letter, ageLabel }: GroupCardData) {
  return (
    <div className={styles.tile} data-tile>
      <span className={styles.grp}>Grupp</span>
      <span className={styles.letter}>{letter}</span>
      <span className={styles.age}>{ageLabel}</span>
      <Link
        className={styles.btn}
        href={`/grupp/${id}`}
        aria-label={`Visa schema för grupp ${letter}`}
      >
        Visa schema <i aria-hidden="true">→</i>
      </Link>
    </div>
  );
}
