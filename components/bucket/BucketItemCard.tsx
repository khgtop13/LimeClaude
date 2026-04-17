"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ApprovalBadge from "@/components/approval/ApprovalBadge";
import ApprovalActions from "@/components/approval/ApprovalActions";
import BucketForm from "@/components/bucket/BucketForm";
import { completeBucketItem, deleteBucketItem } from "@/features/bucket/actions";
import type { ApprovalStatus } from "@/types/common";

interface Props {
  item: {
    id: string; title: string; content?: string | null;
    importance: number; target_date?: string | null;
    approval_status: ApprovalStatus; completion_status: string;
    created_by: string;
    pending_request_id?: string | null;
  };
  myId: string;
}

const importanceDots = (n: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="w-2 h-2 rounded-full inline-block"
      style={{ background: i < n ? "var(--lime-400)" : "var(--border-default)" }} />
  ));

export default function BucketItemCard({ item, myId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing]   = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const isMine = item.created_by === myId;
  const isCompleted = item.completion_status === "completed";
  const isPendingApproval = item.approval_status === "pending";

  function run(action: () => Promise<void>) {
    setError("");
    startTransition(async () => {
      try { await action(); router.refresh(); }
      catch (e: unknown) { setError(e instanceof Error ? e.message : "오류"); }
    });
  }

  const dateStr = item.target_date
    ? new Date(item.target_date).toLocaleDateString("ko-KR", { month:"short", day:"numeric" })
    : null;

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden transition-all"
        style={{
          background: isCompleted ? "var(--surface-sub)" : "var(--surface-base)",
          border: `1px solid ${isPendingApproval ? "var(--sky-200)" : "var(--border-subtle)"}`,
          opacity: isCompleted ? 0.75 : 1,
        }}
      >
        {/* 메인 행 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          {/* 중요도 */}
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            {[0,1].map((row) => (
              <div key={row} className="flex gap-0.5">
                {importanceDots(item.importance).slice(row*3, row===0?3:5)}
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: isCompleted ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isCompleted ? "line-through" : "none" }}>
              {item.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ApprovalBadge status={item.approval_status} />
              {item.completion_status === "complete_pending" && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background:"var(--sky-50)", color:"var(--sky-600)", border:"1px solid var(--sky-200)" }}>완료대기</span>
              )}
              {dateStr && <span className="text-[11px]" style={{ color:"var(--text-muted)" }}>~ {dateStr}</span>}
            </div>
          </div>

          <span className="text-xs" style={{ color:"var(--text-muted)", transform: expanded?"rotate(180deg)":"", transition:"transform 0.2s" }}>▾</span>
        </button>

        {/* 확장 영역 */}
        {expanded && (
          <div className="px-4 pb-3 flex flex-col gap-3 border-t" style={{ borderColor:"var(--border-subtle)" }}>
            {item.content && (
              <p className="text-sm pt-2" style={{ color:"var(--text-secondary)" }}>{item.content}</p>
            )}

            {error && <p className="text-[12px]" style={{ color:"#c0392b" }}>{error}</p>}

            {/* 승인 대기 중 액션 */}
            {isPendingApproval && item.pending_request_id && (
              <ApprovalActions
                requestId={item.pending_request_id}
                role={isMine ? "mine" : "partner"}
                onDone={() => router.refresh()}
              />
            )}

            {/* approved 상태 액션 */}
            {item.approval_status === "approved" && !isCompleted && (
              <div className="flex gap-2 flex-wrap">
                {isMine && (
                  <>
                    <button onClick={() => setEditing(true)} className="action-btn sky" disabled={isPending}>수정</button>
                    <button onClick={() => run(() => completeBucketItem(item.id))} className="action-btn lime" disabled={isPending}>
                      완료 요청
                    </button>
                    <button onClick={() => { if (confirm("삭제를 상대방에게 요청하시겠어요?")) run(() => deleteBucketItem(item.id)); }} className="action-btn red" disabled={isPending}>
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {editing && <BucketForm item={{ id:item.id, title:item.title, content:item.content, importance:item.importance, target_date:item.target_date }} onClose={() => setEditing(false)} />}

      <style jsx>{`
        .action-btn { padding:0.375rem 0.875rem; border-radius:0.5rem; font-size:0.8125rem; font-weight:600; cursor:pointer; transition:opacity 0.15s; border:none; }
        .action-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .action-btn.sky { background:var(--surface-sky); color:var(--sky-600); border:1px solid var(--border); }
        .action-btn.lime { background:var(--lime-100); color:var(--lime-600); border:1px solid var(--border-lime); }
        .action-btn.red { background:#fff5f5; color:#c0392b; border:1px solid #fcc; }
      `}</style>
    </>
  );
}
