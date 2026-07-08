# Schema Data Model – Piteå Hockeys Sommarhockeyskola 2026

> This document defines the JSON data structure for schedules, locations, contacts, and events, based on `content-spec.md`. Structural/explanatory text is in English; actual field values shown in the app are in Swedish.

---

## 1. Design principles

- **No group-based color coding.** Color is derived from `category` (`training` vs `other`), not from which group the schedule belongs to.
- **No `shared` flag.** Events like goalie training don't need a data flag marking them as cross-group — the fact that each group page only shows its own schedule means this is purely a copy concern (mention it in `modalContent.info`), not a data-modeling concern.
- **No separate `clickable` flag.** Whether an event opens a modal is derived purely from whether `modalContent` is present (`null`/omitted = not clickable). One less field to keep in sync.
- **Locations and recurring contacts are normalized** into lookup tables and referenced by ID, rather than repeated inline on every event — avoids duplication and typos across ~150+ event entries (4 groups × 6 days × ~6 events).
- **TBA content is explicit**, not just missing. Use `"tba": true` or a literal placeholder string agreed with the UI (see §5), never leave a field silently absent when it's expected to eventually hold real content.

---

## 2. File structure suggestion

```
content/
  2026/
    locations.json      # shared location lookup
    contacts-shared.json # people relevant across all groups (kitchen, goalie coach, director)
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
  "isstadion": {
    "name": "Isstadion",
    "address": "Isstadion, Piteå",
    "mapsUrl": "https://maps.google.com/?q=Isstadion+Pite%C3%A5"
  },
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

*Open item: real addresses/coordinates needed to finalize `mapsUrl` values — currently placeholder query-based links.*

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

## 5. Group file — `groups/grupp-a.json`

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
          "id": "a-mon-samling",
          "type": "samling",
          "category": "other",
          "title": "Samling",
          "timeStart": "07:00",
          "timeEnd": null,
          "modalContent": null
        },
        {
          "id": "a-mon-istraning-1",
          "type": "istraning",
          "category": "training",
          "title": "Isträning",
          "timeStart": "07:45",
          "timeEnd": "08:55",
          "modalContent": {
            "locationId": "isstadion",
            "focus": null,
            "tba": ["focus"]
          }
        },
        {
          "id": "a-mon-forelasning",
          "type": "forelasning",
          "category": "other",
          "title": "Föreläsning",
          "timeStart": "10:10",
          "timeEnd": "10:35",
          "modalContent": {
            "locationId": "lf-arena",
            "topic": null,
            "speaker": null,
            "tba": ["topic", "speaker"]
          }
        },
        {
          "id": "a-mon-lunch",
          "type": "lunch",
          "category": "other",
          "title": "Lunch",
          "timeStart": "10:45",
          "timeEnd": null,
          "modalContent": {
            "locationId": "christinaskolan",
            "contactRef": "kitchen",
            "menu": null,
            "tba": ["menu"]
          }
        },
        {
          "id": "a-mon-fys",
          "type": "fystraning",
          "category": "training",
          "title": "Fysträning",
          "timeStart": "11:30",
          "timeEnd": null,
          "modalContent": {
            "locationId": "lf-arena",
            "focus": null,
            "tba": ["focus"]
          }
        },
        {
          "id": "a-mon-istraning-2",
          "type": "istraning",
          "category": "training",
          "title": "Isträning",
          "timeStart": "13:25",
          "timeEnd": "14:35",
          "modalContent": {
            "locationId": "isstadion",
            "focus": null,
            "tba": ["focus"]
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
  "id": "a-wed-malvakt",
  "type": "malvaktstraning",
  "category": "other",
  "title": "Målvaktsträning",
  "timeStart": "19:05",
  "timeEnd": "20:30",
  "modalContent": {
    "locationId": "isstadion",
    "info": "Gäller alla deltagande målvakter, samtliga grupper.",
    "contactRef": "goalieCoach"
  }
}
```

The cross-group nature is communicated purely through the `info` copy — no extra data field required.

---

## 6. TypeScript types (for validation / editor autocomplete)

```typescript
type EventCategory = "training" | "other";

type EventType =
  | "samling"
  | "istraning"
  | "fystraning"
  | "lunch"
  | "teori"
  | "forelasning"
  | "matchspel"
  | "aktivitet"
  | "malvaktstraning"
  | "fika";

interface ScheduleEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  title: string; // Swedish label, e.g. "Isträning"
  timeStart: string; // "HH:mm"
  timeEnd: string | null;
  modalContent: Record<string, unknown> | null; // null = not clickable
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

## 7. Open items before content is locked

Same as in `content-spec.md` §4 — menu text, theory/lecture topics, activity descriptions, instructor names, and confirmation of Group D's contact structure — plus, newly:

1. Real coordinates/addresses for `locations.json` `mapsUrl` values.
2. Confirm whether `category` should ever need a third value (e.g. if "Matchspel" should count as `training` rather than `other`) — currently modeled per your instruction as: **training** = ice/fitness/theory, **everything else** = other.