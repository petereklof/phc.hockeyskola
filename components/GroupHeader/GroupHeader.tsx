import ShareButton from "@/components/ShareButton/ShareButton";
import styles from "./GroupHeader.module.scss";

interface GroupHeaderProps {
  name: string;
  dateRangeLabel: string;
}

export default function GroupHeader({ name, dateRangeLabel }: GroupHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.patternContent}>
        <span className={styles.eyebrow}>Sommarhockeyskola 2026</span>
        <h1 className={styles.title}>{name}</h1>
      </div>
      <div className={styles.meta}>
        <p className={styles.dates}>{dateRangeLabel}</p>
        <ShareButton title={`${name} – Hockeyskola 2026`} />
      </div>
    </section>
  );
}
