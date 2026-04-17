/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import BucketClientPage from "@/components/bucket/BucketClientPage";

export default async function BucketPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 버킷 아이템 + 대기중인 승인 요청 조인
  const { data: items } = await (supabase as any)
    .from("bucket_items")
    .select(`
      id, title, content, importance, target_date,
      approval_status, completion_status, status,
      created_by, created_at,
      approval_requests!inner(id, status)
    `)
    .eq("is_deleted", false)
    .order("importance", { ascending: false })
    .order("created_at", { ascending: false });

  // approval_requests 없는 아이템도 포함 (inner join 제거)
  const { data: allItems } = await (supabase as any)
    .from("bucket_items")
    .select("id, title, content, importance, target_date, approval_status, completion_status, status, created_by, created_at")
    .eq("is_deleted", false)
    .order("importance", { ascending: false })
    .order("created_at", { ascending: false });

  // 현재 pending 요청들
  const { data: pendingRequests } = await (supabase as any)
    .from("approval_requests")
    .select("id, entity_id")
    .eq("entity_type", "bucket_item")
    .eq("status", "pending");

  const pendingMap = new Map<string, string>();
  for (const r of pendingRequests ?? []) {
    pendingMap.set(r.entity_id, r.id);
  }

  const enriched = (allItems ?? []).map((item: any) => ({
    ...item,
    pending_request_id: pendingMap.get(item.id) ?? null,
  }));

  return <BucketClientPage items={enriched} myId={user!.id} />;
}
