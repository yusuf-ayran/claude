import { CATS, DAILY } from "./data";
import { computeStreak, fmtDate, recentDaily, type SyncedState } from "./model";
import { CheckRow, Kicker } from "./bits";

const PROTOCOL: [string, string][] = [
  ["05:30", "Wake — no phone for 30 minutes"],
  ["05:35", "Hydrate 500ml"],
  ["05:45", "Breathwork 5 min — box 4·4·4·4"],
  ["05:55", "Movement activation 10 min"],
  ["06:10", "Learning 20 min"],
  ["06:30", "Day preview — write the ONE THING"],
  ["06:45", "First meal"],
];

const WEEK: { label: string; text: string; inverted?: boolean }[] = [
  { label: "MON · PLANNING", text: "3 outcomes · block deep work · review bottleneck" },
  { label: "TUE · TEAM & OPS", text: "Check-in · clear blockers · batch admin" },
  { label: "WED · DEEP WORK — SACRED", text: "No meetings · no email · airplane mode", inverted: true },
  { label: "THU · CLIENTS", text: "All sessions · max presence · document insights" },
  { label: "FRI · REVIEW", text: "Wins, falls, lessons · energy audit · prep next week" },
  { label: "SAT · CONTENT", text: "Batch filming · schedule week · repurpose" },
  { label: "SUN · RECOVERY", text: "FULL REST · scorecard · gratitude" },
];

export function OSView({
  state,
  now,
  toggleDaily,
  setScore,
  setBottleneck,
  saveWeek,
}: {
  state: SyncedState;
  now: Date;
  toggleDaily: (i: number) => void;
  setScore: (cat: string, v: number) => void;
  setBottleneck: (v: string) => void;
  saveWeek: () => void;
}) {
  let dailyCount = 0;
  DAILY.forEach((_, i) => {
    if (state.daily["d" + i]) dailyCount++;
  });

  const todayISO =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const entries = state.entries.slice(0, 10).map((e) => {
    const vals = Object.values(e.scores || {});
    const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
    return { dateLabel: fmtDate(e.date), avg, bottleneck: e.bottleneck || "—" };
  });

  // Momentum: streak, last-7-days completion, 30-day rate.
  const streak = computeStreak(state.dailyLog, todayISO, DAILY.length);
  const last7 = recentDaily(state.dailyLog, todayISO, 7);
  const last30 = recentDaily(state.dailyLog, todayISO, 30);
  const logged30 = last30.filter((d) => state.dailyLog[d.iso] !== undefined);
  const rate30 = logged30.length
    ? Math.round((logged30.reduce((s, d) => s + d.count, 0) / (logged30.length * DAILY.length)) * 100)
    : 0;

  // Scorecard trend: average score per saved week, oldest → newest.
  const trend = [...state.entries]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((e) => {
      const vals = Object.values(e.scores || {});
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
  const trendPts = trend.length >= 2 ? trend : [];
  const trendW = 240;
  const trendH = 46;
  const trendPath =
    trendPts.length >= 2
      ? trendPts
          .map((v, i) => {
            const x = (i / (trendPts.length - 1)) * trendW;
            const y = trendH - ((v - 1) / 9) * trendH;
            return (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
          })
          .join(" ")
      : "";

  const openGCal = () => {
    const d = new Date(now);
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
    const ds =
      d.getFullYear() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" +
      encodeURIComponent("MOVA — Sunday Scorecard") +
      "&dates=" +
      ds +
      "T200000/" +
      ds +
      "T203000" +
      "&ctz=Asia/Riyadh" +
      "&recur=" +
      encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY=SU") +
      "&details=" +
      encodeURIComponent(
        "Rate the 10 areas 1-10 and write this week’s bottleneck in the strategy app.",
      );
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        maxWidth: 760,
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "28px 20px 0",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Morning protocol */}
      <div style={{ background: "#EDF2EE", borderRadius: 12, padding: 24 }}>
        <Kicker style={{ marginBottom: 15 }}>MORNING PROTOCOL</Kicker>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {PROTOCOL.map(([time, text]) => (
            <div
              key={time}
              style={{
                display: "grid",
                gridTemplateColumns: "52px 1fr",
                gap: 14,
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1F4D3A" }}>{time}</span>
              <span style={{ fontSize: 13.5, color: "#12291E" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily non-negotiables */}
      <div style={{ background: "#EDF2EE", borderRadius: 12, padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <Kicker>DAILY NON-NEGOTIABLES</Kicker>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: "#1F4D3A", fontWeight: 700 }}>
            {dailyCount} / {DAILY.length}
          </span>
          <span style={{ fontSize: 10, color: "#A9BBB0" }}>resets daily</span>
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

      {/* Momentum — streak, last 7 days, 30-day rate, scorecard trend */}
      <div style={{ background: "#EDF2EE", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Kicker>MOMENTUM</Kicker>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1F4D3A" }}>
            🔥 {streak}-day streak
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700, color: "#5F7A6C", marginBottom: 8 }}>
              LAST 7 DAYS
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 44 }}>
              {last7.map((d) => {
                const h = 6 + (d.count / DAILY.length) * 38;
                const full = d.count >= DAILY.length;
                const isToday = d.iso === todayISO;
                return (
                  <div key={d.iso} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div
                      title={`${d.count}/${DAILY.length}`}
                      style={{
                        width: "100%",
                        maxWidth: 22,
                        height: h,
                        borderRadius: 4,
                        background: full ? "#1F4D3A" : d.count > 0 ? "#A3C0AC" : "#DCE7DF",
                        border: isToday ? "1.5px solid #1F4D3A" : "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5, color: isToday ? "#1F4D3A" : "#A9BBB0" }}>
                      {["S", "M", "T", "W", "T", "F", "S"][new Date(d.iso + "T12:00:00").getDay()]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "#5F7A6C", marginTop: 12 }}>
              <span style={{ fontWeight: 700, color: "#1F4D3A" }}>{rate30}%</span> of non-negotiables
              done over the last 30 days
            </div>
          </div>
          {trendPath ? (
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700, color: "#5F7A6C", marginBottom: 8 }}>
                SCORECARD TREND · AVG /10
              </div>
              <svg width="100%" viewBox={`0 0 ${trendW} ${trendH}`} preserveAspectRatio="none" style={{ display: "block", height: 46 }}>
                <path d={trendPath} fill="none" stroke="#1F4D3A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "#A9BBB0" }}>{trend.length} weeks</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1F4D3A" }}>
                  now {trend[trend.length - 1].toFixed(1)}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700, color: "#5F7A6C", marginBottom: 8 }}>
                SCORECARD TREND
              </div>
              <div style={{ fontSize: 11.5, color: "#5F7A6C", lineHeight: 1.5 }}>
                Save a couple of Sunday scorecards and your 10-area average will chart here.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7-day rhythm */}
      <div>
        <Kicker style={{ marginBottom: 12 }}>7-DAY RHYTHM</Kicker>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(215px,1fr))",
            gap: 10,
          }}
        >
          {WEEK.map((w) => (
            <div
              key={w.label}
              style={{
                background: w.inverted ? "#1F4D3A" : "#EDF2EE",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  letterSpacing: 1.8,
                  fontWeight: 700,
                  color: w.inverted ? "#C4D6C9" : "#1F4D3A",
                  marginBottom: 6,
                }}
              >
                {w.label}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: w.inverted ? "#FDFDFB" : "#5F7A6C",
                }}
              >
                {w.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sunday scorecard */}
      <div style={{ background: "#EDF2EE", borderRadius: 12, padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Kicker>SUNDAY SCORECARD</Kicker>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: "#A9BBB0" }}>saved weekly · rate 1–10</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATS.map((name) => (
            <div
              key={name}
              style={{
                display: "grid",
                gridTemplateColumns: "132px 1fr 26px",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#12291E" }}>{name}</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={state.scores[name] || 5}
                onChange={(e) => setScore(name, +e.target.value)}
                style={{ width: "100%", margin: 0, height: 18 }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1F4D3A", textAlign: "right" }}>
                {state.scores[name] || 5}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 10, letterSpacing: 1.8, color: "#5F7A6C", fontWeight: 700 }}>
            THIS WEEK’S BOTTLENECK:
          </label>
          <input
            type="text"
            value={state.bottleneck}
            onChange={(e) => setBottleneck(e.target.value)}
            placeholder="What is the single constraint holding everything back?"
            className="mv-input"
            style={{
              boxSizing: "border-box",
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #D9E2DC",
              borderRadius: 0,
              padding: "10px 2px",
              color: "#12291E",
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              outline: "none",
            }}
          />
        </div>
        <div
          style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}
        >
          <button
            onClick={saveWeek}
            className="mv-btn"
            style={{
              cursor: "pointer",
              background: "#1F4D3A",
              color: "#FDFDFB",
              border: "none",
              borderRadius: 999,
              padding: "11px 22px",
              fontFamily: "Inter, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.6,
            }}
          >
            SAVE SCORECARD · {now.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </button>
          <button
            onClick={openGCal}
            className="mv-textlink"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              color: "#1F4D3A",
              fontFamily: "Inter, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.6,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            SUNDAY REMINDER → GOOGLE CALENDAR
          </button>
        </div>
        {state.entries.length > 0 ? (
          <div style={{ marginTop: 22, borderTop: "1px solid #D9E2DC", paddingTop: 15 }}>
            <div
              style={{
                fontSize: 9.5,
                letterSpacing: 2,
                color: "#A9BBB0",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              HISTORY
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {entries.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 44px 1fr",
                    gap: 12,
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#5F7A6C" }}>{e.dateLabel}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1F4D3A" }}>{e.avg}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "#5F7A6C",
                      lineHeight: 1.45,
                    }}
                  >
                    {e.bottleneck}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
