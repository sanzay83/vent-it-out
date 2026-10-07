import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// The database uses `id` / `created_at`; the UI was built around the old
// backend's `postid` / `datetime` names. This keeps every component working
// unchanged.
export const mapPost = (p) => ({ ...p, postid: p.id, datetime: p.created_at });
export const mapMessage = (m) => ({ ...m, datetime: m.created_at });
