# MOVA — 4-Year Strategy App

Personal strategy operating system for Yusuf Ayran, tracking the 4-year
journey (Jul 2026 → Dec 2030): daily rhythm and non-negotiables, milestone +
OKR timeline, weekly scorecard, and the decision compass.

Built from the high-fidelity design handoff (`design_handoff_mova_strategy`):
a static React 19 + Vite single-page app with **Supabase** for authentication
and cross-device sync, deployed to **GitHub Pages** by the workflow in
`.github/workflows/deploy.yml`.

Live URL: https://yusuf-ayran.github.io/claude/

## How sync works

This is a **single-user app with no login**. All app state lives in ONE shared
row in Supabase (`public.solo_state`) that the public (anon) key reads and
writes. Every device running the app connects to that same row automatically —
no sign-in, no magic link.

- The browser's localStorage is an offline cache — the app always works, and
  every change is written through to Supabase (debounced, last-write-wins).
- On load and whenever the tab regains focus, the app pulls the latest row, so
  phone and laptop stay in step.
- **Trade-off:** because the app is on a public URL with a public anon key,
  anyone who has both could read/write this row. That is acceptable here
  because only the owner uses the app. (For a multi-user version, restore
  auth + per-user rows.)

## One-time Supabase setup (~2 minutes)

1. Create a free project at https://supabase.com.
2. In the project's **SQL Editor**, paste and run `supabase/schema.sql`
   (creates the `solo_state` table).
3. Get the **Project URL** and **anon (public) key** from **Settings → API**.
4. Either:
   - add them as GitHub **repository variables** named `SUPABASE_URL` and
     `SUPABASE_ANON_KEY` (Settings → Secrets and variables → Actions →
     Variables) and re-run the deploy workflow — the connection is then baked
     into the site for every device, **or**
   - open the app, tap the small **“LOCAL ONLY · SET UP SYNC”** control in
     the footer, and paste both values there (stored per device).

No authentication step — once the database is connected, every device syncs
automatically.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build (dist/)
```

Key code:

- `src/mova/` — the whole app: `data.ts` (seed content from the handoff),
  `model.ts` (state shape + date/countdown logic), `useSync.ts` (Supabase
  auth + sync), views per tab, `mova.css` (interaction states).
- `supabase/schema.sql` — the database schema + RLS policies.
- `design-brief.md` — the locked design (palette, type, spacing) from the
  handoff.

## Deployment

Every push to this branch runs the GitHub Pages workflow: build, upload,
deploy. Pages must be allowed to deploy from Actions (the workflow enables
this automatically on first run; if it fails once, set Settings → Pages →
Source to "GitHub Actions" and re-run).
