import { CATS, YEARS, JOURNEY_START, JOURNEY_END, type Quarter } from "./data";

export const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());

export function fmtDate(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export type Edits = Record<string, { label?: string; due?: string }>;
export type Entry = { date: string; scores: Record<string, number>; bottleneck: string };
export type JournalEntry = { one?: string; review?: string };

// Per-user synced state — the part that lives in the cloud DB.
export type SyncedState = {
  done: Record<string, string>; // milestoneId/krId -> ISO completion date ("" allowed legacy)
  daily: Record<string, boolean>; // itemIndex ("d0".."d5") -> true
  dailyDate: string; // resets when the calendar date changes
  dailyLog: Record<string, number>; // dateISO -> count of non-negotiables done that day
  journal: Record<string, JournalEntry>; // dateISO -> { one thing, evening review }
  edits: Edits; // milestoneId -> {label?, due?} overrides
  entries: Entry[]; // scorecard history, upsert by date
  scores: Record<string, number>; // current slider positions
  bottleneck: string; // current input
  updatedAt: string; // last-write-wins marker for sync
};

export const LS_KEY = "mova-strategy-v1";
export const EPOCH = "1970-01-01T00:00:00.000Z";

export function normalizeState(raw: unknown, todayISO: string): SyncedState {
  const saved = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const done: Record<string, string> = {};
  Object.entries(saved.done || {}).forEach(([k, v]) => {
    done[k] = v === true ? "" : String(v ?? "");
  });
  const daily: Record<string, boolean> =
    saved.dailyDate === todayISO && saved.daily && typeof saved.daily === "object"
      ? saved.daily
      : {};
  const scores: Record<string, number> = {};
  CATS.forEach((c) => {
    scores[c] = (saved.scores && saved.scores[c]) || 5;
  });
  return {
    done,
    daily,
    dailyDate: todayISO,
    dailyLog: saved.dailyLog && typeof saved.dailyLog === "object" ? saved.dailyLog : {},
    journal: saved.journal && typeof saved.journal === "object" ? saved.journal : {},
    edits: saved.edits && typeof saved.edits === "object" ? saved.edits : {},
    entries: Array.isArray(saved.entries) ? saved.entries : [],
    scores,
    bottleneck: typeof saved.bottleneck === "string" ? saved.bottleneck : "",
    updatedAt: typeof saved.updatedAt === "string" ? saved.updatedAt : EPOCH,
  };
}

// Add/subtract whole days from an ISO date (YYYY-MM-DD).
export function shiftISO(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return toISO(d);
}

// Current streak of days where all `goal` non-negotiables were done, counting
// back from today (today counts once it's complete; otherwise the run is
// measured up to yesterday so an unfinished today doesn't break it).
export function computeStreak(
  dailyLog: Record<string, number>,
  todayISO: string,
  goal: number,
): number {
  let streak = 0;
  let cursor = (dailyLog[todayISO] || 0) >= goal ? todayISO : shiftISO(todayISO, -1);
  while ((dailyLog[cursor] || 0) >= goal) {
    streak++;
    cursor = shiftISO(cursor, -1);
  }
  return streak;
}

// The last `n` days (oldest→newest) with their completion count.
export function recentDaily(
  dailyLog: Record<string, number>,
  todayISO: string,
  n: number,
): { iso: string; count: number }[] {
  const out: { iso: string; count: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const iso = shiftISO(todayISO, -i);
    out.push({ iso, count: dailyLog[iso] || 0 });
  }
  return out;
}

export function loadLocal(todayISO: string): SyncedState {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(LS_KEY) || "null"), todayISO);
  } catch {
    return normalizeState(null, todayISO);
  }
}

export function saveLocal(s: SyncedState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* storage full/unavailable — in-memory state still works */
  }
}

export const isDone = (done: Record<string, string>, id: string) => done[id] !== undefined;

export const msDue = (edits: Edits, q: Quarter, msId: string) => edits[msId]?.due || q.end;

export function currentQuarter(todayISO: string): Quarter | null {
  for (const Y of YEARS) for (const Q of Y.quarters) if (Q.end >= todayISO) return Q;
  return null;
}

// Countdown logic: if today <= 2026-08-31 and ms1 (contract) unchecked ->
// "N DAYS TO CONTRACT WINDOW"; else days left in the current quarter.
export function countdownFor(done: Record<string, string>, now: Date, todayISO: string): string {
  const cwDays = Math.ceil((new Date("2026-08-31T23:59:59").getTime() - now.getTime()) / 864e5);
  if (cwDays > 0 && !isDone(done, "ms1")) return cwDays + " DAYS TO CONTRACT WINDOW";
  const q = currentQuarter(todayISO);
  if (q) {
    const dl = Math.ceil((new Date(q.end + "T23:59:59").getTime() - now.getTime()) / 864e5);
    if (dl > 0) return dl + " DAYS LEFT IN " + q.label.toUpperCase();
  }
  return "";
}

export function journeyDays(todayISO: string) {
  const startD = new Date(JOURNEY_START + "T12:00:00");
  const endD = new Date(JOURNEY_END + "T12:00:00");
  const totalDays = Math.round((endD.getTime() - startD.getTime()) / 864e5) + 1;
  const todayD = new Date(todayISO + "T12:00:00");
  const dayNum = Math.min(
    totalDays,
    Math.max(1, Math.round((todayD.getTime() - startD.getTime()) / 864e5) + 1),
  );
  const pctThrough = Math.round((dayNum / totalDays) * 100);
  return { startD, totalDays, dayNum, pctThrough };
}

export function quarterOf(iso: string): string {
  for (const Y of YEARS) for (const Q of Y.quarters) if (iso <= Q.end) return Q.label + " · " + Y.theme;
  return "2030 · LEGACY";
}
