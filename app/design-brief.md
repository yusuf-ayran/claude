# MOVA — 4-Year Strategy · design brief

This build recreates a **high-fidelity design handoff** (see the project
README): the palette, typography, spacing, and copy were delivered final and
are recreated pixel-perfectly. The usual concept/boards/asset phases do not
apply — the handoff *is* the locked design, and it specifies **no images**
(two inline SVGs only: progress ring + footer walking figure).

- **Design read** — a private strategy operating system for one athlete-founder;
  calm, disciplined, editorial; used daily on a phone.
- **Concept spine** — "a paper field journal for a 4-year journey": paper
  ground, deep-green ink, days of the journey rendered as a field of dots.
- **Delivery tier** — `editorial` (micro-motion only: chevron rotations,
  progress ring/bar transitions .5–.6s ease).
- **Locked palette (from the handoff, user-supplied — overrides defaults)** —
  paper `#FDFDFB`, ink `#12291E`, primary green `#1F4D3A` (hover `#12291E`),
  greens scale `#7EA88C` `#A3C0AC` `#C4D6C9` `#DCE7DF` `#E3EBE5` `#EDF2EE`,
  muted `#5F7A6C`, faint `#A9BBB0`, hairline `#D9E2DC`, terracotta accent
  `#B0654F` (overdue only).
- **Locked type** — Inter 400/500/600/700 everywhere. Kickers 9–11px 700
  tracking 1.4–2.6px uppercase; body 12.5–13.5px lh ~1.45; TODAY h1
  clamp(32px,6vw,44px) 700.
- **Chrome** — radii 10–12px cards / 999px pills / 5px checkboxes; **no
  shadows** (flat: borders + fills). Content column 720–760px, 20px side
  padding. All copy is final handoff copy (em-dashes included by the client's
  content).
- **Section plan** — four tabs: TODAY (dashboard), JOURNEY (ring + day map +
  filter chips + collapsible OKR timeline), OPERATING SYSTEM (protocol,
  non-negotiables, rhythm, scorecard), COMPASS (static pyramid + filter +
  leverage bars).
- **Asset plan** — none by design: no photography, no illustration; inline
  SVGs and an SVG favicon derived from the footer walking figure.
- **CTA inventory** — green pill buttons (OPEN SCORECARD, SAVE SCORECARD,
  DONE, CONNECT/SEND MAGIC LINK) darken to ink on hover; text-link CTA
  (SUNDAY REMINDER → GOOGLE CALENDAR) underlined, hover ink; chips 999px
  solid-green when active.
- **Backend** — Supabase (user's own project): email magic-link auth + one
  JSONB row per user (RLS), localStorage as offline cache; write-through
  debounced sync, last-write-wins.
