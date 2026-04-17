/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import ApprovalCard from "@/components/approval/ApprovalCard";
import type { ApprovalStatus } from "@/types/common";

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: requests } = await (supabase as any)
    .from("approval_requests")
    .select(`
      id, entity_type, entity_id, action_type, status,
      requested_by, rejection_reason, snapshot_after, created_at,
      profiles!approval_requests_requested_by_fkey(display_name)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  const pending = requests?.filter((r: any) => r.status === "pending") ?? [];
  const history = requests?.filter((r: any) => r.status !== "pending") ?? [];

  function getTitle(req: any) {
    return req.snapshot_after?.title ?? req.snapshot_after?.name ?? `#${req.entity_id.slice(0, 6)}`;
  }

  function renderCard(req: any) {
    return (
      <ApprovalCard
        key={req.id}
        requestId={req.id}
        entityType={req.entity_type}
        actionType={req.action_type}
        status={req.status as ApprovalStatus}
        title={getTitle(req)}
        requestedByName={req.profiles?.display_name ?? ""}
        rejectionReason={req.rejection_reason}
        createdAt={req.created_at}
        myId={user!.id}
        requestedById={req.requested_by}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 px-5 py-6 max-w-lg mx-auto w-full">
      <section>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--sky-500)" }}>
          대기 중 {pending.length > 0 && `(${pending.length})`}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>대기 중인 요청이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">{pending.map(renderCard)}</div>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-muted)" }}>처리 내역</h2>
          <div className="flex flex-col gap-3">{history.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}
