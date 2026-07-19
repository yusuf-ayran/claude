import type { CSSProperties, ReactNode } from "react";

// Shared checklist row — used by TODAY's non-negotiables, OS's daily
// non-negotiables, and the timeline's key results (same component, shared state).
export function CheckRow({
  checked,
  label,
  onToggle,
  pad = 8,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  pad?: number;
}) {
  return (
    <div
      onClick={onToggle}
      className="mv-check-row"
      style={{
        cursor: "pointer",
        display: "flex",
        gap: 11,
        alignItems: "flex-start",
        padding: pad,
        borderRadius: 8,
      }}
    >
      <span
        style={{
          flex: "none",
          width: 16,
          height: 16,
          marginTop: 1,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#1F4D3A",
          border: `1.3px solid ${checked ? "#1F4D3A" : "#7EA88C"}`,
          background: "transparent",
        }}
      >
        {checked ? "✓" : ""}
      </span>
      <span
        style={{
          fontSize: 13.5,
          lineHeight: 1.4,
          color: checked ? "#A9BBB0" : "#12291E",
          textDecoration: checked ? "line-through" : "none",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2.2,
        color: "#1F4D3A",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TrackPill({ track, small }: { track: string; small?: boolean }) {
  return (
    <span
      style={{
        flex: "none",
        fontSize: small ? 8.5 : 9,
        letterSpacing: small ? 1.4 : 1.5,
        fontWeight: 700,
        padding: small ? "3px 9px" : "4px 11px",
        borderRadius: 999,
        background: "#DCE7DF",
        color: "#1F4D3A",
      }}
    >
      {track}
    </span>
  );
}

export const pillButtonStyle: CSSProperties = {
  cursor: "pointer",
  background: "#1F4D3A",
  color: "#FDFDFB",
  border: "none",
  borderRadius: 999,
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
};
