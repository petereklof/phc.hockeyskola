# Content Document – Piteå Hockeys Summer Hockey School 2026 (web app)

> This document describes content and structure per page. It serves as the basis for the content JSON and component structure in the Next.js app. It should NOT be interpreted as visual design — see `brief/example screenshots/` (from a previous schedule site) purely for **structural/content inspiration, not appearance**. See §5 for how they map to this project.
>
> Note: structural/explanatory text in this document is in English, but all actual in-app content (event names, labels, copy shown to users) is in Swedish, since the target audience is Swedish-speaking.

---

## 1. Home page (`/`)

The home page as a whole draws visual inspiration from `marketing examples/schedule-mobile-bg.jpg`. **The hero is the top of the page — there is no navbar on the home page** (the group cards are the primary navigation; the navbar only exists on group pages, see §2.1).

### 1.1 Hero
- Decoration pattern as background (the club's red-on-dark motif pattern — see `brand notes.md` → "Visual language" and `tech-stack.md` §11). Decorative only; the content below sits on top.
- Club logo — carries the club identity, so the title deliberately does **not** repeat "Piteå Hockey".
- Title: **"Hockeyskola 2026"**
- Dates: 3–8 augusti 2026
- Location: Isstadion, LF Arena, Piteå
- Intro is intentionally minimal (logo + title + dates + location). No extra prose sentence needed unless you want one later.

### 1.2 Group selection (primary navigation)
Four cards/buttons, one per group:
- Grupp A
- Grupp B
- Grupp C
- Grupp D

Each card shows three stacked lines and navigates to `/grupp/[a|b|c|d]` on click:
- `GRUPP` — static label
- The group letter, large — from `name` / `id` (e.g. "A")
- The age range — from the group's `ageGroup` (e.g. "2012–2013")

The letter and age range come from the group's content JSON (`name`/`id` + `ageGroup` per `schema-data-model.md`), not hardcoded in the component — see `tech-stack.md` §8. This resolves the earlier open question about whether an age split should show on the cards: yes, via `ageGroup`.

Visually the cards follow `marketing examples/stall-tag-example.jpg` (chunky heading over the decoration pattern). Each card animates in — see `tech-stack.md` §5 (staggered entrance, not a looping slider).

### 1.3 "Spara som app"
Structurally modeled on the previous site (see §5.1): a small section inviting parents to add the site to their home screen for quick access.
- Short intro line (final wording TBD — e.g. "Lägg till sajten på hemskärmen för snabb åtkomst").
- **Platform toggle** (iPhone / Android) that switches the shown instructions.
- **Numbered install steps** per platform (e.g. iPhone: öppna i Safari → dela-knappen → "Lägg till på hemskärmen" → Lägg till).
- Ties to the PWA setup in `tech-stack.md` §9. Keep it unobtrusive — it must never block the schedule.
- **No "offline" claim.** The old site advertised offline; we deliberately do not. Content changes during the week, so a cached/stale schedule would be worse than none. Wording is about quick home-screen access only, not offline.

### 1.4 Shared info (applies to all groups)
- **"Testa isen" info**: Friåkning inför hockeyskolan, förbehållet elever, "info om dag/tid kommer" — shown as a banner/notice until a date is set, then updated with the actual date/time.
- **Målvaktsträning**: Onsdag 5/8, kl 19:05–20:30, shared across all groups. Should be briefly mentioned on the home page with a link/anchor down to the relevant group page where full details live.

### 1.5 General practical info (can live in footer or its own section)
- Lunch: Christinaskolans matsal — kontakt Mat/Köksansvarig Tommy Forsberg, 070-322 62 23
- Teorilokal: LF Arena
- Fyslokal: LF Arena / Grisberget
- General contact for the hockey school (if one exists beyond per-group contacts) — *needed*

### 1.6 Footer
- Club logo
- Links to the club's main site / social channels, if any
- Copyright

---

## 2. Group page (`/grupp/[grupp]`)

### 2.1 Header — navbar
A navbar sits at the top of every group page (unlike the home page, which has no navbar — see §1). It contains:
- Club logo, linking back to the home page (`/`).
- A dropdown listing the other groups, each linking to its `/grupp/[a|b|c|d]` page — so parents can jump between groups without returning home first.

Below the navbar (page heading area):
- Group name ("Grupp A" / B / C / D)
- Short status line: "Måndag 3 aug – lördag 8 aug 2026"

Implementation notes for the navbar/dropdown are in `tech-stack.md` §12.

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
- Dagens meny — see the confirmed menu below (same for all four groups per date).

**Matsedel 2026** (same across all groups; keyed by date — see `schema-data-model.md` for the shared `menu.json` modeling):

| Datum | Rätt |
|---|---|
| Måndag 3 aug | Pannbiff m. klyftpotatis |
| Tisdag 4 aug | Kycklinggryta m. ris |
| Onsdag 5 aug | Köttfärssås m. spaghetti |
| Torsdag 6 aug | Kebabgryta m. ris |
| Fredag 7 aug | Köttbullar m. makaroner |

- **Allergi-not (gäller samtliga rätter)**: "Samtliga rätter är gluten- och laktosfria samt fria från ägg och nötter." Show once per lunch modal (or as a shared note), not per dish.
- Lördag 8 aug (avslutning): menu not specified — mark "Information kommer" if a lunch is served that day.

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

**Samling** — **never clickable** (decided). No `modalContent` → not clickable, exactly as the rule below intends. Shows time (and room if relevant) inline in the schedule, no modal.

Note: structure the JSON so that a schedule item is clickable if modal content exists; otherwise it isn't. No separate `clickable` flag is needed if this rule is followed consistently — presence of `modalContent` alone can drive it.

### 2.4 Contact section (group-specific)
Per group, with Swedish role labels:
- Instruktör — **placeholder until real names arrive**: name `Exempel Exempelsson`, phone `070-123 45 56`, `tba: true`.
- Assisterande instruktör — samma placeholder.
- Faddrar — samma placeholder.
- Mat/Köksansvarig — Tommy Forsberg, 070-322 62 23 *(real)*
- Målvaktsansvarig — Peter Eklöf, 070-28 25 369, mail@petereklof.se *(real)*
- Huvudansvarig för hockeyskolan — Niclas Juhlin, 070-669 50 98, niclas.juhlin@ivab.com *(real)*

**TODO convention** (since JSON has no comments): every placeholder value carries `"tba": true`, which is the machine-readable "update me" marker. A build/validation step (zod, `tech-stack.md` §2) should log every `tba: true` field so the list of things left to fill is always visible. The placeholder name/phone above make the UI look complete during development without pretending the data is real.

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
- **External links open in a new tab**: all "hitta-hit" Google Maps links use `target="_blank"` with `rel="noopener noreferrer"` (on a phone with the Maps app installed, the OS usually opens the app anyway). We use plain external Maps links — **no embedded map** (resolves open question 7).

---

## 4. Open questions to resolve before content is finalized

**Still open:**
1. Teori- och föreläsningsämnen per dag — finns detta redan eller ska det tas fram?
2. Vad innebär "Aktivitet" konkret (samma för alla grupper eller unikt per grupp/dag)?
3. Bekräfta Grupp D:s kontaktstruktur (saknar "Ass instruktör"?).
4. Riktiga namn/telefon på instruktörer/assistenter/faddrar (placeholder används tills vidare, se §2.4).
5. Riktiga koordinater/adresser för Maps-länkar (TODO, se `schema-data-model.md`).

**Resolved:**
- ✅ Matsedel per dag — provided, same for all groups (see §2.3). Allergi-not gäller samtliga rätter.
- ✅ "Samling" — never clickable (§2.3).
- ✅ Maps — external links in a new tab, no embed (§3).

---

## 5. Wireframe reference (`brief/example screenshots/`)

These two screenshots are from a **previous schedule site** (a cup — "Silvercupen"). **Treat them as wireframes: they show content structure and hierarchy, not the visual design of this project.** Our look is the dark red-on-black brand with the decoration pattern (see `brand notes.md` / `tech-stack.md` §11) — do **not** copy the old site's plain styling. The structural patterns below are what's useful.

### 5.1 Home / landing (screenshot `…19.10.32.png`)
Structure, top to bottom, and how it maps here:
- **Header/hero** — logo + event title + a location/date line. → our hero (§1.1), plus the decoration pattern behind it.
- **List of full-width team cards, each with a "→"** ("Piteå HC 1", "Storfors AIK 1", …). → our **four group cards** (§1.2). Note ours carry `GRUPP / A / 2012–2013`, not just a name.
- **"Info från arrangören" — a row of chip/pill links** (Cupinformation, Måltider, Vägbeskrivning, Inbjudan …). → a possible future model for surfacing our **shared/practical info** (§1.4–1.5) as compact chips. **Deferred for now** — build §1.4/1.5 as normal sections/prose; add chips later only if the page feels text-heavy.
- **"Spara som app" block** — an iPhone/Android toggle plus numbered install steps. → directly informs our **§1.3 "Spara som app"** (see the expanded structure there).

### 5.2 Group / detail page (screenshot `…19.11.31.png`)
- **Back affordance top-left ("← Alla lag")** — the old site's only cross-navigation. → we intentionally go further: a **navbar with logo (→ home) + a dropdown to the other groups** (`tech-stack.md` §12). The back-link idea is subsumed by the navbar.
- **Header** — small eyebrow ("SILVERCUPEN 2026") + big title + location line + a red divider. → our group header (§2.1), title = "Grupp A" etc.
- **Schedule grouped by day** (LÖRDAG, SÖNDAG …), each event a row with **time on the left**, title + a subtitle line (location/room). → our per-day schedule (§2.2).
- **Category treatment**: "MATCH" events get a red eyebrow label, a red left border and a tinted background; other events (Samling, Lunch, Middag, Kvällsfika) are neutral. → the structural model for our **two-color category coding** (§2.2: training vs other). Non-clickable rows stay visually calmer.
- **"Trupp" section** (Tränare + Spelare list). → our analog is the **contact section** (§2.4: tränare/assisterande/faddrar + shared contacts). **We do not publish a participant/player roster** — only contacts. Don't carry the "Spelare" list over.