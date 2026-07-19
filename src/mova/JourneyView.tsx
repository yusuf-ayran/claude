import { Fragment } from "react";
import { TRACK_NAMES, YEARS } from "./data";
import {
  fmtDate,
  isDone,
  journeyDays,
  msDue,
  currentQuarter,
  quarterOf,
  toISO,
  type SyncedState,
} from "./model";
import { CheckRow, TrackPill } from "./bits";

export type JourneyUi = {
  filter: string;
  setFilter: (f: string) => void;
  openYears: Record<string, boolean>;
  toggleYear: (y: string) => void;
  openQ: Record<string, boolean>;
  toggleQ: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  selDay: string | null;
  setSelDay: (iso: string | null) => void;
};

export function JourneyView({
  state,
  now,
  todayISO,
  countdown,
  ui,
  toggleDone,
  setMsEdit,
  setMsDoneDate,
}: {
  state: SyncedState;
  now: Date;
  todayISO: string;
  countdown: string;
  ui: JourneyUi;
  toggleDone: (id: string) => void;
  setMsEdit: (id: string, patch: { label?: string; due?: string }) => void;
  setMsDoneDate: (id: string, iso: string) => void;
}) {
  const { done, edits } = state;
  const { startD, totalDays, dayNum, pctThrough } = journeyDays(todayISO);
  const curQ = currentQuarter(todayISO);

  // Milestone totals + per-year stats.
  let totalMs = 0;
  let doneMs = 0;
  const yearStats = YEARS.map((Y) => {
    let yT = 0;
    let yD = 0;
    for (const Q of Y.quarters)
      for (const M of Q.milestones) {
        yT++;
        totalMs++;
        if (isDone(done, M.id)) {
          yD++;
          doneMs++;
        }
      }
    return { year: Y.year, pct: yT ? Math.round((yD / yT) * 100) : 0, count: yD + "/" + yT, yD, yT };
  });
  const C = 2 * Math.PI * 48;

  // Milestones grouped by due date (with label/due overrides applied).
  const msMap: Record<string, { label: string; done: boolean; track: string }[]> = {};
  for (const Y of YEARS)
    for (const Q of Y.quarters)
      for (const M of Q.milestones) {
        const due = msDue(edits, Q, M.id);
        (msMap[due] = msMap[due] || []).push({
          label: edits[M.id]?.label || M.label,
          done: isDone(done, M.id),
          track: M.track,
        });
      }

  // Day map: one dot per journey day, grouped by year.
  const dayYears: {
    year: string;
    theme: string;
    dots: { iso: string; bg: string; ring: string; title: string }[];
  }[] = [];
  {
    const cur = new Date(startD.getTime());
    let yObj: (typeof dayYears)[number] | null = null;
    for (let i = 0; i < totalDays; i++) {
      const iso = toISO(cur);
      const yr = String(cur.getFullYear());
      if (!yObj || yObj.year !== yr) {
        const Yd = YEARS.find((y) => y.year === yr);
        yObj = { year: yr, theme: Yd ? Yd.theme : "", dots: [] };
        dayYears.push(yObj);
      }
      const ms = msMap[iso];
      const isT = iso === todayISO;
      const past = iso < todayISO;
      let bg = past ? "#A3C0AC" : "#E3EBE5";
      let title = fmtDate(iso) + " · Day " + (i + 1);
      if (ms) {
        const pend = ms.some((m) => !m.done);
        bg = pend ? (past ? "#B0654F" : "#12291E") : "#1F4D3A";
        title += " ★ " + ms.map((m) => m.label).join(" · ");
      }
      if (isT) {
        bg = "#1F4D3A";
        title += " · TODAY";
      }
      yObj.dots.push({
        iso,
        bg,
        title,
        ring: isT
          ? "0 0 0 2px #FDFDFB,0 0 0 3.5px #1F4D3A"
          : ui.selDay === iso
            ? "0 0 0 2px #FDFDFB,0 0 0 3.5px #B0654F"
            : "none",
      });
      cur.setDate(cur.getDate() + 1);
    }
  }

  // Selected-day detail panel.
  let sel: {
    date: string;
    rel: string;
    num: number;
    pct: number;
    quarter: string;
    ms: { label: string; color: string; tag: string }[];
  } | null = null;
  if (ui.selDay) {
    const sd = new Date(ui.selDay + "T12:00:00");
    const todayD = new Date(todayISO + "T12:00:00");
    const n = Math.round((sd.getTime() - startD.getTime()) / 864e5) + 1;
    const diff = Math.round((sd.getTime() - todayD.getTime()) / 864e5);
    sel = {
      date: fmtDate(ui.selDay),
      rel: diff === 0 ? "TODAY" : diff > 0 ? "IN " + diff + " DAYS" : Math.abs(diff) + " DAYS AGO",
      num: n,
      pct: Math.round((n / totalDays) * 100),
      quarter: quarterOf(ui.selDay),
      ms: (msMap[ui.selDay] || []).map((m) => ({
        label: m.label,
        color: m.done ? "#1F4D3A" : ui.selDay! < todayISO ? "#B0654F" : "#12291E",
        tag: m.done ? "✓ DONE" : ui.selDay! < todayISO ? "OVERDUE" : m.track,
      })),
    };
  }

  const todayMark =
    now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase() +
    (countdown ? " · " + countdown : "");

  const legend = [
    ["#A3C0AC", "ELAPSED", "none"],
    ["#1F4D3A", "TODAY", "0 0 0 1.5px #FDFDFB,0 0 0 2.5px #1F4D3A"],
    ["#E3EBE5", "AHEAD", "none"],
    ["#12291E", "MILESTONE DUE", "none"],
    ["#B0654F", "OVERDUE", "none"],
  ] as const;

  return (
    <div
      style={{
        maxWidth: 760,
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "28px 20px 0",
      }}
    >
      {/* Progress card */}
      <div
        style={{
          background: "#EDF2EE",
          borderRadius: 12,
          padding: 24,
          display: "flex",
          gap: 26,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", width: 112, height: 112, flex: "none" }}>
          <svg width="112" height="112" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#DCE7DF" strokeWidth="6" />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#1F4D3A"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={(doneMs / Math.max(1, totalMs)) * C + " " + C}
              transform="rotate(-90 56 56)"
              style={{ transition: "stroke-dasharray .6s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 700, color: "#1F4D3A", lineHeight: 1 }}>
              {doneMs}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.6,
                color: "#A9BBB0",
                marginTop: 3,
              }}
            >
              OF {totalMs}
            </span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 7 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2.2,
              color: "#1F4D3A",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            MILESTONES
          </div>
          {yearStats.map((y) => (
            <div
              key={y.year}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 36px",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: "#5F7A6C", fontWeight: 600 }}>{y.year}</span>
              <div style={{ height: 4, background: "#DCE7DF", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "#1F4D3A",
                    borderRadius: 2,
                    transition: "width .5s ease",
                    width: y.pct + "%",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: "#A9BBB0", textAlign: "right" }}>{y.count}</span>
            </div>
          ))}
        </div>
        {countdown ? (
          <div
            style={{
              flexBasis: "100%",
              borderTop: "1px solid #D9E2DC",
              paddingTop: 13,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <span
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#1F4D3A", flex: "none" }}
            />
            <span style={{ fontSize: 11, letterSpacing: 1.8, fontWeight: 700, color: "#1F4D3A" }}>
              {countdown}
            </span>
          </div>
        ) : null}
      </div>

      {/* The Journey in Days */}
      <div
        style={{
          background: "#FDFDFB",
          border: "1px solid #D9E2DC",
          borderRadius: 12,
          padding: "22px 24px",
          marginTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: 2.2, color: "#1F4D3A", fontWeight: 700 }}>
            THE JOURNEY IN DAYS
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1F4D3A" }}>
            DAY {dayNum} OF {totalDays} · {pctThrough}%
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {dayYears.map((dy) => (
            <div key={dy.year}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5F7A6C" }}>{dy.year}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.6, fontWeight: 700, color: "#A9BBB0" }}>
                  {dy.theme}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {dy.dots.map((dt) => (
                  <span
                    key={dt.iso}
                    onClick={() => ui.setSelDay(ui.selDay === dt.iso ? null : dt.iso)}
                    title={dt.title}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      cursor: "pointer",
                      flex: "none",
                      background: dt.bg,
                      boxShadow: dt.ring,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {sel ? (
          <div
            style={{
              marginTop: 16,
              background: "#EDF2EE",
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#12291E" }}>{sel.date}</span>
              <span style={{ fontSize: 10, letterSpacing: 1.4, fontWeight: 700, color: "#1F4D3A" }}>
                {sel.rel}
              </span>
              <span style={{ flex: 1 }} />
              <button
                onClick={() => ui.setSelDay(null)}
                className="mv-x"
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: "0 2px",
                  color: "#A9BBB0",
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: "#5F7A6C" }}>
              Day {sel.num} of {totalDays} · {sel.pct}% through · {sel.quarter}
            </div>
            {sel.ms.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {sel.ms.map((sm, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <span style={{ flex: "none", fontSize: 10, color: sm.color }}>★</span>
                    <span style={{ fontSize: 12.5, color: "#12291E", lineHeight: 1.4 }}>
                      {sm.label}{" "}
                      <span
                        style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: sm.color }}
                      >
                        {sm.tag}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 14,
            borderTop: "1px solid #D9E2DC",
            paddingTop: 12,
          }}
        >
          {legend.map(([color, label, ring]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 9.5,
                letterSpacing: 1,
                fontWeight: 600,
                color: "#5F7A6C",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: ring === "none" ? undefined : ring,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <p
        style={{
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.7,
          color: "#5F7A6C",
          margin: "26px 4px",
          textWrap: "pretty",
        }}
      >
        “I am not building a football career, a coaching business, or a shoe company. I am building
        one integrated ecosystem whose mission is to help people move, perform, and transform — and
        every new decision must strengthen that ecosystem.”
      </p>

      {/* Track filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {["ALL", ...TRACK_NAMES].map((k) => {
          const a = ui.filter === k;
          return (
            <button
              key={k}
              onClick={() => ui.setFilter(k)}
              style={{
                cursor: "pointer",
                padding: "7px 15px",
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                letterSpacing: 1.4,
                fontWeight: 700,
                border: `1px solid ${a ? "#1F4D3A" : "#D9E2DC"}`,
                background: a ? "#1F4D3A" : "transparent",
                color: a ? "#FDFDFB" : "#5F7A6C",
              }}
            >
              {k}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {YEARS.map((Y) => {
        const open = !!ui.openYears[Y.year];
        const stats = yearStats.find((s) => s.year === Y.year)!;
        return (
          <div key={Y.year} style={{ marginBottom: 6 }}>
            <div
              onClick={() => ui.toggleYear(Y.year)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "17px 4px",
                borderTop: "1px solid #D9E2DC",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  lineHeight: 1,
                  flex: "none",
                  color: open ? "#12291E" : "#A9BBB0",
                }}
              >
                {Y.year}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: 2.4, color: "#1F4D3A", fontWeight: 700 }}>
                  {Y.theme}
                </div>
                <div style={{ fontSize: 11.5, color: "#5F7A6C", marginTop: 3 }}>{Y.targets}</div>
              </div>
              <span style={{ fontSize: 10, color: "#A9BBB0", letterSpacing: 1, flex: "none" }}>
                {stats.yD}/{stats.yT} ★
              </span>
              <span
                style={{
                  color: "#A9BBB0",
                  fontSize: 12,
                  flex: "none",
                  transition: "transform .25s",
                  transform: `rotate(${open ? "180deg" : "0deg"})`,
                }}
              >
                ▾
              </span>
            </div>
            {open ? (
              <div style={{ position: "relative", margin: "2px 0 16px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 11,
                    top: 8,
                    bottom: 8,
                    width: 1.5,
                    background: "#C4D6C9",
                  }}
                />
                <div style={{ marginLeft: 36, display: "flex", flexDirection: "column", gap: 14 }}>
                  {Y.quarters.map((Q) => {
                    const qOpen = !!ui.openQ[Q.id];
                    let kT = 0;
                    let kD = 0;
                    Q.okrs.forEach((O, oi) =>
                      O.krs.forEach((_, ki) => {
                        kT++;
                        if (isDone(done, Q.id + "-" + oi + "-" + ki)) kD++;
                      }),
                    );
                    return (
                      <Fragment key={Q.id}>
                        {Q.id === curQ?.id ? (
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              margin: "2px 0",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: -29,
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "#1F4D3A",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 9,
                                letterSpacing: 1.6,
                                fontWeight: 700,
                                color: "#1F4D3A",
                                background: "#DCE7DF",
                                padding: "4px 10px",
                                borderRadius: 999,
                                whiteSpace: "nowrap",
                              }}
                            >
                              YOU ARE HERE
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                letterSpacing: 1,
                                fontWeight: 600,
                                color: "#5F7A6C",
                              }}
                            >
                              {todayMark}
                            </span>
                            <span style={{ flex: 1, height: 1, background: "#D9E2DC" }} />
                          </div>
                        ) : null}
                        <div style={{ position: "relative" }}>
                          <div
                            style={{
                              position: "absolute",
                              left: -28,
                              top: 18,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#FDFDFB",
                              border: "1.4px solid #1F4D3A",
                              boxSizing: "border-box",
                            }}
                          />
                          <div style={{ background: "#EDF2EE", borderRadius: 10, overflow: "hidden" }}>
                            <div
                              onClick={() => ui.toggleQ(Q.id)}
                              style={{
                                cursor: "pointer",
                                padding: "16px 20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    letterSpacing: 2,
                                    fontWeight: 700,
                                    color: "#1F4D3A",
                                  }}
                                >
                                  {Q.label}
                                </span>
                                <span style={{ flex: 1 }} />
                                <span style={{ fontSize: 10, color: "#A9BBB0" }}>
                                  {kD}/{kT} key results
                                </span>
                                <span
                                  style={{
                                    color: "#A9BBB0",
                                    fontSize: 11,
                                    transition: "transform .25s",
                                    transform: `rotate(${qOpen ? "180deg" : "0deg"})`,
                                  }}
                                >
                                  ▾
                                </span>
                              </div>
                              <div
                                style={{
                                  fontStyle: "italic",
                                  fontSize: 15,
                                  lineHeight: 1.5,
                                  color: "#1F4D3A",
                                  textWrap: "pretty",
                                }}
                              >
                                “{Q.bottleneck}”
                              </div>
                            </div>
                            {qOpen ? (
                              <div
                                style={{
                                  padding: "0 20px 18px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 12,
                                }}
                              >
                                {Q.okrs.map((O, oi) => (
                                  <div
                                    key={oi}
                                    style={{ borderTop: "1px solid #D9E2DC", paddingTop: 12 }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "baseline",
                                        marginBottom: 8,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 9,
                                          color: "#1F4D3A",
                                          fontWeight: 700,
                                          letterSpacing: 1.6,
                                          flex: "none",
                                        }}
                                      >
                                        OKR {oi + 1}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          color: "#12291E",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {O.title}
                                      </span>
                                    </div>
                                    <div
                                      style={{ display: "flex", flexDirection: "column", gap: 2 }}
                                    >
                                      {O.krs.map((text, ki) => {
                                        const id = Q.id + "-" + oi + "-" + ki;
                                        return (
                                          <CheckRow
                                            key={ki}
                                            label={text}
                                            pad={6}
                                            checked={isDone(done, id)}
                                            onToggle={() => toggleDone(id)}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              marginTop: 10,
                            }}
                          >
                            {Q.milestones.map((M) => {
                              const c = isDone(done, M.id);
                              const ed = edits[M.id] || {};
                              const due = ed.due || Q.end;
                              const overdue = !c && due < todayISO;
                              const dim = ui.filter !== "ALL" && ui.filter !== M.track;
                              let sub = "";
                              let subColor = "#1F4D3A";
                              if (c) sub = "✓ " + (done[M.id] ? fmtDate(done[M.id]) : "done");
                              else if (overdue) {
                                sub = "OVERDUE · was due " + fmtDate(due);
                                subColor = "#B0654F";
                              }
                              const editing = ui.editingId === M.id;
                              return (
                                <div key={M.id} style={{ transition: "opacity .3s", opacity: dim ? 0.25 : 1 }}>
                                  <div
                                    onClick={() => toggleDone(M.id)}
                                    className="mv-ms-row"
                                    style={{
                                      cursor: "pointer",
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      padding: "11px 14px",
                                      borderRadius: 10,
                                      background: c
                                        ? "#EDF2EE"
                                        : overdue
                                          ? "rgba(176,101,79,.05)"
                                          : "#FDFDFB",
                                      border: `1px solid ${
                                        c ? "#C4D6C9" : overdue ? "rgba(176,101,79,.45)" : "#D9E2DC"
                                      }`,
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: -35,
                                        top: "50%",
                                        marginTop: -11,
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 10,
                                        background: c ? "#1F4D3A" : "#FDFDFB",
                                        border: `1.4px solid ${
                                          c ? "#1F4D3A" : overdue ? "#B0654F" : "#C4D6C9"
                                        }`,
                                        color: c ? "#FDFDFB" : overdue ? "#B0654F" : "#A3C0AC",
                                        boxSizing: "border-box",
                                      }}
                                    >
                                      ★
                                    </span>
                                    <div
                                      style={{
                                        flex: 1,
                                        minWidth: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 13,
                                          fontWeight: 600,
                                          lineHeight: 1.35,
                                          color: c ? "#1F4D3A" : "#12291E",
                                        }}
                                      >
                                        {ed.label || M.label}
                                      </span>
                                      {sub ? (
                                        <span
                                          style={{
                                            fontSize: 10,
                                            letterSpacing: 1,
                                            fontWeight: 700,
                                            color: subColor,
                                          }}
                                        >
                                          {sub}
                                        </span>
                                      ) : null}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        ui.setEditingId(editing ? null : M.id);
                                      }}
                                      title="Edit milestone"
                                      className="mv-editbtn"
                                      style={{
                                        cursor: "pointer",
                                        flex: "none",
                                        background: "transparent",
                                        border: "none",
                                        color: "#A9BBB0",
                                        fontSize: 13,
                                        padding: "4px 6px",
                                        borderRadius: 6,
                                        lineHeight: 1,
                                      }}
                                    >
                                      ✎
                                    </button>
                                    <TrackPill track={M.track} small />
                                  </div>
                                  {editing ? (
                                    <div
                                      style={{
                                        marginTop: 6,
                                        background: "#EDF2EE",
                                        borderRadius: 10,
                                        padding: 16,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                      }}
                                    >
                                      <div
                                        style={{ display: "flex", flexDirection: "column", gap: 5 }}
                                      >
                                        <label
                                          style={{
                                            fontSize: 9,
                                            letterSpacing: 1.8,
                                            fontWeight: 700,
                                            color: "#5F7A6C",
                                          }}
                                        >
                                          MILESTONE
                                        </label>
                                        <input
                                          type="text"
                                          value={ed.label || M.label}
                                          onChange={(e) => setMsEdit(M.id, { label: e.target.value })}
                                          className="mv-input"
                                          style={{
                                            boxSizing: "border-box",
                                            width: "100%",
                                            background: "transparent",
                                            border: "none",
                                            borderBottom: "1px solid #D9E2DC",
                                            borderRadius: 0,
                                            padding: "8px 2px",
                                            color: "#12291E",
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 13.5,
                                            outline: "none",
                                          }}
                                        />
                                      </div>
                                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                                        <div
                                          style={{
                                            flex: 1,
                                            minWidth: 140,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 5,
                                          }}
                                        >
                                          <label
                                            style={{
                                              fontSize: 9,
                                              letterSpacing: 1.8,
                                              fontWeight: 700,
                                              color: "#5F7A6C",
                                            }}
                                          >
                                            DUE
                                          </label>
                                          <input
                                            type="date"
                                            value={due}
                                            onChange={(e) => setMsEdit(M.id, { due: e.target.value })}
                                            className="mv-input"
                                            style={{
                                              boxSizing: "border-box",
                                              width: "100%",
                                              background: "transparent",
                                              border: "none",
                                              borderBottom: "1px solid #D9E2DC",
                                              borderRadius: 0,
                                              padding: "7px 2px",
                                              color: "#12291E",
                                              fontFamily: "Inter, sans-serif",
                                              fontSize: 12.5,
                                              outline: "none",
                                            }}
                                          />
                                        </div>
                                        {c ? (
                                          <div
                                            style={{
                                              flex: 1,
                                              minWidth: 140,
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 5,
                                            }}
                                          >
                                            <label
                                              style={{
                                                fontSize: 9,
                                                letterSpacing: 1.8,
                                                fontWeight: 700,
                                                color: "#1F4D3A",
                                              }}
                                            >
                                              COMPLETED ON
                                            </label>
                                            <input
                                              type="date"
                                              value={done[M.id] || todayISO}
                                              onChange={(e) => setMsDoneDate(M.id, e.target.value)}
                                              className="mv-input-done"
                                              style={{
                                                boxSizing: "border-box",
                                                width: "100%",
                                                background: "transparent",
                                                border: "none",
                                                borderBottom: "1px solid #A3C0AC",
                                                borderRadius: 0,
                                                padding: "7px 2px",
                                                color: "#1F4D3A",
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: 12.5,
                                                outline: "none",
                                              }}
                                            />
                                          </div>
                                        ) : null}
                                      </div>
                                      <button
                                        onClick={() => ui.setEditingId(null)}
                                        className="mv-btn"
                                        style={{
                                          alignSelf: "flex-start",
                                          cursor: "pointer",
                                          background: "#1F4D3A",
                                          color: "#FDFDFB",
                                          border: "none",
                                          borderRadius: 999,
                                          padding: "9px 18px",
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: 10,
                                          fontWeight: 700,
                                          letterSpacing: 1.6,
                                        }}
                                      >
                                        DONE
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
