/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import TravelClientPage from "@/components/travel/TravelClientPage";

export default async function TravelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: plans }, { data: pendingRequests }] = await Promise.all([
    (supabase as any)
      .from("travel_plans")
      .select("id,title,description,start_date,end_date,completion_status,approval_status,created_by,travel_checklists(id,item,is_checked,sort_order)")
      .eq("is_deleted", false)
      .order("start_date", { ascending: false }),
    (supabase as any)
      .from("approval_requests")
      .select("id,entity_id")
      .eq("entity_type", "travel_plan")
      .eq("status", "pending"),
  ]);

  const pendingMap = new Map<string, string>();
  for (const r of pendingRequests ?? []) pendingMap.set(r.entity_id, r.id);

  const enriched = (plans ?? []).map((p: any) => ({
    ...p,
    checklists: p.travel_checklists ?? [],
    pending_request_id: pendingMap.get(p.id) ?? null,
  }));

  return (
    <div className="max-w-lg mx-auto w-full">
      <TravelClientPage plans={enriched} myId={user!.id} />
    </div>
  );
}
