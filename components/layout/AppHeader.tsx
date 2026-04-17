/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import UserCard from "@/components/ui/UserCard";
import NotificationBell from "@/components/layout/NotificationBell";
import Link from "next/link";

export default async function AppHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profiles }, { count: unread }] = await Promise.all([
    (supabase as any)
      .from("profiles")
      .select("id, username, display_name, emotions(emoji)")
      .order("username"),
    (supabase as any)
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user?.id ?? "")
      .eq("is_read", false),
  ]);

  const me      = profiles?.find((p: any) => p.id === user?.id);
  const partner = profiles?.find((p: any) => p.id !== user?.id);
  const getEmoji = (p: any) => (p?.emotions as { emoji: string } | null)?.emoji ?? null;
  const meIsLime = me?.username === "lime";

  const cfg = (isLime: boolean) => ({
    initial:   isLime ? "L" : "C",
    accentVar: isLime ? "var(--lime-400)" : "var(--sky-400)",
    bgVar:     isLime ? "var(--lime-50)"  : "var(--sky-50)",
  });

  return (
    <header
      className="sticky top-0 z-40 border-b safe-top"
      style={{
        background: "rgba(232,244,252,0.92)",
        backdropFilter: "blur(16px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-1 select-none">
          <span
            className="text-[22px] font-black"
            style={{
              background: "linear-gradient(135deg, var(--lime-500), var(--sky-500))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.06em",
            }}
          >
            LC
          </span>
        </Link>

        {/* 오른쪽: 유저 카드 + 벨 */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
            style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xs)" }}
          >
            {me && (
              <UserCard displayName={me.display_name} emotion={getEmoji(me)} isSelf {...cfg(meIsLime)} />
            )}
            {partner && me && (
              <span className="text-[12px] px-0.5" style={{ color: "var(--border)" }}>·</span>
            )}
            {partner && (
              <UserCard displayName={partner.display_name} emotion={getEmoji(partner)} {...cfg(!meIsLime)} />
            )}
          </div>
          {user && <NotificationBell userId={user.id} initialUnread={unread ?? 0} />}
        </div>
      </div>
    </header>
  );
}
