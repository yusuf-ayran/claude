import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeState, type SyncedState } from "./model";
import {
  getSupabaseClient,
  loadLocalConfig,
  saveLocalConfig,
  type SupabaseConfig,
} from "./supabase";

export type SyncStatus =
  | "loading" // resolving config
  | "off" // no Supabase config anywhere — local-only mode
  | "syncing"
  | "synced"
  | "error";

export type Sync = {
  status: SyncStatus;
  configSource: "build" | "local" | "none" | "loading";
  errorMsg: string;
  setManualConfig: (cfg: SupabaseConfig) => void;
  clearManualConfig: () => void;
};

// Single-user app, no login: everything lives in ONE shared row that the
// public (anon) key can read and write. Any device running the app syncs to
// it automatically — no sign-in.
const TABLE = "solo_state";
const ROW_ID = "mova-solo";

export function useSync(
  state: SyncedState,
  applyRemote: (s: SyncedState) => void,
  todayISO: string,
): Sync {
  const [config, setConfig] = useState<SupabaseConfig | null>(null);
  const [configSource, setConfigSource] = useState<Sync["configSource"]>("loading");
  const [busy, setBusy] = useState<"idle" | "syncing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // updatedAt of the newest state known to be on the server; "" = nothing yet.
  const remoteMark = useRef("");
  const stateRef = useRef(state);
  stateRef.current = state;

  // Resolve config: build-time env wins (baked in by CI), then a locally
  // pasted config from the footer panel.
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
    if (url && anonKey) {
      setConfig({ url, anonKey });
      setConfigSource("build");
      return;
    }
    const local = loadLocalConfig();
    if (local) {
      setConfig(local);
      setConfigSource("local");
    } else {
      setConfigSource("none");
    }
  }, []);

  const client: SupabaseClient | null = useMemo(
    () => (config ? getSupabaseClient(config) : null),
    [config],
  );

  const pull = useCallback(async () => {
    if (!client) return;
    try {
      const { data, error } = await client.from(TABLE).select("data").eq("id", ROW_ID).maybeSingle();
      if (error) {
        setBusy("error");
        setErrorMsg(error.message);
        return;
      }
      setErrorMsg("");
      const remote = data?.data as (SyncedState & { updatedAt?: string }) | undefined;
      if (remote && typeof remote.updatedAt === "string") {
        if (remote.updatedAt > stateRef.current.updatedAt) {
          const normalized = normalizeState(remote, todayISO);
          normalized.updatedAt = remote.updatedAt;
          remoteMark.current = remote.updatedAt;
          applyRemote(normalized);
        } else if (remote.updatedAt === stateRef.current.updatedAt) {
          remoteMark.current = remote.updatedAt;
        }
        // If local is strictly newer, the push effect writes it through.
      }
      setBusy("idle");
    } catch (e) {
      setBusy("error");
      setErrorMsg(e instanceof Error ? e.message : "Sync failed");
    }
  }, [client, applyRemote, todayISO]);

  // Initial pull, and refresh whenever the tab regains focus (covers "edited
  // on the phone, reopened on the laptop").
  useEffect(() => {
    if (!client) return;
    void pull();
    const onVisible = () => {
      if (document.visibilityState === "visible") void pull();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [client, pull]);

  // Debounced write-through: any state newer than the server's gets upserted.
  useEffect(() => {
    if (!client) return;
    if (state.updatedAt <= remoteMark.current) return;
    const t = setTimeout(async () => {
      setBusy("syncing");
      const { error } = await client
        .from(TABLE)
        .upsert({ id: ROW_ID, data: state, updated_at: new Date().toISOString() });
      if (error) {
        setBusy("error");
        setErrorMsg(error.message);
      } else {
        remoteMark.current = state.updatedAt;
        setBusy("idle");
        setErrorMsg("");
      }
    }, 700);
    return () => clearTimeout(t);
  }, [client, state]);

  const setManualConfig = useCallback((cfg: SupabaseConfig) => {
    saveLocalConfig(cfg);
    setConfig(cfg);
    setConfigSource("local");
  }, []);

  const clearManualConfig = useCallback(() => {
    saveLocalConfig(null);
    setConfig(null);
    setConfigSource("none");
  }, []);

  let status: SyncStatus;
  if (configSource === "loading") status = "loading";
  else if (!config) status = "off";
  else if (busy === "error") status = "error";
  else if (busy === "syncing") status = "syncing";
  else status = "synced";

  return { status, configSource, errorMsg, setManualConfig, clearManualConfig };
}
