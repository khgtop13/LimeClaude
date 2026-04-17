"use client";
import { useTransition } from "react";
import { markRead } from "@/features/notifications/actions";
import { useRouter } from "next/navigation";

const typeLabel: Record<string, string> = {
  approval_request: "승인",
  schedule:  "일정",
  birthday:  "생일",
  travel:    "여행",
  brainstorm:"브레인스토밍",
  general:   "일반",
};

const typeColor: Record<string, string> = {
  approval_request: "var(--sky-500)",
  schedule:         "var(--lime-500)",
  birthday:         "#e06090",
  travel:           "var(--sky-400)",
  brainstorm:       "var(--lime-400)",
  general:          "var(--text-muted)",
};

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick(n: Notification) {
    if (!n.is_read) {
      startTransition(async () => {
        await markRead(n.id);
        router.refresh();
      });
    }
  }

  if (notifications.length === 0) {
    return (
      <p className="text-sm text-center py-12" style={{ color: "var(--text-muted)" }}>
        알림이 없습니다
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2" style={{ opacity: isPending ? 0.7 : 1 }}>
      {notifications.map((n) => {
        const kst = new Date(n.created_at).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
        return (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-opacity"
            style={{
              background: n.is_read ? "var(--surface-base)" : "var(--surface-sky)",
              border: `1px solid ${n.is_read ? "var(--border-subtle)" : "var(--border)"}`,
            }}
          >
            {/* 타입 인디케이터 */}
            <span
              className="mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: n.is_read ? "var(--surface-sub)" : "var(--surface-header)",
                color: typeColor[n.type] ?? "var(--text-muted)",
                border: `1px solid ${n.is_read ? "var(--border-subtle)" : "var(--border)"}`,
              }}
            >
              {typeLabel[n.type] ?? n.type}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-tight truncate"
                style={{ color: n.is_read ? "var(--text-secondary)" : "var(--text-primary)" }}
              >
                {n.title}
              </p>
              {n.body && (
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                  {n.body}
                </p>
              )}
              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{kst}</p>
            </div>

            {!n.is_read && (
              <span
                className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--sky-400)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
