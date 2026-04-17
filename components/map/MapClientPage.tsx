"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MapRecordForm from "./MapRecordForm";
import ApprovalBadge from "@/components/approval/ApprovalBadge";
import ApprovalActions from "@/components/approval/ApprovalActions";
import { deleteMapRecord } from "@/features/map/actions";
import type { ApprovalStatus } from "@/types/common";

interface MapRecord {
  id: string; title: string; address?: string | null; comment?: string | null;
  visit_start: string; visit_end?: string | null; weather?: string | null;
  lat?: number | null; lng?: number | null;
  approval_status: ApprovalStatus; created_by: string;
  pending_request_id?: string | null;
}

const weatherEmoji: { [k: string]: string } = {
  sunny:"☀️", cloudy:"☁️", rainy:"🌧️", snowy:"❄️", mixed:"⛅",
};

export default function MapClientPage({ records, myId }: { records: MapRecord[]; myId: string }) {
  const [addOpen, setAddOpen]   = useState(false);
  const [editing, setEditing]   = useState<MapRecord | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function runDelete(id: string) {
    if (!confirm("삭제를 상대방에게 요청하시겠어요?")) return;
    startTransition(async () => { await deleteMapRecord(id); router.refresh(); });
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>장소 기록</h2>
        <button onClick={() => setAddOpen(true)}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background:"var(--surface-sky)", color:"var(--sky-600)", border:"1px solid var(--border)" }}>
          + 장소 추가
        </button>
      </div>

      {records.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color:"var(--text-muted)" }}>아직 기록된 장소가 없어요</p>
      )}

      <div className="flex flex-col gap-2">
        {records.map((r) => {
          const isExpanded = expandedId === r.id;
          const isMine = r.created_by === myId;
          return (
            <div key={r.id} className="rounded-2xl overflow-hidden"
              style={{ background:"var(--surface-base)", border:`1px solid ${r.approval_status==="pending"?"var(--sky-200)":"var(--border-subtle)"}` }}>
              <button onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                      {weatherEmoji[r.weather ?? ""] ?? ""} {r.title}
                    </span>
                    <ApprovalBadge status={r.approval_status} />
                  </div>
                  {r.address && <p className="text-[11px] mt-0.5 truncate" style={{ color:"var(--text-muted)" }}>{r.address}</p>}
                  <p className="text-[11px] mt-0.5" style={{ color:"var(--text-muted)" }}>
                    {r.visit_start}{r.visit_end && r.visit_end!==r.visit_start ? ` ~ ${r.visit_end}` : ""}
                  </p>
                </div>
                <span className="text-xs mt-1 flex-shrink-0" style={{ color:"var(--text-muted)", display:"inline-block", transform:isExpanded?"rotate(180deg)":"", transition:"transform 0.2s" }}>▾</span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 flex flex-col gap-2.5 border-t" style={{ borderColor:"var(--border-subtle)" }}>
                  {r.comment && <p className="text-sm pt-2" style={{ color:"var(--text-secondary)" }}>{r.comment}</p>}
                  {r.lat && r.lng && <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>📍 {r.lat.toFixed(4)}, {r.lng.toFixed(4)}</p>}

                  {r.approval_status === "pending" && r.pending_request_id && (
                    <ApprovalActions requestId={r.pending_request_id} role={isMine?"mine":"partner"} onDone={() => router.refresh()} />
                  )}
                  {r.approval_status === "approved" && isMine && (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(r)} disabled={isPending}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                        style={{ background:"var(--surface-sky)", color:"var(--sky-600)", border:"1px solid var(--border)" }}>수정</button>
                      <button onClick={() => runDelete(r.id)} disabled={isPending}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                        style={{ background:"#fff5f5", color:"#c0392b", border:"1px solid #fcc" }}>삭제</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addOpen && <MapRecordForm onClose={() => setAddOpen(false)} />}
      {editing && <MapRecordForm record={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
