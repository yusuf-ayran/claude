import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseConfig = { url: string; anonKey: string };

// A config pasted in the app's sync panel — used when the deployment has no
// server-side SUPABASE_URL / SUPABASE_ANON_KEY secrets configured.
const CFG_KEY = "mova-supabase-config";

export function loadLocalConfig(): SupabaseConfig | null {
  try {
    const c = JSON.parse(localStorage.getItem(CFG_KEY) || "null");
    return c && typeof c.url === "string" && typeof c.anonKey === "string" && c.url && c.anonKey
      ? { url: c.url, anonKey: c.anonKey }
      : null;
  } catch {
    return null;
  }
}

export function saveLocalConfig(c: SupabaseConfig | null) {
  try {
    if (c) localStorage.setItem(CFG_KEY, JSON.stringify(c));
    else localStorage.removeItem(CFG_KEY);
  } catch {
    /* ignore */
  }
}

let client: SupabaseClient | null = null;
let clientKey = "";

export function getSupabaseClient(cfg: SupabaseConfig): SupabaseClient {
  const key = cfg.url + "|" + cfg.anonKey;
  if (!client || clientKey !== key) {
    client = createClient(cfg.url, cfg.anonKey);
    clientKey = key;
  }
  return client;
}
