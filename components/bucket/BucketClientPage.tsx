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

export default function BucketClientPage({ items, myId }: { items: BucketItem[]; myId: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [addOpen, setAddOpen] = useState(false);

  const active    = items.filter((i) => i.completion_status !== "completed");
  const completed = items.filter((i) => i.completion_status === "completed");

  const filtered = filter === "active" ? active : filter === "done" ? completed : items;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all",    label: "전체",   count: items.length },
    { key: "active", label: "진행중", count: active.length },
    { key: "done",   label: "완료",   count: completed.length },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-5 max-w-lg mx-auto w-full">

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>버킷리스트</h1>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>함께 이루고 싶은 것들</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="text-[13px] font-semibold px-4 py-2 rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--sky-400), var(--lime-400))",
            color: "#fff",
            boxShadow: "var(--shadow-sky)",
          }}
        >
          + 추가
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl px-3 py-3 text-center" style={{ background: "var(--surface-sky)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xs)" }}>
          <p className="text-2xl font-black" style={{ color: "var(--sky-500)" }}>{items.length}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--sky-600)" }}>전체</p>
        </div>
        <div className="rounded-2xl px-3 py-3 text-center" style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xs)" }}>
          <p className="text-2xl font-black" style={{ color: "var(--text-secondary)" }}>{active.length}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>진행중</p>
        </div>
        <div className="rounded-2xl px-3 py-3 text-center" style={{ background: "var(--surface-lime)", border: "1px solid var(--border-lime)", boxShadow: "var(--shadow-xs)" }}>
          <p className="text-2xl font-black" style={{ color: "var(--lime-500)" }}>{completed.length}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--lime-600)" }}>완료 ✓</p>
        </div>
      </div>

      {/* 진행률 바 */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>달성률</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--lime-600)" }}>
              {Math.round((completed.length / items.length) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completed.length / items.length) * 100}%`,
                background: "linear-gradient(90deg, var(--lime-400), var(--sky-400))",
              }}
            />
          </div>
        </div>
      )}

      {/* 필터 탭 */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: filter === t.key ? "var(--sky-500)" : "var(--surface-base)",
              color:      filter === t.key ? "#fff" : "var(--text-secondary)",
              border:     `1px solid ${filter === t.key ? "var(--sky-500)" : "var(--border-subtle)"}`,
              boxShadow:  filter === t.key ? "var(--shadow-sky)" : "var(--shadow-xs)",
            }}
          >
            {t.label}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: filter === t.key ? "rgba(255,255,255,0.25)" : "var(--surface-sub)",
                color:      filter === t.key ? "#fff" : "var(--text-muted)",
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {filter === "done" ? "완료된 버킷이 없어요" : "버킷리스트가 비어있어요"}
          </p>
          {filter !== "done" && (
            <button
              onClick={() => setAddOpen(true)}
              className="text-sm font-semibold px-5 py-2.5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--lime-100), var(--sky-100))",
                color: "var(--sky-600)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              첫 번째 버킷 추가하기 ✨
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((item) => <BucketItemCard key={item.id} item={item} myId={myId} />)}
        </div>
      )}

      {addOpen && <BucketForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}
