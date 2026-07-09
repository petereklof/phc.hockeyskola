# Content TODO — manuell översyn (2026)

Maskinläsbara TBA-fält listas automatiskt av bygget (`lib/content.ts` loggar alla
`"tba"`-markörer). Nedan är antaganden som INTE syns i tba-rapporten och behöver
manuell koll:

- [ ] **Platser per pass är antagna, inte bekräftade:** alla `istraning`- och
      `matchspel`-event har `"locationId": "isstadion"` och alla `fystraning`-event
      `"locationId": "lf-arena"` som platshållare. Underlaget (brief/grupp-*.md)
      anger inte hall per pass — justera i `groups/grupp-*.json` när riktig
      hallfördelning finns (is: Isstadion/LF Arena, fys: LF Arena/Grisberget).
- [ ] **"Bollspel"** (Grupp B, måndag 13:30–14:10) är modellerat som typ
      `aktivitet` med titeln "Bollspel" — bekräfta att det är rätt tolkning
      (alternativt egen typ eller `fystraning`).
- [ ] Målvaktsträning ligger **tisdag 4/8** enligt grupp-briefen (content.md sa
      onsdag) — bekräftat av Peter 2026-07-09, ingen åtgärd om inget ändras.
- [ ] Grupp D saknar "Assisterande instruktör" (enligt brief) — bekräfta.
