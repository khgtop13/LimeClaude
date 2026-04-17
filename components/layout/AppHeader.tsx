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

  const me = profiles?.find((p: any) => p.id === user?.id);
  const partner = profiles?.find((p: any) => p.id !== user?.id);

  const getEmoji = (p: any) => (p?.emotions as { emoji: string } | null)?.emoji ?? null;
  const meIsLime = me?.username === "lime";

  const cfg = (isLime: boolean) => ({
    initial: isLime ? "L" : "C",
    accentVar: isLime ? "var(--lime-400)" : "var(--sky-400)",
    bgVar: isLime ? "var(--lime-50)" : "var(--sky-50)",
  });

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 border-b"
      style={{ background: "var(--surface-header)", borderColor: "var(--border)" }}
    >
      <Link href="/" className="font-black text-xl select-none" style={{ letterSpacing: "-0.06em" }}>
        <span style={{ color: "var(--lime-500)" }}>L</span>
        <span style={{ color: "var(--sky-500)" }}>C</span>
      </Link>

      <div className="flex items-center gap-2">
        {me && <UserCard displayName={me.display_name} emotion={getEmoji(me)} isSelf {...cfg(meIsLime)} />}
        {partner && <UserCard displayName={partner.display_name} emotion={getEmoji(partner)} {...cfg(!meIsLime)} />}
        {user && (
          <NotificationBell userId={user.id} initialUnread={unread ?? 0} />
        )}
      </div>
    </header>
  );
}
