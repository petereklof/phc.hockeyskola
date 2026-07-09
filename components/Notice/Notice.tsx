import styles from "./Notice.module.scss";

export default function Notice({ heading, text }: { heading: string; text: string }) {
  return (
    <aside className={styles.notice}>
      <span className={styles.heading}>{heading}</span>
      <p className={styles.text}>{text}</p>
    </aside>
  );
}
