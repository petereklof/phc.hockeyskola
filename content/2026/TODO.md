# Content TODO — manuell översyn (2026)

Maskinläsbara TBA-fält listas automatiskt av bygget (`lib/content.ts` loggar alla
`"tba"`-markörer). Nedan är antaganden som INTE syns i tba-rapporten och behöver
manuell koll:

- [ ] **Platser per pass är antagna, inte bekräftade:** alla is-, match- och
      fyspass har `"locationId": "lf-arena"` som platshållare. Underlaget
      (brief/grupp-*.md) anger inte hall per pass — justera i
      `groups/grupp-*.json` när riktig hallfördelning finns
      (fys: LF Arena/Grisberget).
- [ ] **"Bollspel"** (Grupp B, måndag 13:30–14:10) har `"category": "other"` —
      bekräfta att det inte ska räknas som träningspass
      (`"category": "training"`, som styr radens färg).
- [ ] Målvaktsträning ligger **tisdag 4/8** enligt grupp-briefen (content.md sa
      onsdag) — bekräftat av Peter 2026-07-09, ingen åtgärd om inget ändras.
- [ ] Grupp D saknar "Assisterande instruktör" (enligt brief) — bekräfta.
