import styles from "./SiteFooter.module.scss";

export default function SiteFooter() {
  return (
    <footer className={styles.foot}>
      <span className={styles.title}>Piteå Hockey</span>
      <span className={styles.subtitle}>Sommarhockeyskola · 2026</span>
    </footer>
  );
}
