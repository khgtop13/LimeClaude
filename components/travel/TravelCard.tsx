"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ApprovalBadge from "@/components/approval/ApprovalBadge";
import ApprovalActions from "@/components/approval/ApprovalActions";
import { deleteTravelPlan, completeTravelPlan, addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "@/features/travel/actions";
import TravelForm from "./TravelForm";
import type { ApprovalStatus } from "@/types/common";

interface CheckItem { id: string; item: string; is_checked: boolean; sort_order: number; }
interface Plan {
  id: string; title: string; description?: string | null;
  start_date: string; end_date: string;
  completion_status: "planned" | "completed" | "cancelled";
  approval_status: ApprovalStatus;
  created_by: string;
  pending_request_id?: string | null;
  checklists: CheckItem[];
}

const completionLabel: Record<string, { label: string; color: string; bg: string }> = {
  planned:   { label: "예정",   color: "var(--sky-600)",  bg: "var(--surface-sky)"  },
  completed: { label: "완료",   color: "var(--lime-600)", bg: "var(--lime-50)"       },
  cancelled: { label: "취소됨", color: "#c0392b",         bg: "#fff5f5"              },
};

function dateDiff(start: string, end: string) {
  const s = new Date(start), e = new Date(end);
  const d = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  return d === 1 ? "당일치기" : `${d}일`;
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr); target.setHours(0,0,0,0);
  const today  = new Date();        today.setHours(0,0,0,0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function TravelCard({ plan, myId }: { plan: Plan; myId: string }) {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [isPending, start]    = useTransition();
  const isMine = plan.created_by === myId;
  const cs = completionLabel[plan.completion_status];
  const until = daysUntil(plan.start_date);
  const sortedChecks = [...plan.checklists].sort((a, b) => a.sort_order - b.sort_order);
  const checkedCount = sortedChecks.filter((c) => c.is_checked).length;

  return (
    <>
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface-base)", border: `1px solid ${plan.approval_status === "pending" ? "var(--sky-200)" : "var(--border-subtle)"}` }}>

        {/* 헤더 버튼 */}
        <button onClick={() => setOpen(!open)} className="w-full flex items-start gap-3 px-4 py-3 text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>✈️ {plan.title}</span>
              <ApprovalBadge status={plan.approval_status} />
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: cs.bg, color: cs.color }}>{cs.label}</span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {plan.start_date} ~ {plan.end_date} · {dateDiff(plan.start_date, plan.end_date)}
              {plan.completion_status === "planned" && until >= 0 && (
                <span style={{ color: "var(--sky-500)", fontWeight: 600 }}> · D-{until === 0 ? "DAY" : until}</span>
              )}
            </p>
            {sortedChecks.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(checkedCount / sortedChecks.length) * 100}%`, background: "var(--lime-400)" }} />
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{checkedCount}/{sortedChecks.length}</span>
              </div>
            )}
          </div>
          <span className="text-xs mt-1 flex-shrink-0"
            style={{ color: "var(--text-muted)", display: "inline-block", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▾</span>
        </button>

        {/* 펼침 영역 */}
        {open && (
          <div className="px-4 pb-3 flex flex-col gap-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            {plan.description && (
              <p className="text-[12px] pt-2 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>
            )}

            {/* 체크리스트 */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>📋 체크리스트</p>
              {sortedChecks.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <button onClick={() => start(async () => { await toggleChecklistItem(c.id, !c.is_checked); router.refresh(); })}
                    disabled={isPending}
                    className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border transition-all"
                    style={{ background: c.is_checked ? "var(--lime-400)" : "var(--surface-sub)", borderColor: c.is_checked ? "var(--lime-400)" : "var(--border)" }}>
                    {c.is_checked && <span className="text-white text-[10px] font-bold">✓</span>}
                  </button>
                  <span className="flex-1 text-[12px]" style={{ color: c.is_checked ? "var(--text-muted)" : "var(--text-primary)", textDecoration: c.is_checked ? "line-through" : "none" }}>
                    {c.item}
                  </span>
                  <button onClick={() => start(async () => { await deleteChecklistItem(c.id); router.refresh(); })}
                    disabled={isPending} className="text-[10px]" style={{ color: "var(--text-muted)" }}>✕</button>
                </div>
              ))}
              {/* 항목 추가 */}
              <div className="flex gap-2 mt-0.5">
                <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
                  placeholder="항목 추가..."
                  onKeyDown={(e) => { if (e.key === "Enter" && newItem.trim()) { e.preventDefault(); start(async () => { await addChecklistItem(plan.id, newItem); setNewItem(""); router.refresh(); }); } }}
                  className="flex-1 text-[12px] px-3 py-1.5 rounded-xl outline-none"
                  style={{ background: "var(--surface-sub)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                <button disabled={isPending || !newItem.trim()}
                  onClick={() => start(async () => { await addChecklistItem(plan.id, newItem); setNewItem(""); router.refresh(); })}
                  className="text-[12px] px-3 py-1.5 rounded-xl font-semibold"
                  style={{ background: "var(--sky-400)", color: "#fff" }}>+</button>
              </div>
            </div>

            {/* 승인 액션 */}
            {plan.approval_status === "pending" && plan.pending_request_id && (
              <ApprovalActions requestId={plan.pending_request_id} role={isMine ? "mine" : "partner"} onDone={() => router.refresh()} />
            )}

            {/* 수정/완료/삭제 (approved + isMine) */}
            {plan.approval_status === "approved" && isMine && plan.completion_status === "planned" && (
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setEditing(true)} disabled={isPending}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "var(--surface-sky)", color: "var(--sky-600)", border: "1px solid var(--border)" }}>수정</button>
                <button onClick={() => { if (confirm("다녀왔어요! 완료 처리하시겠어요?")) start(async () => { await completeTravelPlan(plan.id); router.refresh(); }); }}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "var(--lime-50)", color: "var(--lime-600)", border: "1px solid var(--border-lime)" }}>다녀왔어요</button>
                <button onClick={() => { if (confirm("삭제를 상대방에게 요청하시겠어요?")) start(async () => { await deleteTravelPlan(plan.id); router.refresh(); }); }}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "#fff5f5", color: "#c0392b", border: "1px solid #fcc" }}>삭제</button>
              </div>
            )}
          </div>
        )}
      </div>
      {editing && <TravelForm plan={plan} onClose={() => setEditing(false)} />}
    </>
  );
}
