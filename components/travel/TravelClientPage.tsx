"use client";
import { useState } from "react";
import TravelCard from "./TravelCard";
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

type Filter = "all" | "planned" | "completed";

export default function TravelClientPage({ plans, myId }: { plans: Plan[]; myId: string }) {
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter]   = useState<Filter>("all");

  const filtered = plans.filter((p) => filter === "all" || p.completion_status === filter);
  const planned   = plans.filter((p) => p.completion_status === "planned").length;
  const completed = plans.filter((p) => p.completion_status === "completed").length;

  const tabs: { key: Filter; label: string }[] = [
    { key: "all",       label: "전체" },
    { key: "planned",   label: "예정" },
    { key: "completed", label: "완료" },
  ];

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>여행 계획</h2>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>함께 떠날 여행을 계획해요</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--sky-400), var(--lime-400))", color: "#fff", border: "none" }}>
          + 여행 추가
        </button>
      </div>

      {/* 통계 */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--sky-50)", border: "1px solid var(--border)" }}>
          <p className="text-xl font-black" style={{ color: "var(--sky-500)" }}>{planned}</p>
          <p className="text-[10px] font-medium" style={{ color: "var(--sky-600)" }}>예정된 여행</p>
        </div>
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--lime-50)", border: "1px solid var(--border-lime)" }}>
          <p className="text-xl font-black" style={{ color: "var(--lime-500)" }}>{completed}</p>
          <p className="text-[10px] font-medium" style={{ color: "var(--lime-600)" }}>다녀온 여행</p>
        </div>
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}>
          <p className="text-xl font-black" style={{ color: "var(--text-muted)" }}>{plans.length}</p>
          <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>전체</p>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={filter === t.key
              ? { background: "var(--sky-400)", color: "#fff", border: "1px solid var(--sky-400)" }
              : { background: "var(--surface-sub)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>
          {filter === "planned" ? "예정된 여행이 없어요" : filter === "completed" ? "아직 다녀온 여행이 없어요" : "여행 계획을 추가해보세요"}
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.map((p) => <TravelCard key={p.id} plan={p} myId={myId} />)}
      </div>

      {addOpen && <TravelForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}
