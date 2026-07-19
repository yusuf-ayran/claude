import { createServerFn } from "@tanstack/react-start";

import { bindings } from "../bindings.server";

type SupabaseEnv = { SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string };

// The Supabase project URL + anon (publishable) key are deploy-time secrets.
// The anon key is safe to hand to the browser — data access is protected by
// Supabase Row Level Security, not by hiding this key.
export const getSupabaseConfig = createServerFn({ method: "POST" }).handler(async () => {
  const env = bindings() as SupabaseEnv;
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    return { url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY };
  }
  return null;
});
