# Home page — locked design & interaction

> The approved visual/interaction direction for the home page, arrived at through iterative mockups. **Visual source of truth: `mockups/home.html`** (open it in a browser; it references the real assets in `public/`). This file describes the intent so nothing is lost when porting to Next.

**Important:** in `mockups/home.html` the `.lab`, `.phone` and `.screen` wrappers are **mockup scaffolding only** (a device frame to preview on desktop). The real app is the content *inside* `.screen`, built as a normal responsive mobile-first page — do not build a phone frame.

## Theme (unchanged from `brand notes.md`)
Dark `#211E1E`, white text, red `#BF192B` (single red, no `#F8233A`). MBJ Chunky headings, IBM Plex Mono body. **Flat — no gradients/glows/soft shadows.** Boxes are a darker tone (`~#141111`) than the page, separated by tone not borders.

## Hero
- Full decoration pattern (`public/decoration/pattern.svg`) as background, **no dark scrim** — the pattern pops; heading legibility comes from the stroke instead.
- **Heading stroke:** any MBJ Chunky heading sitting on the pattern/coloured ground gets the branded outline — white (or red) fill with a `#211E1E` stroke, `-webkit-text-stroke:.2em` + `paint-order:stroke fill` (≈20%). Headings on the plain bg colour get no stroke.
- Logo (`logo.svg`, ~130px) sits **behind** the title (lower z-index); the title overlaps only the bottom ~30px of it.
- Title: **"Hockeyskola 2026"** — "Hockeyskola" white, "2026" red (red used sparingly as a hierarchy device, not by size alone). Logo carries the club name, so it isn't repeated.
- **Animation:** on load, logo fades in, then title reveals **line by line** (fade+slide up — must NOT clip the stroke; don't use an `overflow:hidden` mask that cuts the outline). On scroll, background parallaxes slower than content; the logo parallaxes slightly **faster** than the title (factor ≈ 0.07 — very subtle). No catch-up/easing lag on the parallax (drive transform directly).

## Marquee (below hero)
Horizontal auto-scrolling strip. Uniform red bullets (`●`) between every item. Hollow (outline red) text for facts — "3–8 Augusti 2026", "LF Arena", "Piteå" as **separate** strings — and filled red text for the tagline "Nästa roliga säsong börjar redan nu!".

## Group cards ("Välj grupp")
- Section heading "Välj grupp" in MBJ Chunky.
- 2×2 grid of four dark, clean cards (darker than page, no border, radius ~16px, generous top/bottom padding, content centred with air).
- Each card, centred and as a unit: **"GRUPP"** (MBJ Chunky, same size/tracking as the "Spara som app" heading — 17px, normal tracking) directly above the **big letter** (MBJ Chunky, white, ~88px, `line-height:1` so it doesn't overlap the label). Age below the letter (IBM Plex Mono, muted, sits close to the letter — the age may differ in font since it's a clarifier).
- **Only clickable element = a small red button "Visa schema →"** (red bg, white text + arrow, slightly rounded corners ~9px). The card itself is not a link. Button navigates to `/grupp/[a|b|c|d]`.
- **Animation:** cards stagger in on scroll (fade + rise). Subtle magnetic tilt of the letter on pointer move (desktop). Button lifts slightly on hover.
- Age mapping (confirm if wrong): A = 2012–2013, B = 2014, C = 2015–2016, D = 2017 (from `ageGroup` in `schema-data-model.md`).

## "Spara som app"
Dark box. Heading "Spara som app", short intro line just under it (tight), iPhone/Android **toggle** that swaps numbered install steps. Step markup: each step's text wrapped in one element so inline `<b>` doesn't become its own flex column.

## Sponsor placeholder
Below "Spara som app", above footer. Left-aligned eyebrow "I samarbete med", then a dark box with generous top/bottom padding containing the PHC logo faded (~12% opacity) with "Sponsorlogotyp" on top.

## Footer
Centred: "Piteå Hockey" (MBJ Chunky) with a small gap above "Sommarhockeyskola · 2026".

## Porting notes
- Rebuild the motion with **real GSAP** (`useGSAP`, ScrollTrigger for parallax/reveals) per `tech-stack.md` §5 — the mockup uses vanilla JS only because the Artifact CSP blocked the GSAP CDN.
- `logo.svg` has a hardcoded `width="330"` — always constrain it with explicit CSS size (or strip width/height from the file) or it renders huge.
- Respect `prefers-reduced-motion` throughout.
