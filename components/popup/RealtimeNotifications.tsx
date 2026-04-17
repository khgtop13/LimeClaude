"use client";
import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Toast {
  id: string;
  title: string;
  body?: string | null;
}

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
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as { id: string; title: string; body?: string };
          const toast: Toast = { id: n.id, title: n.title, body: n.body };
          setToasts((prev) => [toast, ...prev].slice(0, 3));
          const timer = setTimeout(() => dismiss(n.id), 5000);
          timerRef.current.set(n.id, timer);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-3 z-50 flex flex-col gap-2 w-72">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="toast-card"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="toast-title">{t.title}</p>
              {t.body && <p className="toast-body">{t.body}</p>}
            </div>
            <button className="toast-close" aria-label="닫기">✕</button>
          </div>
        </div>
      ))}
      <style jsx>{`
        .toast-card {
          background: var(--surface-header);
          border: 1.5px solid var(--sky-300);
          border-radius: 0.875rem;
          padding: 0.75rem 0.875rem;
          box-shadow: 0 4px 16px rgba(14,142,194,0.12);
          cursor: pointer;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .toast-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toast-body {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toast-close {
          font-size: 0.7rem;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
