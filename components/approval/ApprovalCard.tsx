import ApprovalBadge from "./ApprovalBadge";
import ApprovalActions from "./ApprovalActions";
import type { ApprovalStatus } from "@/types/common";

const entityLabel: Record<string, string> = {
  schedule:    "일정",
  bucket_item: "버킷리스트",
  travel_plan: "여행계획",
  map_record:  "지도기록",
  anniversary: "기념일",
  birthday:    "생일",
};

const actionLabel: Record<string, string> = {
  create:     "추가",
  update:     "수정",
  delete:     "삭제",
  deactivate: "비활성화",
  complete:   "완료처리",
  photo_change: "사진변경",
};

interface Props {
  requestId: string;
  entityType: string;
  actionType: string;
  status: ApprovalStatus;
  title: string;          // 대상 항목 제목
  requestedByName: string;
  rejectionReason?: string | null;
  createdAt: string;
  /** 현재 로그인 유저 ID */
  myId: string;
  requestedById: string;
  onDone?: () => void;
}

export default function ApprovalCard({
  requestId, entityType, actionType, status, title,
  requestedByName, rejectionReason, createdAt,
  myId, requestedById, onDone,
}: Props) {
  const isPending = status === "pending";
  const role = myId === requestedById ? "mine" : "partner";

  const kstDate = new Date(createdAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--surface-base)",
        border: `1px solid ${isPending ? "var(--sky-200)" : "var(--border-subtle)"}`,
      }}
    >
      {/* 상단 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {entityLabel[entityType] ?? entityType} · {actionLabel[actionType] ?? actionType}
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </span>
        </div>
        <ApprovalBadge status={status} />
      </div>

      {/* 메타 */}
      <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span>{requestedByName}</span>
        <span>·</span>
        <span>{kstDate}</span>
      </div>

      {/* 반려 사유 */}
      {status === "rejected" && rejectionReason && (
        <div
          className="text-[12px] px-3 py-2 rounded-lg"
          style={{ background: "#fff5f5", color: "#c0392b", border: "1px solid #fcc" }}
        >
          {rejectionReason}
        </div>
      )}

      {/* 액션 버튼 */}
      {isPending && (
        <ApprovalActions requestId={requestId} role={role} onDone={onDone} />
      )}
    </div>
  );
}
