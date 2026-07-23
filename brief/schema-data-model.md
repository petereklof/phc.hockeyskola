# Schema Data Model – Piteå Hockeys Sommarhockeyskola 2026

> This document defines the JSON data structure for schedules, locations, contacts, and events, based on `content.md`. Structural/explanatory text is in English; actual field values shown in the app are in Swedish.

---

## 1. Design principles

- **No group-based color coding.** Color is derived from `category` (`training` vs `other`), not from which group the schedule belongs to.
- **No `shared` flag.** Events like goalie training don't need a data flag marking them as cross-group — the fact that each group page only shows its own schedule means this is purely a copy concern (mention it in `modalContent.info`), not a data-modeling concern.
- **No separate `clickable` flag.** Whether an event opens a modal is derived purely from whether `modalContent` is present (`null`/omitted = not clickable). One less field to keep in sync.
- **No per-event `id` or `type` taxonomy.** An event is just `category` (drives row color), `title` (what's shown) and generic `modalContent.details` rows (`{ label, value }`, rendered as-is). Renaming "Föreläsning" to "Aktivitet" is a title edit, and new kinds of events need no schema change. The one behavior that used to hang off `type` — the lunch menu — is an explicit `showMenu: true` flag instead.
- **Locations and recurring contacts are normalized** into lookup tables and referenced by ID, rather than repeated inline on every event — avoids duplication and typos across ~150+ event entries (4 groups × 6 days × ~6 events).
- **TBA content is explicit**, not just missing. Use `"tba": true` or a literal placeholder string agreed with the UI (see §5), never leave a field silently absent when it's expected to eventually hold real content.

---

## 2. File structure suggestion

```
content/
  2026/
    locations.json      # shared location lookup
    contacts-shared.json # people relevant across all groups (kitchen, goalie coach, director)
    menu.json           # shared lunch menu, keyed by ISO date (same for all groups)
    groups/
      grupp-a.json
      grupp-b.json
      grupp-c.json
      grupp-d.json
    home.json           # hero copy, shared notices (testa isen, målvaktsträning teaser)
```

Keeping one JSON file per group (rather than one giant file) makes it easier to hand-edit a single group's schedule without touching the others, and keeps diffs small if you use git.

---

## 3. `locations.json`

```json
{
  "lf-arena": {
    "name": "LF Arena",
    "address": "LF Arena, Piteå",
    "mapsUrl": "https://maps.google.com/?q=LF+Arena+Pite%C3%A5"
  },
  "grisberget": {
    "name": "Grisberget",
    "address": "Grisberget, Piteå",
    "mapsUrl": "https://maps.google.com/?q=Grisberget+Pite%C3%A5"
  },
  "christinaskolan": {
    "name": "Christinaskolans matsal",
    "address": "Christinaskolan, Piteå",
    "mapsUrl": "https://maps.google.com/?q=Christinaskolan+Pite%C3%A5"
  }
}
```

**TODO (client): real addresses/coordinates needed to finalize `mapsUrl` values — currently placeholder query-based links.** Keep the query-based links working in the meantime so "hitta hit" is never broken. Mark each placeholder with `"tba": true` on the location so the validation step can list what still needs real coordinates.

---

## 4. `contacts-shared.json`

Contacts that apply the same way across all groups:

```json
{
  "kitchen": {
    "role": "Mat/Köksansvarig",
    "name": "Tommy Forsberg",
    "phone": "070-322 62 23"
  },
  "goalieCoach": {
    "role": "Målvaktsansvarig",
    "name": "Peter Eklöf",
    "phone": "070-28 25 369",
    "email": "mail@petereklof.se"
  },
  "director": {
    "role": "Huvudansvarig för hockeyskolan",
    "name": "Niclas Juhlin",
    "phone": "070-669 50 98",
    "email": "niclas.juhlin@ivab.com"
  }
}
```

Group files reference these by key (`"kitchen"`, `"goalieCoach"`, `"director"`) in their `contacts` array rather than repeating the values.

---

## 5. `menu.json`

The lunch menu is the same for all groups on a given day, so it's a shared lookup keyed by ISO date rather than repeated inside each group's lunch event (same normalization principle as locations/contacts, §1).

```json
{
  "note": "Samtliga rätter är gluten- och laktosfria samt fria från ägg och nötter.",
  "byDate": {
    "2026-08-03": "Pannbiff m. klyftpotatis",
    "2026-08-04": "Kycklinggryta m. ris",
    "2026-08-05": "Köttfärssås m. spaghetti",
    "2026-08-06": "Kebabgryta m. ris",
    "2026-08-07": "Köttbullar m. makaroner"
  }
}
```

- The Lunch modal looks up the dish via the day's `date` — the lunch event needs **no `menu` field of its own**; drop it in favor of this lookup.
- `note` (allergi-informationen) is shown once per lunch modal, not per dish.
- `2026-08-08` (lördag, avslutning) is intentionally absent → render "Information kommer" if a lunch is served that day.

---

## 6. Group file — `groups/grupp-a.json`

```json
{
  "id": "a",
  "name": "Grupp A",
  "dateRangeLabel": "Måndag 3 aug – lördag 8 aug 2026",
  "lockerRoom": {
    "number": "5",
    "building": "Röda Längan"
  },
  "practicalInfo": {
    "lunchLocationId": "christinaskolan",
    "theoryLocationId": "lf-arena",
    "fitnessLocationIds": ["lf-arena", "grisberget"]
  },
  "testIceNotice": {
    "text": "Vi hoppas kunna ge möjlighet att \"testa isen\" inför hockeyskolan. Info om dag och tid kommer.",
    "tba": true
  },
  "contacts": [
    { "role": "Instruktör", "name": null, "phone": null, "tba": true },
    { "role": "Assisterande instruktör", "name": null, "phone": null, "tba": true },
    { "role": "Faddrar", "name": null, "phone": null, "tba": true },
    { "ref": "kitchen" },
    { "ref": "goalieCoach" },
    { "ref": "director" }
  ],
  "schedule": [
    {
      "date": "2026-08-03",
      "weekday": "Måndag",
      "events": [
        {
          "category": "other",
          "title": "Samling",
          "timeStart": "07:00",
          "timeEnd": null,
          "modalContent": null
        },
        {
          "category": "training",
          "title": "Isträning",
          "timeStart": "07:45",
          "timeEnd": "08:55",
          "modalContent": {
            "locationId": "lf-arena",
            "details": [{ "label": "Fokus", "value": null }]
          }
        },
        {
          "category": "other",
          "title": "Föreläsning",
          "timeStart": "10:10",
          "timeEnd": "10:35",
          "modalContent": {
            "locationId": "lf-arena",
            "details": [
              { "label": "Ämne", "value": null },
              { "label": "Föreläsare", "value": null }
            ]
          }
        },
        {
          "category": "other",
          "title": "Lunch",
          "timeStart": "10:45",
          "timeEnd": null,
          "modalContent": {
            "locationId": "christinaskolan",
            "showMenu": true,
            "contactRef": "kitchen"
          }
        },
        {
          "category": "training",
          "title": "Fysträning",
          "timeStart": "11:30",
          "timeEnd": null,
          "modalContent": {
            "locationId": "lf-arena",
            "details": [{ "label": "Fokus", "value": null }]
          }
        },
        {
          "category": "training",
          "title": "Isträning",
          "timeStart": "13:25",
          "timeEnd": "14:35",
          "modalContent": {
            "locationId": "lf-arena",
            "details": [{ "label": "Fokus", "value": null }]
          }
        }
      ]
    }
  ]
}
```

*(Only Monday is fully spelled out above as a template — the same pattern repeats for Tuesday–Saturday using the times from `grupp-a.md`. Happy to generate the complete file for all four groups once the JSON shape is approved.)*

### Goalie training example (shared across groups, no `shared` flag needed)

```json
{
  "category": "other",
  "title": "Målvaktsträning",
  "timeStart": "19:05",
  "timeEnd": "20:30",
  "modalContent": {
    "locationId": "lf-arena",
    "details": [
      { "label": "Info", "value": "Gäller alla deltagande målvakter, samtliga grupper." }
    ],
    "contactRef": "goalieCoach"
  }
}
```

The cross-group nature is communicated purely through the detail copy — no extra data field required.

---

## 7. TypeScript types (for validation / editor autocomplete)

```typescript
type EventCategory = "training" | "other";

interface EventDetail {
  label: string; // Swedish, rendered as-is, e.g. "Fokus", "Ämne"
  value: string | null; // null = "Information kommer" (TBA)
}

interface ModalContent {
  locationId?: string | null; // key in locations.json
  showMenu?: true; // show the day's lunch menu (menu.json lookup by date)
  details?: EventDetail[];
  contactRef?: "kitchen" | "goalieCoach" | "director";
}

interface ScheduleEvent {
  category: EventCategory;
  title: string; // Swedish label, e.g. "Isträning"
  timeStart: string; // "HH:mm"
  timeEnd: string | null;
  modalContent: ModalContent | null; // null = not clickable
}

interface DaySchedule {
  date: string; // ISO date
  weekday: string; // Swedish, e.g. "Måndag"
  events: ScheduleEvent[];
}

interface Contact {
  role: string;
  name: string | null;
  phone?: string | null;
  email?: string | null;
  tba?: boolean;
}

interface ContactRef {
  ref: "kitchen" | "goalieCoach" | "director";
}

interface Group {
  id: "a" | "b" | "c" | "d";
  ageGroup: "2012-2013" | "2014" | "2015-2016" | "2017"
  name: string;
  dateRangeLabel: string;
  lockerRoom: { number: string; building: string };
  practicalInfo: {
    lunchLocationId: string;
    theoryLocationId: string;
    fitnessLocationIds: string[];
  };
  testIceNotice: { text: string; tba: boolean };
  contacts: (Contact | ContactRef)[];
  schedule: DaySchedule[];
}
```

Consider validating these with `zod` at build/import time so a malformed group JSON fails loudly during development rather than breaking silently in the UI.

---

## 8. Open items before content is locked

See `content.md` §4 for the live list. Still open here on the data side:

1. **TODO (client): real coordinates/addresses** for `locations.json` `mapsUrl` values (placeholder query links until then).
2. **TODO (client): real instructor/assistant/fadder names + phones** — placeholder `Exempel Exempelsson` / `070-123 45 56` with `tba: true` until then (see `content.md` §2.4).
3. Theory/lecture topics and activity descriptions per day.
4. Confirmation of Group D's contact structure.
5. Confirm whether `category` should ever need a third value (e.g. if "Matchspel" should count as `training` rather than `other`) — currently: **training** = ice/fitness/theory, **everything else** = other.

**Resolved:** lunch menu (now in `menu.json`, §5); "Samling" never clickable; Maps = external links, no embed.