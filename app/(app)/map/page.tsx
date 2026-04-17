/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import KoreaMapClient from "@/components/map/KoreaMapClient";
import MapClientPage from "@/components/map/MapClientPage";
import type { RegionColor } from "@/components/map/KoreaMap";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: regionSetting }, { data: records }, { data: pendingRequests }] = await Promise.all([
    (supabase as any).from("settings").select("value").eq("key","region_colors").single(),
    (supabase as any)
      .from("map_records")
      .select("id,title,address,comment,visit_start,visit_end,weather,lat,lng,approval_status,created_by,created_at")
      .eq("is_deleted", false)
      .order("visit_start", { ascending: false }),
    (supabase as any)
      .from("approval_requests")
      .select("id,entity_id")
      .eq("entity_type","map_record")
      .eq("status","pending"),
  ]);

  const regionColors: Record<string, RegionColor> = (regionSetting?.value as any) ?? {};

  const pendingMap = new Map<string, string>();
  for (const r of pendingRequests ?? []) pendingMap.set(r.entity_id, r.id);

  const enriched = (records ?? []).map((r: any) => ({
    ...r,
    pending_request_id: pendingMap.get(r.id) ?? null,
  }));

  return (
    <div className="flex flex-col gap-0 max-w-lg mx-auto w-full">
      {/* 한국 지도 섹션 */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>우리가 다닌 대한민국</h2>
        </div>
        <KoreaMapClient initialColors={regionColors} />
      </div>

      {/* 구분선 */}
      <div className="h-2" style={{ background:"var(--surface-sub)" }} />

      {/* 장소 기록 섹션 */}
      <MapClientPage records={enriched} myId={user!.id} />
    </div>
  );
}
