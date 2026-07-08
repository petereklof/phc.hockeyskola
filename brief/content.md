# Content Document – Piteå Hockeys Summer Hockey School 2026 (web app)

> This document describes content and structure per page. It serves as the basis for the content JSON and component structure in the Next.js app. It should NOT be interpreted as visual design — see `reference/wireframe-screenshots` purely for structural inspiration, not appearance.
>
> Note: structural/explanatory text in this document is in English, but all actual in-app content (event names, labels, copy shown to users) is in Swedish, since the target audience is Swedish-speaking.

---

## 1. Home page (`/`)

### 1.1 Hero
- Club logo
- Title: "Sommarhockeyskola 2026"
- Dates: 3–8 augusti 2026
- Location: Isstadion, LF Arena, Piteå
- Short, upbeat intro (1–2 sentences) — *needs copy from you / marketing material, in Swedish*

### 1.2 Group selection (primary navigation)
Four cards/buttons, one per group:
- Grupp A
- Grupp B
- Grupp C
- Grupp D

Each card should contain at minimum:
- Group name ("Grupp A" etc.)
- Click → navigates to `/grupp/[a|b|c|d]`

*Open question: is there an age split or other distinguishing info between the groups that should show here (e.g. "9–10 år")? If so, add as card metadata, in Swedish.*

### 1.3 Shared info (applies to all groups)
- **"Testa isen" info**: Friåkning inför hockeyskolan, förbehållet elever, "info om dag/tid kommer" — shown as a banner/notice until a date is set, then updated with the actual date/time.
- **Målvaktsträning**: Onsdag 5/8, kl 19:05–20:30, shared across all groups. Should be briefly mentioned on the home page with a link/anchor down to the relevant group page where full details live.

### 1.4 General practical info (can live in footer or its own section)
- Lunch: Christinaskolans matsal — kontakt Mat/Köksansvarig Tommy Forsberg, 070-322 62 23
- Teorilokal: LF Arena
- Fyslokal: LF Arena / Grisberget
- General contact for the hockey school (if one exists beyond per-group contacts) — *needed*

### 1.5 Footer
- Club logo
- Links to the club's main site / social channels, if any
- Copyright

---

## 2. Group page (`/grupp/[grupp]`)

### 2.1 Header
- Back navigation to the home page
- Group name ("Grupp A" / B / C / D)
- Short status line: "Måndag 3 aug – lördag 8 aug 2026"

### 2.2 Schedule (main content)
Displayed day by day (6 days: mån–lör), each day as a column/section with a chronological list of events.

**Event types that occur (Swedish labels, as shown in-app):**
| Type (Swedish) | Clickable? | Example |
|---|---|---|
| Samling | No (usually) | "Samling 07:00" |
| Isträning | Yes | Time, location (Isstadion/LF Arena), possibly session focus |
| Fysträning / Fys/Skytte | Yes | Time, location (LF Arena/Grisberget), possibly focus |
| Lunch | Yes | Today's menu, matsal, kitchen manager contact, directions |
| Teori | Yes | Time, location, session topic |
| Föreläsning | Yes | Time, location, topic/speaker |
| Matchspel | Yes | Time, location, possibly format info |
| Aktivitet | Yes (if content exists) / No | Time, description — *content not yet available, mark "Information kommer"* |
| Målvaktsträning | Yes | Onsdag 19:05–20:30, shared info, note that it applies to all groups |
| Fika/avslut | Yes (simple) | Time, location |

**Non-clickable events** (e.g. Samling) are still shown in the schedule but without modal interaction — should have a clear but subtle visual difference (e.g. no hover effect, muted styling) so it doesn't feel like a bug that they don't respond to clicks.

**Color coding**: instead of coding by group (redundant, since each page only shows one group's schedule), code by event category:
- **Color 1** — training-focused sessions: Isträning, Fysträning/Fys-Skytte, Teori
- **Color 2** — everything else: Samling, Lunch, Föreläsning, Matchspel, Aktivitet, Målvaktsträning, Fika/avslut

### 2.3 Modal content per event type (detailed spec)

All field labels and copy below are shown in Swedish in the app; English here only names the field for dev purposes.

**Isträning**
- Tid (start–slut)
- Plats: Isstadion / LF Arena
- Hitta-hit-länk (Google Maps)
- Fokus/innehåll för passet — *text missing, "Information kommer"*

**Lunch**
- Tid
- Matsal: Christinaskolans matsal
- Hitta-hit-länk
- Köksansvarig: Tommy Forsberg, 070-322 62 23
- Dagens meny — *missing, "Information kommer", filled in on an ongoing basis*

**Teori**
- Tid
- Plats: LF Arena
- Ämne för dagens teoripass — *"Information kommer"*

**Föreläsning**
- Tid
- Plats
- Ämne / föreläsare — *"Information kommer"*

**Fysträning / Fys-Skytte**
- Tid
- Plats: LF Arena eller Grisberget (specify per instance)
- Hitta-hit-länk
- Ev. fokus — *"Information kommer"*

**Matchspel**
- Tid
- Plats
- Ev. info om upplägg — *"Information kommer"*

**Målvaktsträning**
- Tid: Onsdag 19:05–20:30
- Info: "Gäller alla deltagande målvakter, samtliga grupper"
- Plats + hitta-hit-länk

**Aktivitet**
- Tid
- Beskrivning — *"Information kommer", may vary by group/day*

**Fika/avslut**
- Tid
- Plats
- Ev. kort avslutningstext — *"Information kommer"*

**Samling** *(if made clickable in the future)*
- Tid, plats — otherwise no modal

Note: structure the JSON so that a schedule item is clickable if modal content exists; otherwise it isn't. No separate `clickable` flag is needed if this rule is followed consistently — presence of `modalContent` alone can drive it.

### 2.4 Contact section (group-specific)
Per group, with Swedish role labels:
- Instruktör — namn, ev. telefon/roll *(status: "Information kommer" tills vidare — build with an empty/TBA state)*
- Assisterande instruktör — samma status
- Faddrar — samma status
- Mat/Köksansvarig — Tommy Forsberg, 070-322 62 23
- Målvaktsansvarig — Peter Eklöf, 070-28 25 369, mail@petereklof.se
- Huvudansvarig för hockeyskolan — Niclas Juhlin, 070-669 50 98, niclas.juhlin@ivab.com

### 2.5 Practical info (group-specific)
- Omklädningsrum: nummer + byggnad (t.ex. "#5 Röda Längan" för A, "#3 Isstadion" för B, "#4 Isstadion" för C, "#5 Isstadion" för D)
- Lunchplats: Christinaskolans matsal + köksansvarig
- Teorilokal: LF Arena
- Fyslokal: LF Arena / Grisberget

### 2.6 "Testa isen" notice (where relevant for the group)
- Same text as on the home page, possibly more detailed once date/time is set

---

## 3. Cross-cutting UX principles

- **"Information kommer"-fält** should render clearly in the UI, not left blank — avoid content looking broken.
- **Data structure**: each event should have at minimum `{ id, type, time_start, time_end, title, modalContent }`, where `modalContent` is omitted/null if there's nothing to show. A schedule item's clickability is derived directly from whether `modalContent` exists — no separate flag needed. `title`/`type` values are the Swedish labels (e.g. "Isträning", "Lunch").
- **Color coding by event category** (not by group): tränings-fokuserade pass (is/fys/teori) in one color, everything else in a second color.

---

## 4. Open questions to resolve before content is finalized

1. Matsedel per dag och grupp — vem levererar denna text/data?
2. Teori- och föreläsningsämnen per dag — finns detta redan eller ska det tas fram?
3. Vad innebär "Aktivitet" konkret (samma för alla grupper eller unikt per grupp/dag)?
4. Namn på instruktörer/assistenter/faddrar när de är klara.
5. Bekräfta Grupp D:s kontaktstruktur (saknar "Ass instruktör"?).
6. Ska "Samling" vara klickbar i något läge, eller alltid passiv?
7. Behövs adress/karta-embed eller räcker externa Maps-länkar?