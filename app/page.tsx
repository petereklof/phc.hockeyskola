import GroupGrid from "@/components/GroupGrid/GroupGrid";
import type { GroupCardData } from "@/components/GroupCard/GroupCard";
import Hero from "@/components/Hero/Hero";
import Marquee from "@/components/Marquee/Marquee";
import SaveAsApp from "@/components/SaveAsApp/SaveAsApp";
import SiteFooter from "@/components/SiteFooter/SiteFooter";
import SponsorSlot from "@/components/SponsorSlot/SponsorSlot";
import { groups, home } from "@/lib/content";

// Letter + age range come from each group's JSON, never from the component
// (tech-stack.md §8). Stored "2012-2013" renders with an en dash.
const groupCards: GroupCardData[] = groups.map((group) => ({
  id: group.id,
  letter: group.id.toUpperCase(),
  ageLabel: group.ageGroup.replace("-", "–"),
}));

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee facts={home.marquee.facts} tagline={home.marquee.tagline} />
      <GroupGrid groups={groupCards} />
      <SaveAsApp intro={home.saveAsApp.intro} />
      <SponsorSlot />
      <SiteFooter />
    </main>
  );
}
