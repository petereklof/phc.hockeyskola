import styles from "./SponsorSlot.module.scss";

export default function SponsorSlot() {
  return (
    <section className={styles.sponsor}>
      <span className={styles.eyebrow}>I samarbete med</span>
      <div className={styles.box}>
        <img className={styles.logo} src="/logo/logo.svg" alt="" aria-hidden="true" />
        <span className={styles.label}>Sponsorlogotyp</span>
      </div>
    </section>
  );
}
