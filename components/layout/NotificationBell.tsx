"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { IconBell } from "@/components/ui/Icons";

export default function NotificationBell({ userId, initialUnread }: { userId: string; initialUnread: number }) {
  const [unread, setUnread] = useState(initialUnread);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase
      .channel("notif-bell")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `recipient_id=eq.${userId}` },
        async () => {
          const { count } = await (supabase as any)
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("recipient_id", userId)
            .eq("is_read", false);
          setUnread(count ?? 0);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return (
    <Link href="/notifications" className="relative flex items-center justify-center w-9 h-9">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xs)" }}
      >
        <IconBell size={18} color="var(--sky-500)" strokeWidth={1.8} />
      </div>
      {unread > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: "var(--lime-400)", boxShadow: "0 1px 4px rgba(134,201,35,0.5)" }}
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
