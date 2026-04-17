/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import MapClientPage from "@/components/map/MapClientPage";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: records } = await (supabase as any)
    .from("map_records")
    .select("id, title, address, comment, visit_start, visit_end, weather, lat, lng, approval_status, created_by, created_at")
    .eq("is_deleted", false)
    .order("visit_start", { ascending: false });

  const { data: pendingRequests } = await (supabase as any)
    .from("approval_requests")
    .select("id, entity_id")
    .eq("entity_type", "map_record")
    .eq("status", "pending");

  const pendingMap = new Map<string, string>();
  for (const r of pendingRequests ?? []) pendingMap.set(r.entity_id, r.id);

  const enriched = (records ?? []).map((r: any) => ({
    ...r,
    pending_request_id: pendingMap.get(r.id) ?? null,
  }));

  const pinnable = enriched.filter((r: any) => r.lat && r.lng && r.approval_status === "approved");

  return <MapClientPage records={enriched} pinnable={pinnable} myId={user!.id} />;
}
