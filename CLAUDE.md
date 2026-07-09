# Piteå Hockey – Sommarhockeyskola 2026

A small, mobile-first web app (that should *feel* like a native app) for parents/players of the 2026 summer hockey school (3–8 aug 2026, Piteå). Parents land on a home page, tap their group (A–D), and see that group's day-by-day schedule; tapping an event opens a modal with details (lunch menu, location + hitta-hit, contacts, etc.). No registration/payment/login — that lives on laget.se.

## Hard tech rules (non-negotiable — don't drift)

- **Next.js, App Router** (`app/`), **TypeScript** only. Server Components by default; `"use client"` only for interactivity/animation.
- Routes: `/` (home) and `/grupp/[grupp]` where `grupp` = `"a" | "b" | "c" | "d"`.
- **Styling: CSS Modules + Sass** — a colocated `ComponentName.module.scss` per component. **No Tailwind, no global utility classes.** Shared tokens in `styles/_tokens.scss`.
- **Flat design: solid fills only. No gradients, glows, or soft shadows.** Extra shades = tints/shades of the 3 brand colors, never new hues. Must not look "AI-generated".
- **Animation: GSAP via the `useGSAP` hook** (`@gsap/react`), registered once in `lib/gsap.ts`. Subtle/short; respect `prefers-reduced-motion`.
- **Content: typed JSON under `content/2026/`** (per year). Import directly in Server Components; validate with `zod` at build/import. No CMS/database.
- **Hosting: Vercel.** Vercel Analytics on. PWA = manifest + installable only, **no service worker / no offline**.

## Source of truth — read on demand, don't preload

`brief/` holds the full spec. **Read a doc when you need it, not every session** — don't restate their contents here.

- `brief/overview.md` — purpose, audience, the *feeling* the app should have.
- `brief/content.md` — what's on each page (home + group), modal specs, wireframe notes.
- `brief/schema-data-model.md` — JSON shapes for schedule/locations/contacts/menu. **Read before touching any content JSON or data structure.**
- `brief/brand notes.md` — colors, typography, decoration pattern, tone of voice. **Read before styling.**
- `brief/tech-stack.md` — full build conventions (the rules above are the short version).
- `brief/grupp-{a,b,c,d}.md` — per-group source data (times, rooms, contacts).

## Assets (already in repo)

- Fonts: `public/fonts/` — `MBJ Chunky.ttf` (headings), IBM Plex Mono (body, woff2).
- Logo: `public/logo/logo.svg`. Favicons: `public/favicons/`.
- Decoration pattern: `public/decoration/pattern.svg` (placeholder, client will swap — reference by stable path, don't hardcode its dimensions).

## Working style

- Small steps; confirm the *look/feel* on hardcoded mockups before wiring real data.
- Placeholder data carries `"tba": true` (the machine-readable "update me" marker) — surface these in the zod validation step.
- Swedish for all user-facing copy; English for code/comments.
