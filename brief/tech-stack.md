# Tech Stack & Build Instructions – Piteå Hockeys Sommarhockeyskola 2026

> Instructions for whoever (or whatever — Claude Code) builds this app. Defines language, hosting, styling, animation, and content conventions. Pair this with `content.md`, `overview.md` and `schema-data-model.md`.

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
- **Flat design, no gradients** (see `brand notes.md` → "Flat colors"). Use solid fills only — no `linear-gradient`/`radial-gradient`, no box-shadow glows. When a variation is needed (hover, borders, muted text, tinted event rows), derive it from the three core colors with Sass color functions (`color.scale`/`color.adjust`) and expose the resulting scale as tokens in `_tokens.scss` — never introduce new hues or gradient effects.

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
    - Hero decoration pattern: a subtle, slow drift/parallax of the background pattern (see §11) is a reasonable looping animation here since nothing in it needs to be "found" or clicked. Keep it very slow and low-amplitude, and disable it under `prefers-reduced-motion`.
- Keep animations subtle and short (200–600ms) given the primary audience checks schedules quickly on mobile between activities.

---

## 6. Hosting — Vercel

- Deploy directly from the GitHub repo via Vercel's Next.js integration (zero-config for a standard Next.js app).
- Environment variables (if a Maps API key or similar is introduced later) go in Vercel's project settings, not committed to the repo.
- Use Vercel's automatic preview deployments per branch/PR to review changes before merging to production.
- No server/database needed for this scope — content is static JSON — so this can run entirely on Vercel's standard hosting without added infrastructure.
- **Vercel Analytics**: enable it (`@vercel/analytics`, added once in `app/layout.tsx`). Gives a sense of whether parents actually use the site during the week, with no cookie-consent complexity since it's first-party and not third-party tracking.

---

## 7. Accessibility & UX baseline

- All interactive elements (group cards, schedule events, modal triggers) must be reachable and operable via keyboard, with visible focus states.
- Non-clickable events (e.g. "Samling") should be visually distinct (muted styling, no hover state) so their non-interactivity reads as intentional.
- Modal must trap focus while open and return focus to the triggering element on close.
- Respect `prefers-reduced-motion`: GSAP animations should be skipped or significantly reduced for users with that preference set.

---

## 8. Group cards & age badge (home page)

The four group cards are the home page's primary navigation, and each one must make the age split legible so parents don't need to already know which letter maps to which birth year. See `brief/example screenshots/` and `marketing examples/stall-tag-example.jpg` for structural layout, not appearance.

- Each card shows three stacked lines, driven entirely by the group JSON — nothing hardcoded in the component:
  ```
  GRUPP          ← static label
  A              ← group letter, large (from `name`, or `id` uppercased)
  2012–2013      ← age range (from `ageGroup`)
  ```
- Source the letter and age range from the group's content, not from a lookup baked into the component: the letter comes from `name` (`"Grupp A"`) / `id` (`"a"`), and the range from `ageGroup` (`"2012-2013"` etc. per `schema-data-model.md`). Render the display range with an en dash (`2012–2013`) even though the stored value uses a hyphen.
- The `GROUP_AGE_MAP` consistency check referenced in §2 lives here: a small `id → ageGroup` map validated with zod at build/import time, so a card can never show a letter and birth years that disagree with the group's own JSON.

---

## 9. PWA basics (home page)

Favicons are already prepared, so the remaining PWA work is small and makes the schedule feel like a native app for a week-long event.

- Add a `manifest.json` (name, short name, theme/background color, the existing icons) wired up in `app/metadata`.
- Offer an "add to home screen" affordance from the home page. Keep it unobtrusive (a dismissible prompt/notice, not a blocking modal) since parents mostly arrive to check a schedule quickly.
- **No service worker / no offline** (decided). Installability + icons is the whole scope. A service worker would risk serving a stale schedule since content changes during the week — explicitly avoided.

---

## 10. Native share (group page)

- Add a "Dela schema" button on the group page (`/grupp/[grupp]`) using the Web Share API (`navigator.share`) on mobile, so parents can share a group's schedule link directly to messaging apps.
- Fall back to copy-link (with a brief "kopierad"-confirmation) on desktop / where `navigator.share` is unavailable.
- Feature-detect rather than assume support, and keep the button reachable/operable via keyboard per §7.

---

## 11. Decoration pattern (brand background)

The club's signature red-on-dark decoration pattern (motifs + curved text chips, see `brand notes.md` → "Visual language") is a core visual element, **most importantly behind the hero on the home page**. The home page as a whole is inspired by `marketing examples/schedule-mobile-bg.jpg`.

- **Asset**: a background-only vector lives at `public/decoration/pattern.svg` (pure paths, no raster; viewBox `1080×2119`, ~1.3 MB on disk / **~383 KB gzipped**). This is a placeholder the client will later swap for a custom-tuned version — so keep it referenced by a stable path and don't hardcode its dimensions anywhere the replacement would break. Re-run SVGO if a future export needs shrinking.
- **Usage**: render it as a decorative, non-interactive background (CSS `background-image`, or an inline `<svg>`/`<img>` marked `aria-hidden="true"` with no alt), never as content. The main message (logo + heading) sits on top with enough contrast.
- **Where**: hero on `/` (primary). Can be reused more sparingly elsewhere (e.g. behind group cards à la `stall-tag-example.jpg`, or section headers) — keep it from competing with schedule legibility on group pages.
- **Fallback**: if the SVG ever proves unsuitable, the surface can be left as flat `#211E1E` and a background added manually later — the layout must not depend on the pattern being present.
- **Color**: red is `#BF192B` throughout (pattern and UI) — see `brand notes.md`.
- **Animation**: optional slow drift/parallax only, per §5, and off under `prefers-reduced-motion`.

---

## 12. Navigation

Two different top-of-page patterns, by page type:

- **Home page (`/`)** has **no navbar** — the hero (pattern + logo + heading) is the top of the page and the four group cards are the primary navigation.
- **Group pages (`/grupp/[grupp]`)** have a **navbar** at the top containing:
    - the club logo, linking back to `/` (home);
    - a dropdown listing the other groups, linking to their `/grupp/[a|b|c|d]` pages (so parents can hop between groups without going home first).
- The dropdown is interactive, so its component is `"use client"`; it must be keyboard-operable with visible focus and proper `aria-expanded`/menu semantics per §7. The group list can be derived from the four group JSON files (`id` + `name`) — no separate config needed.