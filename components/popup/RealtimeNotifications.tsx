"use client";
import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { IconX } from "@/components/ui/Icons";

const typeLabel: Record<string, string> = {
  approval_request: "승인", schedule: "일정", birthday: "생일",
  travel: "여행", brainstorm: "브레인", general: "알림",
};

interface Toast { id: string; title: string; body?: string | null; type?: string; }

export default function RealtimeNotifications({ userId }: { userId: string }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = (id: string) => {
    clearTimeout(timerRef.current.get(id));
    timerRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", {
        event: "INSERT", schema: "public",
        table: "notifications", filter: `recipient_id=eq.${userId}`,
      }, (payload) => {
        const n = payload.new as { id: string; title: string; body?: string; type?: string };
        const toast: Toast = { id: n.id, title: n.title, body: n.body, type: n.type };
        setToasts((prev) => [toast, ...prev].slice(0, 3));
        const timer = setTimeout(() => dismiss(n.id), 5000);
        timerRef.current.set(n.id, timer);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: "fixed", top: "68px", right: "12px", zIndex: 50, display: "flex", flexDirection: "column", gap: "8px", width: "288px" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "1.25rem",
            padding: "0.875rem 1rem",
            boxShadow: "var(--shadow-lg)",
            animation: "slideDown 0.25s cubic-bezier(0.32,0.72,0,1)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.625rem",
          }}
        >
          {/* 타입 라벨 */}
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em",
            color: "var(--sky-600)", background: "var(--sky-50)",
            border: "1px solid var(--sky-200)",
            padding: "2px 8px", borderRadius: "99px", flexShrink: 0, marginTop: "1px",
          }}>
            {typeLabel[t.type ?? "general"] ?? "알림"}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t.title}
            </p>
            {t.body && (
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.body}
              </p>
            )}
          </div>

          <button
            onClick={() => dismiss(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", flexShrink: 0, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            aria-label="닫기"
          >
            <IconX size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
