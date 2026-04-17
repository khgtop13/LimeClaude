"use client";
import { useTransition } from "react";
import { markRead } from "@/features/notifications/actions";
import { useRouter } from "next/navigation";

const typeIcon: Record<string, string> = {
  approval_request: "✅",
  schedule:         "📅",
  birthday:         "🎂",
  travel:           "✈️",
  brainstorm:       "💡",
  general:          "🔔",
};

const typeBg: Record<string, { bg: string; border: string; color: string }> = {
  approval_request: { bg: "var(--surface-sky)",  border: "var(--border)",      color: "var(--sky-600)"  },
  schedule:         { bg: "var(--surface-lime)",  border: "var(--border-lime)", color: "var(--lime-600)" },
  birthday:         { bg: "#fff0f6",              border: "#ffc8de",            color: "#c0507a"         },
  travel:           { bg: "var(--surface-sky)",   border: "var(--border)",      color: "var(--sky-500)"  },
  brainstorm:       { bg: "var(--surface-lime)",  border: "var(--border-lime)", color: "var(--lime-500)" },
  general:          { bg: "var(--surface-sub)",   border: "var(--border-subtle)", color: "var(--text-muted)" },
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
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-5xl">🔔</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s" }}>
      {notifications.map((n) => {
        const style = typeBg[n.type] ?? typeBg.general;
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
              background: n.is_read ? "var(--surface-base)" : style.bg,
              border: `1px solid ${n.is_read ? "var(--border-subtle)" : style.border}`,
              boxShadow: n.is_read ? "var(--shadow-xs)" : "var(--shadow-sm)",
            }}
          >
            {/* 아이콘 */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: n.is_read ? "var(--surface-sub)" : "rgba(255,255,255,0.7)",
                border: `1px solid ${n.is_read ? "var(--border-subtle)" : style.border}`,
              }}
            >
              {typeIcon[n.type] ?? "🔔"}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm leading-snug"
                style={{
                  color: n.is_read ? "var(--text-secondary)" : "var(--text-primary)",
                  fontWeight: n.is_read ? 500 : 700,
                }}
              >
                {n.title}
              </p>
              {n.body && (
                <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {n.body}
                </p>
              )}
              <p className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>{kst}</p>
            </div>

            {!n.is_read && (
              <span
                className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "var(--sky-400)", boxShadow: "0 0 0 3px rgba(31,163,224,0.2)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
