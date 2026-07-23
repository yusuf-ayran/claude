import type { CSSProperties, ReactNode } from "react";

import {
  ACCENT,
  BAR_DIM,
  HAIR_HEAD,
  HAIR_MINOR,
  INK,
  MUTED,
  SECONDARY,
} from "./data";

// ——— CEO wordmark: the letters C and O flanking three stacked bars.
// Forced dir="ltr" so it never mirrors under RTL (handoff §Global chrome). ———
export function Wordmark() {
  return (
    <div
      dir="ltr"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: 3,
      }}
    >
      <span>C</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ width: 12, height: 2, background: INK }} />
        <span style={{ width: 12, height: 2, background: INK }} />
        <span style={{ width: 12, height: 2, background: INK }} />
      </span>
      <span>O</span>
    </div>
  );
}

// Section header — 11px uppercase label, bottom hairline, optional "View all".
export function SectionHeader({
  title,
  viewAll,
  onViewAll,
}: {
  title: string;
  viewAll?: string;
  onViewAll?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${HAIR_HEAD}`,
        paddingBottom: 14,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: INK,
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      {viewAll && onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="ceo-link"
          style={{
            fontFamily: "inherit",
            fontSize: 11,
            letterSpacing: 1,
            color: ACCENT,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontWeight: 600,
          }}
        >
          {viewAll}
        </button>
      )}
    </div>
  );
}

// Vertical trend bars — presence index (2px) and channel blocks (3px).
export function TrendBars({
  values,
  width,
  gap,
  maxHeight,
}: {
  values: number[];
  width: number;
  gap: number;
  maxHeight: number;
}) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height: maxHeight }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            width,
            background: i === values.length - 1 ? ACCENT : BAR_DIM,
            height: Math.max(4, Math.round((v / max) * maxHeight)),
          }}
        />
      ))}
    </div>
  );
}

// A stat: large light value (nowrap for Arabic) over a small uppercase label.
export function Stat({
  value,
  label,
  size = 26,
}: {
  value: string;
  label: string;
  size?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 300,
          letterSpacing: "-0.5px",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: MUTED,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Screen title + subtitle used by every sub-screen.
export function ScreenIntro({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: "-0.4px" }}>{title}</h1>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: SECONDARY,
          lineHeight: 1.7,
          maxWidth: "56ch",
          textWrap: "pretty" as CSSProperties["textWrap"],
        }}
      >
        {sub}
      </p>
    </div>
  );
}

// A date/title/status list row (pipeline, calendar, press, top content).
export function ListRow({
  date,
  dateWidth,
  title,
  sub,
  right,
  rightColor,
  titleSize = 14,
}: {
  date?: string;
  dateWidth?: number;
  title: string;
  sub?: string;
  right?: string;
  rightColor?: string;
  titleSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 20,
        padding: "18px 0",
        borderBottom: `1px solid ${HAIR_MINOR}`,
      }}
    >
      {date !== undefined && (
        <div
          style={{
            width: dateWidth ?? 84,
            flexShrink: 0,
            fontSize: 11,
            letterSpacing: 1,
            color: MUTED,
            fontWeight: 500,
          }}
        >
          {date}
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 160 }}>
        <div style={{ fontSize: titleSize, fontWeight: 500, lineHeight: 1.4 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: MUTED }}>{sub}</div>}
      </div>
      {right && (
        <div
          style={{
            fontSize: rightColor === ACCENT ? 13 : 10.5,
            letterSpacing: rightColor === ACCENT ? 0 : 1.5,
            textTransform: rightColor === ACCENT ? "none" : "uppercase",
            fontWeight: 600,
            color: rightColor ?? MUTED,
            whiteSpace: "nowrap",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>;
}
