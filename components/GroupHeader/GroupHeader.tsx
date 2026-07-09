import ShareButton from "@/components/ShareButton/ShareButton";
import styles from "./GroupHeader.module.scss";

interface GroupHeaderProps {
  name: string;
  ageGroup: string;
  dateRangeLabel: string;
}

// "2012-2013" -> "Födda 2012 & 2013", "2014" -> "Födda 2014"
function birthYearsLabel(ageGroup: string): string {
  const [first, second] = ageGroup.split("-");
  return second ? `Födda ${first} & ${second}` : `Födda ${first}`;
}

export default function GroupHeader({ name, ageGroup, dateRangeLabel }: GroupHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.patternContent}>
        <span className={styles.eyebrow}>{birthYearsLabel(ageGroup)}</span>
        <h1 className={styles.title}>{name}</h1>
      </div>
      <div className={styles.meta}>
        <p className={styles.dates}>{dateRangeLabel}</p>
        <ShareButton title={`${name} – Hockeyskola 2026`} />
      </div>
    </section>
  );
}
