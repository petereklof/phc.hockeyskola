"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";
import Modal from "@/components/Modal/Modal";
import styles from "./FaqSection.module.scss";

interface FaqSectionProps {
  heading: string;
  items: FaqItem[];
}

export default function FaqSection({ heading, items }: FaqSectionProps) {
  const [selected, setSelected] = useState<FaqItem | null>(null);

  return (
    <section className={styles.faq}>
      <h2 className={styles.heading}>{heading}</h2>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.question}>
            <button type="button" className={styles.row} onClick={() => setSelected(item)}>
              <span className={styles.question}>{item.question}</span>
              <span className={styles.chevron} aria-hidden="true">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={selected !== null}
        title={selected?.question ?? ""}
        titleId="faq-modal-title"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className={styles.content}>
            <p className={styles.intro}>{selected.intro}</p>
            {selected.body.map((block, index) =>
              block.type === "paragraph" ? (
                <p className={styles.paragraph} key={index}>
                  {block.text}
                </p>
              ) : (
                <ul className={styles.bullets} key={index}>
                  {block.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ),
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
