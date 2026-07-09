import { Fragment } from "react";
import styles from "./Marquee.module.scss";

interface MarqueeProps {
  facts: string[];
  tagline: string;
}

function Sequence({ facts, tagline }: MarqueeProps) {
  return (
    <>
      {facts.map((fact) => (
        <Fragment key={fact}>
          <span className={styles.hollow}>{fact}</span>
          <span className={styles.sep}>●</span>
        </Fragment>
      ))}
      <span className={styles.fill}>{tagline}</span>
      <span className={styles.sep}>●</span>
    </>
  );
}

export default function Marquee({ facts, tagline }: MarqueeProps) {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        <Sequence facts={facts} tagline={tagline} />
        <Sequence facts={facts} tagline={tagline} />
      </div>
    </div>
  );
}
