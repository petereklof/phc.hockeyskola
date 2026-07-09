"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GroupId } from "@/lib/content";
import styles from "./GroupNav.module.scss";

interface GroupNavProps {
  currentId: GroupId;
  groups: { id: GroupId; name: string }[];
}

export default function GroupNav({ currentId, groups }: GroupNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const current = groups.find((g) => g.id === currentId);
  const others = groups.filter((g) => g.id !== currentId);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logoLink} aria-label="Till startsidan">
        <img src="/logo/logo.svg" alt="" />
      </Link>

      <div className={styles.dropdown} ref={rootRef}>
        <button
          type="button"
          ref={triggerRef}
          className={styles.trigger}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {current?.name ?? "Grupp"} <i aria-hidden="true">{open ? "▴" : "▾"}</i>
        </button>

        {open && (
          <ul className={styles.menu} role="menu" aria-label="Byt grupp">
            {others.map((group) => (
              <li key={group.id} role="none">
                <Link
                  role="menuitem"
                  href={`/grupp/${group.id}`}
                  className={styles.menuItem}
                  onClick={() => setOpen(false)}
                >
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
