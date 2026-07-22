import { useCallback, useEffect, useRef, useState } from "react";

import "./mova.css";
import {
  countdownFor,
  loadLocal,
  saveLocal,
  toISO,
  type SyncedState,
} from "./model";
import { useSync } from "./useSync";
import { TodayView } from "./TodayView";
import { JourneyView } from "./JourneyView";
import { OSView } from "./OSView";
import { CompassView } from "./CompassView";
import { SyncPanel } from "./SyncPanel";

type Tab = "today" | "journey" | "os" | "compass";

const TABS: [Tab, string][] = [
  ["today", "TODAY"],
  ["journey", "JOURNEY"],
  ["os", "OPERATING SYSTEM"],
  ["compass", "COMPASS"],
];

export function MovaApp() {
  // "Now" ticks every 30s so the day header, countdown, and daily reset all
  // recompute on load / day change without a reload.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const todayISO = toISO(now);

  // Synced state — localStorage is the always-on cache; Supabase (when
  // connected) is the source of truth across devices.
  const [state, setState] = useState<SyncedState>(() => loadLocal(toISO(new Date())));

  const mutate = useCallback((patch: Partial<SyncedState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      saveLocal(next);
      return next;
    });
  }, []);

  // Non-negotiables reset every calendar day.
  useEffect(() => {
    if (state.dailyDate !== todayISO) mutate({ daily: {}, dailyDate: todayISO });
  }, [state.dailyDate, todayISO, mutate]);

  const applyRemote = useCallback((remote: SyncedState) => {
    setState(remote);
    saveLocal(remote);
  }, []);

  const sync = useSync(state, applyRemote, todayISO);

  // UI-only state (kept local, never synced).
  const [tab, setTab] = useState<Tab>("today");
  const [filter, setFilter] = useState("ALL");
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({ "2026": true });
  const [openQ, setOpenQ] = useState<Record<string, boolean>>({ q326: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selDay, setSelDay] = useState<string | null>(null);
  const scrollTop = useRef<HTMLDivElement>(null);

  // State mutators (all write-through).
  const toggleDone = useCallback(
    (id: string) => {
      const d = { ...state.done };
      if (d[id] !== undefined) delete d[id];
      else d[id] = todayISO;
      mutate({ done: d });
    },
    [state.done, todayISO, mutate],
  );

  const toggleDaily = useCallback(
    (i: number) => {
      const d = { ...state.daily };
      if (d["d" + i]) delete d["d" + i];
      else d["d" + i] = true;
      // Record today's completion count so streaks + momentum have history.
      const count = Object.keys(d).length;
      mutate({
        daily: d,
        dailyDate: todayISO,
        dailyLog: { ...state.dailyLog, [todayISO]: count },
      });
    },
    [state.daily, state.dailyLog, todayISO, mutate],
  );

  const setJournal = useCallback(
    (field: "one" | "review", value: string) => {
      const cur = state.journal[todayISO] || {};
      mutate({ journal: { ...state.journal, [todayISO]: { ...cur, [field]: value } } });
    },
    [state.journal, todayISO, mutate],
  );

  const setMsEdit = useCallback(
    (id: string, patch: { label?: string; due?: string }) => {
      mutate({ edits: { ...state.edits, [id]: { ...(state.edits[id] || {}), ...patch } } });
    },
    [state.edits, mutate],
  );

  const setMsDoneDate = useCallback(
    (id: string, iso: string) => {
      mutate({ done: { ...state.done, [id]: iso } });
    },
    [state.done, mutate],
  );

  const setScore = useCallback(
    (cat: string, v: number) => {
      mutate({ scores: { ...state.scores, [cat]: v } });
    },
    [state.scores, mutate],
  );

  const setBottleneck = useCallback((v: string) => mutate({ bottleneck: v }), [mutate]);

  const saveWeek = useCallback(() => {
    const entry = { date: todayISO, scores: { ...state.scores }, bottleneck: state.bottleneck };
    mutate({ entries: [entry, ...state.entries.filter((x) => x.date !== todayISO)] });
  }, [state.scores, state.bottleneck, state.entries, todayISO, mutate]);

  const countdown = countdownFor(state.done, now, todayISO);

  const journeyUi = {
    filter,
    setFilter,
    openYears,
    toggleYear: (y: string) => setOpenYears((o) => ({ ...o, [y]: !o[y] })),
    openQ,
    toggleQ: (id: string) => setOpenQ((o) => ({ ...o, [id]: !o[id] })),
    editingId,
    setEditingId,
    selDay,
    setSelDay,
  };

  return (
    <div
      ref={scrollTop}
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        background: "#FDFDFB",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky header */}
      <div
        className="mv-appheader"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(253,253,251,.96)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #D9E2DC",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "16px 20px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 6, color: "#1F4D3A" }}>
                M O V A
              </span>
              <span style={{ width: 42, height: 1, background: "#1F4D3A" }} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 2.2, color: "#A9BBB0" }}>
              STEP NATURALLY. LIVE FULLY.
            </span>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 10, overflowX: "auto" }}>
            {TABS.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={{
                  appearance: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "11px 13px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10.5,
                  letterSpacing: 1.8,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  color: tab === k ? "#1F4D3A" : "#5F7A6C",
                  borderBottom: `2px solid ${tab === k ? "#1F4D3A" : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "today" ? (
        <TodayView
          state={state}
          now={now}
          todayISO={todayISO}
          countdown={countdown}
          toggleDaily={toggleDaily}
          setJournal={setJournal}
          goJourney={() => setTab("journey")}
          goOS={() => setTab("os")}
        />
      ) : null}
      {tab === "journey" ? (
        <JourneyView
          state={state}
          now={now}
          todayISO={todayISO}
          countdown={countdown}
          ui={journeyUi}
          toggleDone={toggleDone}
          setMsEdit={setMsEdit}
          setMsDoneDate={setMsDoneDate}
        />
      ) : null}
      {tab === "os" ? (
        <OSView
          state={state}
          now={now}
          toggleDaily={toggleDaily}
          setScore={setScore}
          setBottleneck={setBottleneck}
          saveWeek={saveWeek}
        />
      ) : null}
      {tab === "compass" ? <CompassView /> : null}

      {/* Footer */}
      <div className="mv-appfooter" style={{ marginTop: "auto" }}>
        <div
          style={{
            position: "relative",
            maxWidth: 760,
            margin: "0 auto",
            padding: "64px 20px 0",
            height: 0,
          }}
        />
        <div style={{ position: "relative", borderTop: "1px solid #D9E2DC", marginTop: 64 }}>
          <svg
            width="40"
            height="44"
            viewBox="0 0 40 44"
            style={{ position: "absolute", left: "max(24px,calc(50% - 340px))", bottom: 0 }}
            fill="none"
            stroke="#1F4D3A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="20" cy="7" r="4.2" />
            <path d="M20 11.5 C20.4 17 20.2 21 20 24.5" />
            <path d="M20 24.5 C17.5 30 14.5 36 11.5 42" />
            <path d="M20 24.5 C22.5 30.5 25.5 36.5 29 42" />
            <path d="M20 14.5 C17 17.5 14.8 20 13.5 23" />
            <path d="M20 14.5 C23 17.5 25.5 19.5 27 22.5" />
            <circle cx="13" cy="24.4" r="1.4" />
            <circle cx="27.7" cy="23.9" r="1.4" />
          </svg>
        </div>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "32px 20px 42px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              fontSize: 14.5,
              color: "#5F7A6C",
              lineHeight: 1.7,
              maxWidth: 440,
              margin: 0,
              textWrap: "pretty",
            }}
          >
            “The biggest project is not football. The biggest project is not MOVA. The biggest
            project is who you become while building them.”
          </p>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.2, color: "#A9BBB0" }}>
            YUSUF AYRAN · 2026–2030
          </span>
          <SyncPanel sync={sync} />
        </div>
      </div>
    </div>
  );
}
