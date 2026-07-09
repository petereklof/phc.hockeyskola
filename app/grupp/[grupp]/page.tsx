import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactsSection from "@/components/ContactsSection/ContactsSection";
import GroupHeader from "@/components/GroupHeader/GroupHeader";
import GroupNav from "@/components/GroupNav/GroupNav";
import Notice from "@/components/Notice/Notice";
import PracticalInfo from "@/components/PracticalInfo/PracticalInfo";
import ScheduleSection from "@/components/ScheduleSection/ScheduleSection";
import SiteFooter from "@/components/SiteFooter/SiteFooter";
import {
  GROUP_IDS,
  contactsShared,
  getGroup,
  groups,
  isGroupId,
  locations,
  menu,
} from "@/lib/content";

interface GroupPageProps {
  params: Promise<{ grupp: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUP_IDS.map((grupp) => ({ grupp }));
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const { grupp } = await params;
  if (!isGroupId(grupp)) return {};
  const group = getGroup(grupp);
  return {
    title: `${group.name} – Hockeyskola 2026`,
    description: `Schema och praktisk information för ${group.name} (${group.ageGroup.replace("-", "–")}), ${group.dateRangeLabel}.`,
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { grupp } = await params;
  if (!isGroupId(grupp)) notFound();
  const group = getGroup(grupp);

  return (
    <main>
      <GroupNav
        currentId={group.id}
        groups={groups.map(({ id, name }) => ({ id, name }))}
      />
      <GroupHeader name={group.name} dateRangeLabel={group.dateRangeLabel} />
      <Notice heading="Testa isen" text={group.testIceNotice.text} />
      <ScheduleSection
        schedule={group.schedule}
        locations={locations}
        menu={menu}
        contactsShared={contactsShared}
      />
      <ContactsSection contacts={group.contacts} shared={contactsShared} />
      <PracticalInfo group={group} locations={locations} />
      <SiteFooter />
    </main>
  );
}
