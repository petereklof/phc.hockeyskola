import styles from "./SponsorSlot.module.scss";

export default function SponsorSlot() {
  return (
    <section className={styles.sponsor}>
      <span className={styles.eyebrow}>I samarbete med</span>
      <div className={styles.box}>
        <img className={styles.logo} src="/images/galltval-lightgreen.svg" alt="Galltvål" />
      </div>
    </section>
  );
}
