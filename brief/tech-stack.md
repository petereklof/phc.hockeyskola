# Tech Stack & Build Instructions – Piteå Hockeys Sommarhockeyskola 2026

> Instructions for whoever (or whatever — Claude Code) builds this app. Defines language, hosting, styling, animation, and content conventions. Pair this with `content-spec.md` and `schema-data-model.md`.

---

## 1. Framework & language

- **Next.js**, App Router (`app/` directory).
- **TypeScript** throughout — no plain `.js`/`.jsx` files.
- Pages:
    - `/` — home page
    - `/grupp/[grupp]` — dynamic group page (`grupp` = `"a" | "b" | "c" | "d"`)
- Use Server Components by default; mark a component `"use client"` only when it needs interactivity, refs, or animation (GSAP, modals, etc.).

---

## 2. Content & data

- All schedule/contact/location content lives in typed JSON files under `content/2026/`, per `schema-data-model.md`.
- Import JSON directly in Server Components (`import groupA from "@/content/2026/groups/grupp-a.json"`) — no need for a CMS or database for this scope.
- Validate JSON shape with **zod** at build time (a small script or a Server Component that runs once) so malformed content fails loudly instead of breaking the UI silently. Include the `GROUP_AGE_MAP` consistency check described above.
- Keep the `content/2026/` folder versioned by year from day one, so 2027 becomes `content/2027/` without touching code.

---

## 3. Styling

- **CSS Modules with Sass**: every component gets a colocated `ComponentName.module.scss` file in the same folder as `ComponentName.tsx`.
- **No Tailwind.** No global utility classes — all styling scoped per component via CSS Modules.
- Shared design tokens (colors, spacing, font stacks) go in a small set of Sass variables/mixins imported into each module, e.g. `styles/_tokens.scss`, imported via `@use "@/styles/tokens" as *;` at the top of each module file.
- Two-color event system per `schema-data-model.md`: define `--color-training` and `--color-other` (or Sass variables) once, referenced everywhere schedule items are styled — don't hardcode the hex values in more than one place.

**Folder pattern:**
```
components/
  ScheduleDay/
    ScheduleDay.tsx
    ScheduleDay.module.scss
  EventModal/
    EventModal.tsx
    EventModal.module.scss
  GroupCard/
    GroupCard.tsx
    GroupCard.module.scss
```

---

## 4. Fonts

- `MBJ Chunky` (headings) and `IBM Plex Mono` (body) via `next/font/local`.
- `next/font/local` accepts `.ttf` directly — conversion isn't strictly required to get it working. Converting to `.woff2` is still recommended for smaller file size and faster load, since `.woff2` compresses noticeably better than `.ttf`. If useful, this can be done once as a build step rather than manually.
- Register fonts once in `app/layout.tsx` and expose as CSS variables (`--font-heading`, `--font-body`) so component Sass files can reference them without re-importing font files.

---

## 5. Animation — GSAP

- **Install**: `gsap` + `@gsap/react`.
- GSAP (including all plugins — ScrollTrigger, SplitText, Draggable, etc.) is fully free for commercial use as of April 2025, so no licensing concerns.
- Use the **`useGSAP` hook** from `@gsap/react` instead of raw `useEffect`/`useLayoutEffect` for all animations — it handles cleanup automatically via `gsap.context()`.
- Centralize plugin registration in one file, e.g. `lib/gsap.ts`:
  ```typescript
  import gsap from "gsap";
  import { useGSAP } from "@gsap/react";
  gsap.registerPlugin(useGSAP);
  export { gsap, useGSAP };
  ```
- Always pass a `scope` (a ref to the component's root element) so GSAP selectors don't leak across components.
- Any animation triggered from an event handler (e.g. opening the event modal) must be wrapped in `contextSafe()` (returned from `useGSAP`) so it doesn't leak after unmount.
- **Where to actually use animation on this project:**
    - Group cards on the home page: staggered entrance animation on load (not an infinite/looping slider — see prior discussion; four static, equally important nav targets don't benefit from a loop pattern).
    - Event modal: simple fade/scale in on open, fade out on close.
    - Schedule items: light stagger-in as each day's list renders.
    - Optional decorative use only (not primary navigation): a slow-moving background strip of action photography on the hero, if photography is available — this is a reasonable place for a looping/marquee-style animation since nothing needs to be "found" or clicked in it.
- Keep animations subtle and short (200–600ms) given the primary audience checks schedules quickly on mobile between activities.

---

## 6. Hosting — Vercel

- Deploy directly from the GitHub repo via Vercel's Next.js integration (zero-config for a standard Next.js app).
- Environment variables (if a Maps API key or similar is introduced later) go in Vercel's project settings, not committed to the repo.
- Use Vercel's automatic preview deployments per branch/PR to review changes before merging to production.
- No server/database needed for this scope — content is static JSON — so this can run entirely on Vercel's standard hosting without added infrastructure.

---

## 7. Accessibility & UX baseline

- All interactive elements (group cards, schedule events, modal triggers) must be reachable and operable via keyboard, with visible focus states.
- Non-clickable events (e.g. "Samling") should be visually distinct (muted styling, no hover state) so their non-interactivity reads as intentional.
- Modal must trap focus while open and return focus to the triggering element on close.
- Respect `prefers-reduced-motion`: GSAP animations should be skipped or significantly reduced for users with that preference set.

---

## Separate: opportunities & possible improvements

Not part of the instructions above — things worth considering as the project develops, not required to start building:

1. **`.ics` calendar export** — let parents add a group's schedule (or a single event) to their own calendar app. Low effort, high perceived value.
2. **Print-friendly view** — a stripped-down CSS view for printing the week's schedule, useful for parents without smartphones handy at pickup.
3. **PWA basics** — since favicons are already prepared, a `manifest.json` and "add to home screen" prompt could make the schedule feel more like a native app for a week-long event.
4. **Native share** — a "dela schema" button using the Web Share API on mobile, falling back to copy-link on desktop.
5. **`prefers-reduced-motion` handling** (listed above as a requirement, but worth flagging again as easy to forget under time pressure).
6. **Vercel Analytics** — trivial to add, gives you a sense of whether parents are actually using the site during the week, without any cookie-consent complexity since it's not third-party tracking.
7. **Reduced-JSON validation script as a CI step** — run the zod validation automatically on every push, so a malformed JSON edit never reaches production.
8. **Age-group badge on home page cards** — since `ageGroup` now exists in the data model, consider surfacing it on the group cards themselves (e.g. "Grupp A · 2012–2013") so parents don't need to already know which letter maps to which birth year.
9. **Multi-year support test** — once 2026 is done, a quick dry run of duplicating `content/2026` to `content/2027` with new dates would validate that the folder-per-year approach holds up before it's actually needed.