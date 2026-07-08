# Overview – Piteå Hockeys Sommarhockeyskola 2026 (web app)

> The "why" and "who" behind the project. Pairs with `content.md` (what's on each page), `tech-stack.md` (how it's built), `brand notes.md` (how it looks/sounds) and `schema-data-model.md` (data shape). Structural text in English; in-app copy is Swedish.

---

## 1. Purpose

A small, fast web app (that *feels* like an app) for participants and parents of the 2026 summer hockey school, held 3–8 August 2026 in Piteå. It replaces "where/when is my kid supposed to be?" confusion during a busy week with a schedule that's always one tap away.

Primary job: **let a parent open the site on their phone and, in seconds, see their group's schedule for the day and the practical details behind each event** (times, locations, hitta-hit, lunch, contacts).

Not in scope: registration/payment (handled on laget.se, see invitation), player rosters, login, or a CMS.

## 2. Audience & context

- **Primary users**: parents and players in one of four groups (birth years 2012–2017), checking on mobile, often on the go between activities.
- They already know registration is done elsewhere; they come here for **schedule + logistics during the week**.
- Content changes during the week (menus, topics, TBA fields fill in) — so it must read cleanly even when info is "Information kommer".

## 3. Experience / feeling

**Core idea: a matchday program.** A bold, proud cover — and calm, clear info inside. The app has two layers that must not fight each other:

**The wrapper — loud, proud, unmistakably Piteå Hockey.**
The hero, the group cards, the decoration pattern (see `brand notes.md` / `tech-stack.md` §11). Red on black, chunky MBJ Chunky headings, the club's hand-drawn motifs and sayings ("1986", "IKVÄLL KÄKAR VI PUCK!"). This part should feel like walking into the arena on a game day: energy, tradition, local pride. It's what makes a kid excited to be part of the hockey school and a parent feel they're in good, serious-but-warm hands.

**The core — calm, instant, effortless.**
The schedule and event modals. Here the brand steps back so information wins: generous spacing, high legibility, time-first rows, one tap to the detail a parent needs (lunch, location, hitta-hit, contact). No hunting, no clutter, nothing more than a tap away. A stressed parent between two activities should get today's plan in seconds, one-handed, on a phone.

**Overall it should feel like a native app, not a website.** Fast, tactile, installable to the home screen; it opens and *responds* rather than "loads a page". Animations (GSAP) are subtle and short — they add life to the wrapper (cards easing in, the pattern drifting slowly) but never delay the parent from reading the schedule.

**Tone throughout**: warm, welcoming, traditionsbetonad — see `brand notes.md` → Tone of voice.

> *Your turn to adjust:* tweak any of the three layers above in your own words — especially the emotional note you want parents/kids to leave with. This draft is a starting point, not the final word.

## 4. Success looks like

- A parent lands, taps their group, and reads the day's schedule without instructions.
- Event details (lunch/location/contact/hitta-hit) are reachable in one tap via the modal.
- The site is added to home screens and used repeatedly across the week (see Vercel Analytics, `tech-stack.md` §6).