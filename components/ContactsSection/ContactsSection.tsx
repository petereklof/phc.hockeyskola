import type { ContactEntry, ContactRefKey, SharedContact } from "@/lib/content";
import styles from "./ContactsSection.module.scss";

interface ContactsSectionProps {
  contacts: ContactEntry[];
  shared: Record<ContactRefKey, SharedContact>;
}

interface ResolvedContact {
  role: string;
  name: string | null;
  phone?: string | null;
  email?: string | null;
}

export default function ContactsSection({ contacts, shared }: ContactsSectionProps) {
  const resolved: ResolvedContact[] = contacts.map((entry) =>
    "ref" in entry ? shared[entry.ref] : entry,
  );

  return (
    <section className={styles.contacts}>
      <h2 className={styles.heading}>Kontakt</h2>
      <ul className={styles.list}>
        {resolved.map((contact) => (
          <li key={contact.role} className={styles.card}>
            <span className={styles.role}>{contact.role}</span>
            <span className={styles.name}>
              {contact.name ?? <i className={styles.tba}>Information kommer</i>}
            </span>
            {contact.phone && (
              <a className={styles.link} href={`tel:${contact.phone.replace(/[\s-]/g, "")}`}>
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a className={styles.link} href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
