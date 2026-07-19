import { Kicker } from "./bits";

type PyramidRow = {
  width: string;
  bg: string;
  border?: string;
  title: string;
  titleColor: string;
  pill?: string;
  pillColor?: string;
  pillBorder?: string;
  desc: string;
  descColor: string;
  descOpacity?: number;
};

const PYRAMID: PyramidRow[] = [
  {
    width: "max(44%,250px)",
    bg: "#1F4D3A",
    title: "MISSION",
    titleColor: "#FDFDFB",
    pill: "PERMANENT",
    pillColor: "#C4D6C9",
    pillBorder: "rgba(196,214,201,.5)",
    desc: "Help people transform through movement, performance, leadership",
    descColor: "#C4D6C9",
  },
  {
    width: "max(53%,265px)",
    bg: "#7EA88C",
    title: "IDENTITY",
    titleColor: "#12291E",
    pill: "STABLE",
    pillColor: "#12291E",
    pillBorder: "rgba(18,41,30,.35)",
    desc: "One identity, many vehicles",
    descColor: "#12291E",
    descOpacity: 0.75,
  },
  {
    width: "max(62%,280px)",
    bg: "#A3C0AC",
    title: "FOOTBALL",
    titleColor: "#12291E",
    pill: "URGENT",
    pillColor: "#12291E",
    pillBorder: "rgba(18,41,30,.35)",
    desc: "Greatest current leverage, shortest window",
    descColor: "#12291E",
    descOpacity: 0.75,
  },
  {
    width: "max(71%,295px)",
    bg: "#C4D6C9",
    title: "TRUST",
    titleColor: "#12291E",
    desc: "Compounding — protect always",
    descColor: "#12291E",
    descOpacity: 0.7,
  },
  {
    width: "max(80%,310px)",
    bg: "#DCE7DF",
    title: "MOVA SYSTEM",
    titleColor: "#12291E",
    pill: "SCALABLE",
    pillColor: "#1F4D3A",
    pillBorder: "rgba(31,77,58,.35)",
    desc: "The IP that outlasts football",
    descColor: "#5F7A6C",
  },
  {
    width: "max(90%,325px)",
    bg: "#EDF2EE",
    title: "PRODUCTS",
    titleColor: "#12291E",
    pill: "EARNED",
    pillColor: "#1F4D3A",
    pillBorder: "rgba(31,77,58,.35)",
    desc: "Serve the system",
    descColor: "#5F7A6C",
  },
  {
    width: "100%",
    bg: "#FDFDFB",
    border: "1px solid #D9E2DC",
    title: "COMPANIES",
    titleColor: "#12291E",
    pill: "EVENTUAL",
    pillColor: "#1F4D3A",
    pillBorder: "rgba(31,77,58,.35)",
    desc: "Outlast you",
    descColor: "#5F7A6C",
  },
];

const FILTER_QUESTIONS = [
  "Does it strengthen football?",
  "Does it strengthen trust?",
  "Does it strengthen MOVA?",
  "Does it become an asset?",
];

const LEVERAGE: [string, number, string, number?][] = [
  ["2026", 20, "#C4D6C9"],
  ["2027", 35, "#A3C0AC"],
  ["2028", 50, "#7EA88C"],
  ["2029", 65, "#1F4D3A", 0.75],
  ["2030", 80, "#1F4D3A"],
];

export function CompassView() {
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
        gap: 28,
      }}
    >
      {/* Hierarchy pyramid */}
      <div>
        <Kicker style={{ marginBottom: 14 }}>THE HIERARCHY</Kicker>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
          {PYRAMID.map((r) => (
            <div
              key={r.title}
              style={{
                width: r.width,
                boxSizing: "border-box",
                background: r.bg,
                border: r.border,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, color: r.titleColor }}
              >
                {r.title}
                {r.pill ? (
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: 1.2,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 999,
                      color: r.pillColor,
                      border: `1px solid ${r.pillBorder}`,
                      marginLeft: 5,
                      verticalAlign: 2,
                    }}
                  >
                    {r.pill}
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: r.descColor,
                  marginTop: 4,
                  lineHeight: 1.45,
                  opacity: r.descOpacity,
                }}
              >
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem filter */}
      <div>
        <Kicker style={{ marginBottom: 12 }}>THE ECOSYSTEM FILTER</Kicker>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 10,
          }}
        >
          {FILTER_QUESTIONS.map((q, i) => (
            <div
              key={i}
              style={{
                background: "#EDF2EE",
                borderRadius: 10,
                padding: 17,
                display: "flex",
                gap: 13,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#C4D6C9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1F4D3A",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13.5, color: "#12291E", lineHeight: 1.45 }}>{q}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: "#1F4D3A", borderRadius: 8, padding: "20px 24px" }}>
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: 2.2,
              fontWeight: 700,
              color: "#C4D6C9",
              marginBottom: 8,
            }}
          >
            THE RULE
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45, color: "#C4D6C9" }}>
            Majority NO = decline.
            <br />
            <span style={{ color: "#FDFDFB" }}>
              No exceptions for excitement, urgency, or money on the table.
            </span>
          </div>
        </div>
      </div>

      {/* Leverage ratio targets */}
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
          <Kicker>LEVERAGE RATIO TARGETS</Kicker>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: "#A9BBB0" }}>hours on assets vs tasks</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LEVERAGE.map(([year, pct, color, opacity]) => (
            <div
              key={year}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 48px",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: "#5F7A6C", fontWeight: 600 }}>{year}</span>
              <div style={{ height: 7, background: "#DCE7DF", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: pct + "%",
                    background: color,
                    borderRadius: 4,
                    opacity,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#5F7A6C", textAlign: "right" }}>
                {pct}
                {year === "2030" ? "%+" : "%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
