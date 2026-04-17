"use client";
import { useTransition } from "react";
import { markRead } from "@/features/notifications/actions";
import { useRouter } from "next/navigation";

const typeLabel: Record<string, string> = {
  approval_request: "승인",
  schedule:         "일정",
  birthday:         "생일",
  travel:           "여행",
  brainstorm:       "브레인",
  general:          "일반",
};

const typeColor: Record<string, { color: string; bg: string; border: string }> = {
  approval_request: { color: "var(--sky-600)",  bg: "var(--sky-50)",      border: "var(--sky-200)"       },
  schedule:         { color: "var(--lime-600)", bg: "var(--lime-50)",     border: "var(--border-lime)"   },
  birthday:         { color: "#b04575",         bg: "#fff0f6",            border: "#ffc8de"              },
  travel:           { color: "var(--sky-500)",  bg: "var(--surface-sky)", border: "var(--border)"        },
  brainstorm:       { color: "var(--lime-500)", bg: "var(--surface-lime)",border: "var(--border-lime)"   },
  general:          { color: "var(--text-muted)", bg: "var(--surface-sub)", border: "var(--border-subtle)" },
};

interface Notification {
  id: string; type: string; title: string;
  body?: string | null; is_read: boolean; created_at: string;
}

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick(n: Notification) {
    if (!n.is_read) {
      startTransition(async () => { await markRead(n.id); router.refresh(); });
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <p className="text-3xl font-black" style={{ color: "var(--border)", letterSpacing: "-0.04em" }}>No</p>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s" }}>
      {notifications.map((n) => {
        const s = typeColor[n.type] ?? typeColor.general;
        const kst = new Date(n.created_at).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
        return (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className="flex items-start gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
            style={{
              background: n.is_read ? "var(--surface-base)" : s.bg,
              border: `1px solid ${n.is_read ? "var(--border-subtle)" : s.border}`,
              boxShadow: n.is_read ? "var(--shadow-xs)" : "var(--shadow-sm)",
            }}
          >
            {/* 타입 뱃지 */}
            <span
              className="mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 tracking-wide"
              style={{ color: s.color, background: "rgba(255,255,255,0.7)", border: `1px solid ${s.border}` }}
            >
              {typeLabel[n.type] ?? n.type}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm leading-snug"
                style={{ color: n.is_read ? "var(--text-secondary)" : "var(--text-primary)", fontWeight: n.is_read ? 500 : 700 }}
              >
                {n.title}
              </p>
              {n.body && (
                <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{n.body}</p>
              )}
              <p className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>{kst}</p>
            </div>

            {!n.is_read && (
              <span
                className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--sky-400)", boxShadow: "0 0 0 3px rgba(31,163,224,0.2)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
