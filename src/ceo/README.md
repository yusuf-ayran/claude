# CEO — Client Briefing

React implementation of the **CEO Client Dashboard** design handoff
(`design_handoff_ceo_client_dashboard`, "v3") — a client-facing briefing portal
for CEO, Saudi Arabia's executive personal-branding agency. Its primary job is
**content approval**; secondary jobs are the Presence Index, content
calendar/pipeline, channel analytics and the engagement roadmap.

This is a **second, independent single-page app** in the repo, separate from
MOVA. It has its own Vite entry (`/ceo.html` → `src/ceo/main.tsx`) and does not
touch the MOVA app or its GitHub Pages deploy.

- **Live locally:** `npm run dev`, then open `/ceo.html`.
- **Build:** `npm run build` emits both `dist/index.html` (MOVA) and
  `dist/ceo.html` (this app).

## Screens (5, tab-switched, no reload)

1. **Overview** — greeting hero, Presence Index + 12-month trend, awaiting-decision
   count, the approvals queue, and pipeline + channel summaries.
2. **Approvals** — the full queue (buttons become a status label once decided)
   plus recent-decisions history.
3. **Analytics** — per-channel 12-month bar trend + four stats, top content, press.
4. **Calendar** — three weeks of planned content grouped by week.
5. **Roadmap** — four engagement phases with progress bars and deliverables.

## Bilingual EN / AR + RTL

The header language toggle switches all copy, sets `dir="rtl"` on the app root,
and swaps the font (Manrope ⇄ IBM Plex Sans Arabic). Western numerals are kept;
the **CEO wordmark stays LTR**; stat values use `white-space: nowrap` so Arabic
figures like `48.2 ألف` never wrap. The entry also reads `?screen=` and `?lang=`
so a briefing email can deep-link (e.g. `/ceo.html?screen=approvals&lang=ar`).

## Files

- `data.ts` — design tokens, EN/AR copy, and demo `DATA` (also the API contract).
- `bits.tsx` — shared pieces (wordmark, section header, trend bars, stat, rows).
- `App.tsx` — state (screen, lang, decisions), chrome, and the five screens.
- `main.tsx` — entry: deep-link parsing + mount.
- `ceo.css` — surface + hover/focus states (inline styles carry layout).

## Interactions

**Approve / Request changes** replaces the row's buttons with the matching status
label and decrements the pending count everywhere (hero stat and the queue).
Decisions persist for the session — in production, POST + optimistic update.
Transitions are colour/border only (150ms); no transform or lift, no shadows.
