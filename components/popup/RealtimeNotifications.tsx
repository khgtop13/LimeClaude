"use client";
import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Toast { id: string; title: string; body?: string | null; type?: string; }

const typeIcon: Record<string, string> = {
  approval_request: "✅", schedule: "📅", birthday: "🎂",
  travel: "✈️", brainstorm: "💡", general: "🔔",
};

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
    <div style={{ position: "fixed", top: "72px", right: "12px", zIndex: 50, display: "flex", flexDirection: "column", gap: "8px", width: "280px" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "1.25rem",
            padding: "0.75rem 0.875rem",
            boxShadow: "var(--shadow-lg)",
            cursor: "pointer",
            animation: "slideDown 0.25s cubic-bezier(0.32,0.72,0,1)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.625rem",
          }}
        >
          <div style={{
            width: "32px", height: "32px", borderRadius: "0.625rem", flexShrink: 0,
            background: "linear-gradient(135deg, var(--lime-100), var(--sky-100))",
            border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>
            {typeIcon[t.type ?? "general"] ?? "🔔"}
          </div>
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
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0, padding: "2px" }}
            aria-label="닫기"
          >✕</button>
        </div>
      ))}
    </div>
  );
}
