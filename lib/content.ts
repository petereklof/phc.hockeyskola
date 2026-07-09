import { z } from "zod";

import contactsSharedJson from "@/content/2026/contacts-shared.json";
import groupAJson from "@/content/2026/groups/grupp-a.json";
import groupBJson from "@/content/2026/groups/grupp-b.json";
import groupCJson from "@/content/2026/groups/grupp-c.json";
import groupDJson from "@/content/2026/groups/grupp-d.json";
import homeJson from "@/content/2026/home.json";
import locationsJson from "@/content/2026/locations.json";
import menuJson from "@/content/2026/menu.json";

// ============================================================================
// Schemas (brief/schema-data-model.md). Parsing happens once at import time in
// Server Components, so malformed content fails the build loudly.
// ============================================================================

const timeString = z.string().regex(/^\d{2}:\d{2}$/, "expected HH:mm");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

const LocationSchema = z.strictObject({
  name: z.string(),
  address: z.string(),
  mapsUrl: z.url(),
  tba: z.boolean().optional(), // true = placeholder maps link, real coordinates TBD
});

const LocationsSchema = z.record(z.string(), LocationSchema);

const SharedContactSchema = z.strictObject({
  role: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
});

const ContactsSharedSchema = z.strictObject({
  kitchen: SharedContactSchema,
  goalieCoach: SharedContactSchema,
  director: SharedContactSchema,
});

const MenuSchema = z.strictObject({
  note: z.string(),
  byDate: z.record(isoDate, z.string()),
});

const CONTACT_REFS = ["kitchen", "goalieCoach", "director"] as const;

const ModalContentSchema = z.strictObject({
  locationId: z.string().nullable().optional(),
  focus: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  speaker: z.string().nullable().optional(),
  info: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  contactRef: z.enum(CONTACT_REFS).optional(),
  tba: z.array(z.string()).optional(), // field names still awaiting real content
});

const EventSchema = z.strictObject({
  id: z.string(),
  type: z.enum([
    "samling",
    "istraning",
    "fystraning",
    "lunch",
    "teori",
    "forelasning",
    "matchspel",
    "aktivitet",
    "malvaktstraning",
    "fika",
  ]),
  category: z.enum(["training", "other"]),
  title: z.string(),
  timeStart: timeString,
  timeEnd: timeString.nullable(),
  modalContent: ModalContentSchema.nullable(), // null = not clickable
});

const DayScheduleSchema = z.strictObject({
  date: isoDate,
  weekday: z.string(),
  events: z.array(EventSchema).min(1),
});

const ContactSchema = z.strictObject({
  role: z.string(),
  name: z.string().nullable(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  tba: z.boolean().optional(),
});

const ContactRefSchema = z.strictObject({ ref: z.enum(CONTACT_REFS) });

// Consistency check (tech-stack.md §8): a group card can never show a letter
// and birth years that disagree with the group's own JSON.
export const GROUP_AGE_MAP = {
  a: "2012-2013",
  b: "2014",
  c: "2015-2016",
  d: "2017",
} as const;

const GroupSchema = z
  .strictObject({
    id: z.enum(["a", "b", "c", "d"]),
    ageGroup: z.enum(["2012-2013", "2014", "2015-2016", "2017"]),
    name: z.string(),
    dateRangeLabel: z.string(),
    lockerRoom: z.strictObject({ number: z.string(), building: z.string() }),
    practicalInfo: z.strictObject({
      lunchLocationId: z.string(),
      theoryLocationId: z.string(),
      fitnessLocationIds: z.array(z.string()).min(1),
    }),
    testIceNotice: z.strictObject({ text: z.string(), tba: z.boolean() }),
    contacts: z.array(z.union([ContactRefSchema, ContactSchema])).min(1),
    schedule: z.array(DayScheduleSchema).length(6),
  })
  .refine((group) => group.ageGroup === GROUP_AGE_MAP[group.id], {
    message: "ageGroup does not match GROUP_AGE_MAP for this group id",
  });

const HomeSchema = z.strictObject({
  hero: z.strictObject({ titleLine1: z.string(), titleLine2: z.string() }),
  marquee: z.strictObject({ facts: z.array(z.string()).min(1), tagline: z.string() }),
  saveAsApp: z.strictObject({ intro: z.string() }),
  notices: z.strictObject({
    testIce: z.strictObject({ text: z.string(), tba: z.boolean() }),
    goalieTraining: z.strictObject({ text: z.string() }),
  }),
});

// ============================================================================
// Parsed, typed content
// ============================================================================

export const locations = LocationsSchema.parse(locationsJson);
export const contactsShared = ContactsSharedSchema.parse(contactsSharedJson);
export const menu = MenuSchema.parse(menuJson);
export const home = HomeSchema.parse(homeJson);
export const groups = [groupAJson, groupBJson, groupCJson, groupDJson].map((group) =>
  GroupSchema.parse(group),
);

export type Location = z.infer<typeof LocationSchema>;
export type SharedContact = z.infer<typeof SharedContactSchema>;
export type ContactRefKey = (typeof CONTACT_REFS)[number];
export type Menu = z.infer<typeof MenuSchema>;
export type ModalContent = z.infer<typeof ModalContentSchema>;
export type ScheduleEvent = z.infer<typeof EventSchema>;
export type DaySchedule = z.infer<typeof DayScheduleSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ContactEntry = z.infer<typeof ContactSchema> | z.infer<typeof ContactRefSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type GroupId = Group["id"];

export const GROUP_IDS = ["a", "b", "c", "d"] as const satisfies readonly GroupId[];

export function getGroup(id: GroupId): Group {
  const group = groups.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown group id "${id}"`);
  return group;
}

export function isGroupId(value: string): value is GroupId {
  return (GROUP_IDS as readonly string[]).includes(value);
}

// ============================================================================
// Referential integrity — every locationId must exist in locations.json
// ============================================================================

for (const group of groups) {
  const practicalIds = [
    group.practicalInfo.lunchLocationId,
    group.practicalInfo.theoryLocationId,
    ...group.practicalInfo.fitnessLocationIds,
  ];
  for (const locationId of practicalIds) {
    if (!(locationId in locations)) {
      throw new Error(`Unknown locationId "${locationId}" in ${group.id}.practicalInfo`);
    }
  }
  for (const day of group.schedule) {
    for (const event of day.events) {
      const locationId = event.modalContent?.locationId;
      if (locationId && !(locationId in locations)) {
        throw new Error(`Unknown locationId "${locationId}" in event "${event.id}"`);
      }
    }
  }
}

// ============================================================================
// TBA report — surface every "update me" marker at build time (content.md §2.4)
// ============================================================================

function collectTba(value: unknown, path: string, out: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectTba(item, `${path}[${i}]`, out));
    return;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj.tba === true) out.push(path);
    if (Array.isArray(obj.tba)) for (const field of obj.tba) out.push(`${path}.${field}`);
    for (const [key, child] of Object.entries(obj)) {
      if (key !== "tba") collectTba(child, path ? `${path}.${key}` : key, out);
    }
  }
}

const tbaPaths: string[] = [];
collectTba({ locations, home, ...Object.fromEntries(groups.map((g) => [g.name, g])) }, "", tbaPaths);
if (tbaPaths.length > 0 && process.env.NODE_ENV !== "test") {
  console.warn(
    `[content 2026] ${tbaPaths.length} fält väntar på riktigt innehåll (tba):\n  - ${tbaPaths.join("\n  - ")}`,
  );
}
