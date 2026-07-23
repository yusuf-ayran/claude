# CEO — Client Analytics Dashboard

Design deliverable for **CEO**, Saudi Arabia's first executive personal
branding agency: a multi-client, client-facing analytics dashboard with an
editorial, dark-teal, executive visual language.

Two self-contained pages (no build step, no dependencies — open directly in a
browser):

- `design-system.html` — the brand design system: palette, type scale, the
  ≡ bar-stroke motif, core components (KPI stat, buttons, nav item, chart
  style, table, toggle), component states, and the do/don't discipline list.
- `index.html` — the working dashboard prototype: Overview, Analytics,
  Reports and Settings screens on top of that system.

## What the prototype demonstrates

- **Navigation** — collapsible sidebar (client identity on top, CEO mark
  below), top bar with date-range picker, client switcher, notifications and
  profile menu. Deep-linkable screens via `#overview`, `#analytics`, etc.
- **Overview** — 4 hairline-separated KPI stats with sparklines, a glowing
  teal trend chart with crosshair tooltip and previous-period comparison, and
  an activity feed.
- **Analytics** — channel filter chips, comparison toggle, horizontal
  bar-stroke channel chart, trend chart, and a sortable placements table.
- **Reports** — report cards with PDF/CSV actions (CSV is generated
  client-side) and a working "Generate report" flow with the ≡ skeleton.
- **Settings** — profile, white-label workspace accent (live), team access,
  notification preferences.
- **States** — switch clients in the top bar to see them: *Khalid Al-Harbi*
  (onboarding → empty states), *Lina Haddad* (restricted → no-access state).
  Every navigation shows the ≡ skeleton loading state briefly.

Dark mode is primary; a light variant (pale ground, deepened teal) follows
the OS `prefers-color-scheme` or a `data-theme` attribute on `<html>`.
All data is a deterministic fixture generated per client + date range —
no backend required.
