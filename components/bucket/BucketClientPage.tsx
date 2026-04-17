"use client";
import { useState } from "react";
import BucketItemCard from "./BucketItemCard";
import BucketForm from "./BucketForm";
import type { ApprovalStatus } from "@/types/common";

type Filter = "all" | "active" | "done";

interface BucketItem {
  id: string; title: string; content?: string | null;
  importance: number; target_date?: string | null;
  approval_status: ApprovalStatus; completion_status: string;
  created_by: string; pending_request_id?: string | null;
}

const filterLabel: Record<Filter, string> = { all:"전체", active:"진행중", done:"완료" };

export default function BucketClientPage({ items, myId }: { items: BucketItem[]; myId: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = items.filter((item) => {
    if (filter === "active") return item.completion_status !== "completed";
    if (filter === "done")   return item.completion_status === "completed";
    return true;
  });

  return (
    <div className="flex flex-col gap-4 px-4 py-5 max-w-lg mx-auto w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold" style={{ color:"var(--text-primary)" }}>버킷리스트</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="text-[12px] font-semibold px-3 py-1 rounded-full"
          style={{ background:"var(--surface-sky)", color:"var(--sky-600)", border:"1px solid var(--border)" }}
        >
          + 추가
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1.5">
        {(["all","active","done"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
            style={{
              background: filter===f ? "var(--sky-500)" : "var(--surface-base)",
              color: filter===f ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${filter===f ? "var(--sky-500)" : "var(--border)"}`,
            }}
          >
            {filterLabel[f]}
            {f==="active" && <span className="ml-1 opacity-70">{items.filter(i=>i.completion_status!=="completed").length}</span>}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm" style={{ color:"var(--text-muted)" }}>
            {filter==="done" ? "완료된 항목이 없습니다" : "버킷리스트가 비어있어요"}
          </p>
          {filter!=="done" && (
            <button
              onClick={() => setAddOpen(true)}
              className="text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background:"var(--surface-sky)", color:"var(--sky-600)", border:"1px solid var(--border)" }}
            >
              첫 번째 버킷 추가하기
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((item) => (
            <BucketItemCard key={item.id} item={item} myId={myId} />
          ))}
        </div>
      )}

      {addOpen && <BucketForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}
