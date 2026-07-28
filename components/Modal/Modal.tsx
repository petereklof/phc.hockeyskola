"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Modal.module.scss";

interface ModalProps {
  open: boolean;
  title: string;
  titleId: string; // unique per modal usage so aria-labelledby never collides
  onClose: () => void;
  children: ReactNode;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared dialog shell: EventModal (schedule) and FaqSection (home) render the
// same chrome and open/close animation through this component.
export default function Modal({ open, title, titleId, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const dialog = dialogRef.current;
      if (!dialog || !open) return;
      if (!dialog.open) dialog.showModal();
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" },
        );
      }
    },
    { dependencies: [open], scope: dialogRef },
  );

  const close = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }
    gsap.to(dialog, {
      opacity: 0,
      scale: 0.96,
      duration: 0.18,
      ease: "power1.in",
      onComplete: () => dialog.close(),
    });
  });

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={close} aria-label="Stäng">
            ✕
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
