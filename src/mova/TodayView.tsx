import { DAILY, RHYTHM, YEARS } from "./data";
import { computeStreak, fmtDate, isDone, journeyDays, type SyncedState } from "./model";
import { CheckRow, Kicker, TrackPill } from "./bits";

export function TodayView({
  state,
  now,
  todayISO,
  countdown,
  toggleDaily,
  setJournal,
  goJourney,
  goOS,
}: {
  state: SyncedState;
  now: Date;
  todayISO: string;
  countdown: string;
  toggleDaily: (i: number) => void;
  setJournal: (field: "one" | "review", value: string) => void;
  goJourney: () => void;
  goOS: () => void;
}) {
  const dayIdx = now.getDay();
  const rh = RHYTHM[dayIdx];
  const isWed = dayIdx === 3;
  const isSunday = dayIdx === 0;
  const { dayNum, totalDays, pctThrough } = journeyDays(todayISO);

  let dailyCount = 0;
  DAILY.forEach((_, i) => {
    if (state.daily["d" + i]) dailyCount++;
  });
  const streak = computeStreak(state.dailyLog, todayISO, DAILY.length);
  const journal = state.journal[todayISO] || {};

  // Next milestone = earliest-due unchecked milestone.
  let next: { label: string; due: string; track: string; q: string } | null = null;
  for (const Y of YEARS)
    for (const Q of Y.quarters)
      for (const M of Q.milestones) {
        if (isDone(state.done, M.id)) continue;
        const due = state.edits[M.id]?.due || Q.end;
        if (!next || due < next.due)
          next = { label: state.edits[M.id]?.label || M.label, due, track: M.track, q: Q.label };
      }

  return (
    <div
      style={{
        maxWidth: 720,
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "40px 20px 0",
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.6, color: "#1F4D3A" }}>
          TODAY
        </div>
        <h1
          style={{
            margin: "10px 0 0",
            fontSize: "clamp(32px,6vw,44px)",
            lineHeight: 1.12,
            fontWeight: 700,
            color: "#12291E",
          }}
        >
          {now.toLocaleDateString("en-GB", { weekday: "long" })},
          <br />
          <span style={{ color: "#1F4D3A" }}>
            {now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </h1>
        {countdown ? (
          <div
            style={{
              display: "inline-flex",
              marginTop: 16,
              background: "#DCE7DF",
              color: "#1F4D3A",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.6,
              padding: "7px 15px",
              borderRadius: 999,
            }}
          >
            {countdown}
          </div>
        ) : null}
        <div
          onClick={goJourney}
          className="mv-daylink"
          style={{
            cursor: "pointer",
            display: "flex",
            width: "fit-content",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 1.4,
            color: "#5F7A6C",
          }}
        >
          DAY {dayNum} OF {totalDays} · {pctThrough}% OF THE JOURNEY{" "}
          <span style={{ fontSize: 12 }}>→</span>
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          padding: "22px 24px",
          background: isWed ? "#1F4D3A" : "#EDF2EE",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2.2,
            marginBottom: 8,
            color: isWed ? "#C4D6C9" : "#1F4D3A",
          }}
        >
          TODAY’S RHYTHM · {rh.day}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: isWed ? "#FDFDFB" : "#12291E" }}>
          {rh.name}
        </div>
        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.6,
            marginTop: 5,
            color: isWed ? "#C4D6C9" : "#5F7A6C",
          }}
        >
          {rh.text}
        </div>
      </div>

      {isSunday ? (
        <div
          style={{
            background: "#DCE7DF",
            borderRadius: 10,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ flex: 1, minWidth: 200, fontSize: 13.5, lineHeight: 1.55, color: "#12291E" }}>
            It’s Sunday. Rate the ten areas and name this week’s bottleneck.
          </span>
          <button
            onClick={goOS}
            className="mv-btn"
            style={{
              cursor: "pointer",
              background: "#1F4D3A",
              color: "#FDFDFB",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              fontFamily: "Inter, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.6,
            }}
          >
            OPEN SCORECARD
          </button>
        </div>
      ) : null}

      {/* Today's journal — the ONE THING and the evening review */}
      <div style={{ background: "#EDF2EE", borderRadius: 10, padding: "22px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.2, color: "#1F4D3A" }}>
            TODAY’S ONE THING
          </label>
          <input
            type="text"
            value={journal.one || ""}
            onChange={(e) => setJournal("one", e.target.value)}
            placeholder="The single most important thing to advance today…"
            className="mv-input"
            style={{
              boxSizing: "border-box",
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #C4D6C9",
              borderRadius: 0,
              padding: "9px 2px",
              color: "#12291E",
              fontFamily: "Inter, sans-serif",
              fontSize: 14.5,
              fontWeight: 600,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 18 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.2, color: "#5F7A6C" }}>
            EVENING REVIEW
          </label>
          <textarea
            value={journal.review || ""}
            onChange={(e) => setJournal("review", e.target.value)}
            placeholder="Wins, falls, lessons — what mattered today?"
            rows={3}
            className="mv-input"
            style={{
              boxSizing: "border-box",
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #C4D6C9",
              borderRadius: 0,
              padding: "9px 2px",
              color: "#12291E",
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              lineHeight: 1.5,
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ background: "#EDF2EE", borderRadius: 10, padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.2, color: "#1F4D3A" }}>
            NON-NEGOTIABLES
          </span>
          {streak > 0 ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#1F4D3A",
                background: "#DCE7DF",
                padding: "3px 9px",
                borderRadius: 999,
              }}
            >
              🔥 {streak}-DAY STREAK
            </span>
          ) : null}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1F4D3A" }}>
            {dailyCount} / {DAILY.length}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: 2,
          }}
        >
          {DAILY.map((label, i) => (
            <CheckRow
              key={i}
              label={label}
              checked={!!state.daily["d" + i]}
              onToggle={() => toggleDaily(i)}
            />
          ))}
        </div>
      </div>

      {next ? (
        <div
          style={{
            border: "1px solid #D9E2DC",
            borderRadius: 10,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <Kicker style={{ marginBottom: 7 }}>NEXT MILESTONE</Kicker>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#12291E", lineHeight: 1.4 }}>
              {next.label}
            </div>
            <div style={{ fontSize: 12, color: "#5F7A6C", marginTop: 4 }}>
              due {fmtDate(next.due)} · {next.q}
            </div>
          </div>
          <TrackPill track={next.track} />
        </div>
      ) : null}
    </div>
  );
}
