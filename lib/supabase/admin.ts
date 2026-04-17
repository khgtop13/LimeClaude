import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service role — 서버 전용 (RLS 우회)
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
