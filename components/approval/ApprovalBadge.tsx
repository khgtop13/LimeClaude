import type { ApprovalStatus } from "@/types/common";

const config: Record<ApprovalStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: "임시저장", color: "var(--text-muted)",  bg: "var(--surface-sub)", border: "var(--border-subtle)" },
  pending:   { label: "승인대기", color: "var(--sky-600)",     bg: "var(--sky-50)",      border: "var(--sky-200)"       },
  approved:  { label: "승인완료", color: "var(--lime-600)",    bg: "var(--lime-50)",     border: "var(--border-lime)"   },
  rejected:  { label: "반려됨",   color: "#c0392b",            bg: "#fff5f5",            border: "#fcc"                 },
  cancelled: { label: "취소됨",   color: "var(--text-muted)",  bg: "var(--surface-sub)", border: "var(--border-subtle)" },
};

export default function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  );
}
