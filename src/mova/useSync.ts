import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

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
  | "signedout" // config present, waiting for sign-in
  | "syncing"
  | "synced"
  | "error";

export type Sync = {
  status: SyncStatus;
  configSource: "build" | "local" | "none" | "loading";
  email: string | null;
  linkSent: boolean;
  errorMsg: string;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setManualConfig: (cfg: SupabaseConfig) => void;
  clearManualConfig: () => void;
};

const TABLE = "app_state";

export function useSync(
  state: SyncedState,
  applyRemote: (s: SyncedState) => void,
  todayISO: string,
): Sync {
  const [config, setConfig] = useState<SupabaseConfig | null>(null);
  const [configSource, setConfigSource] = useState<Sync["configSource"]>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState<"idle" | "syncing" | "error">("idle");
  const [linkSent, setLinkSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // updatedAt of the newest state known to be on the server; "" = nothing yet.
  const remoteMark = useRef("");
  const stateRef = useRef(state);
  stateRef.current = state;

  // Resolve config: build-time env wins (baked in by CI from repo variables —
  // the anon key is public by design, RLS protects the data), then a locally
  // pasted config from the footer sync panel.
  useEffect(() => {
    let live = true;
    (() => {
      const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
      if (!live) return;
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
    })();
    return () => {
      live = false;
    };
  }, []);

  const client: SupabaseClient | null = useMemo(
    () => (config ? getSupabaseClient(config) : null),
    [config],
  );

  // Track the auth session.
  useEffect(() => {
    if (!client) return;
    let live = true;
    client.auth.getSession().then(({ data }) => {
      if (live) setSession(data.session);
    });
    const { data: sub } = client.auth.onAuthStateChange((_evt, s) => {
      if (live) setSession(s);
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  const pull = useCallback(async () => {
    if (!client || !session) return;
    try {
      const { data, error } = await client
        .from(TABLE)
        .select("data")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (error) {
        setBusy("error");
        setErrorMsg(error.message);
        return;
      }
      setErrorMsg("");
      const remoteRaw = data?.data as (SyncedState & { updatedAt?: string }) | undefined;
      if (remoteRaw && typeof remoteRaw.updatedAt === "string") {
        if (remoteRaw.updatedAt > stateRef.current.updatedAt) {
          const normalized = normalizeState(remoteRaw, todayISO);
          normalized.updatedAt = remoteRaw.updatedAt;
          remoteMark.current = remoteRaw.updatedAt;
          applyRemote(normalized);
        } else if (remoteRaw.updatedAt === stateRef.current.updatedAt) {
          remoteMark.current = remoteRaw.updatedAt;
        }
        // If local is strictly newer, the push effect below writes it through.
      }
      setBusy("idle");
    } catch (e) {
      setBusy("error");
      setErrorMsg(e instanceof Error ? e.message : "Sync failed");
    }
  }, [client, session, applyRemote, todayISO]);

  // Initial pull on sign-in, and refresh whenever the tab becomes visible
  // (covers "edited on the phone, reopened on the laptop").
  useEffect(() => {
    if (!client || !session) return;
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
  }, [client, session, pull]);

  // Debounced write-through: any state newer than what the server has gets
  // upserted. Last write wins — acceptable for a single user.
  useEffect(() => {
    if (!client || !session) return;
    if (state.updatedAt <= remoteMark.current) return;
    const t = setTimeout(async () => {
      setBusy("syncing");
      const { error } = await client.from(TABLE).upsert({
        user_id: session.user.id,
        data: state,
        updated_at: new Date().toISOString(),
      });
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
  }, [client, session, state]);

  const signIn = useCallback(
    async (email: string) => {
      if (!client) return;
      setErrorMsg("");
      // Redirect back to the app's full URL (origin alone would drop the
      // /<repo>/ path GitHub Pages serves the app under).
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href.split(/[?#]/)[0] },
      });
      if (error) setErrorMsg(error.message);
      else setLinkSent(true);
    },
    [client],
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    setLinkSent(false);
    remoteMark.current = "";
  }, [client]);

  const setManualConfig = useCallback((cfg: SupabaseConfig) => {
    saveLocalConfig(cfg);
    setConfig(cfg);
    setConfigSource("local");
  }, []);

  const clearManualConfig = useCallback(() => {
    saveLocalConfig(null);
    setConfig(null);
    setConfigSource("none");
    setSession(null);
  }, []);

  let status: SyncStatus;
  if (configSource === "loading") status = "loading";
  else if (!config) status = "off";
  else if (!session) status = "signedout";
  else if (busy === "error") status = "error";
  else if (busy === "syncing") status = "syncing";
  else status = "synced";

  return {
    status,
    configSource,
    email: session?.user.email ?? null,
    linkSent,
    errorMsg,
    signIn,
    signOut,
    setManualConfig,
    clearManualConfig,
  };
}
