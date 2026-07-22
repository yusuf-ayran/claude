import { useState } from "react";
import type { Sync } from "./useSync";

// Discreet cross-device sync status in the footer. No login — the app syncs
// to a single shared row automatically; this just shows state (and, if no
// database is configured, lets you paste one in).
export function SyncPanel({ sync }: { sync: Sync }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [anonKey, setAnonKey] = useState("");

  const statusLabel =
    sync.status === "loading"
      ? "SYNC · …"
      : sync.status === "off"
        ? "○ LOCAL ONLY · SET UP SYNC"
        : sync.status === "error"
          ? "● SYNC ERROR"
          : sync.status === "syncing"
            ? "● SYNCING…"
            : "● SYNCED";

  const inputStyle = {
    boxSizing: "border-box" as const,
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #D9E2DC",
    borderRadius: 0,
    padding: "8px 2px",
    color: "#12291E",
    fontFamily: "Inter, sans-serif",
    fontSize: 12.5,
    outline: "none",
  };
  const labelStyle = { fontSize: 9, letterSpacing: 1.8, fontWeight: 700, color: "#5F7A6C" };
  const buttonStyle = {
    alignSelf: "flex-start" as const,
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
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        className="mv-faintlink"
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 2.2,
          color: sync.status === "error" ? "#B0654F" : "#A9BBB0",
        }}
      >
        {statusLabel}
      </button>
      {open ? (
        <div
          style={{
            width: "min(360px, 100%)",
            boxSizing: "border-box",
            background: "#EDF2EE",
            borderRadius: 10,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            textAlign: "left",
          }}
        >
          {sync.status === "off" || sync.status === "loading" ? (
            <>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#12291E" }}>
                Paste a Supabase project URL and anon key to sync across devices (run the schema in{" "}
                <code style={{ fontSize: 11 }}>supabase/schema.sql</code> first). No login — every
                device connects to the same data automatically.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>SUPABASE URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xxxx.supabase.co"
                  className="mv-input"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>ANON KEY</label>
                <input
                  type="text"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJ…"
                  className="mv-input"
                  style={inputStyle}
                />
              </div>
              <button
                className="mv-btn"
                style={buttonStyle}
                onClick={() => {
                  if (url.trim() && anonKey.trim())
                    sync.setManualConfig({ url: url.trim(), anonKey: anonKey.trim() });
                }}
              >
                CONNECT
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#12291E" }}>
                {sync.status === "error"
                  ? "Sync hit an error — your changes are safe on this device and will retry automatically."
                  : "This device syncs automatically. Open the app on any other device and it shows the same data — no sign-in needed."}
              </div>
              {sync.errorMsg ? (
                <div style={{ fontSize: 11, color: "#B0654F" }}>{sync.errorMsg}</div>
              ) : null}
              {sync.configSource === "local" ? (
                <button
                  style={{ ...buttonStyle, background: "transparent", color: "#5F7A6C" }}
                  onClick={sync.clearManualConfig}
                >
                  DISCONNECT
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
