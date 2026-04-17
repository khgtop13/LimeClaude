/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import UserCard from "@/components/ui/UserCard";
import Link from "next/link";

export default async function AppHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 두 유저 프로필 + 감정 이모지 조회
  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, username, display_name, current_emotion_id, emotions(emoji)")
    .order("username");  // cloud, lime 순

  const me = profiles?.find((p: any) => p.id === user?.id);
  const partner = profiles?.find((p: any) => p.id !== user?.id);

  function getEmoji(profile: typeof me) {
    if (!profile?.emotions) return null;
    const e = profile.emotions as { emoji: string } | null;
    return e?.emoji ?? null;
  }

  const userConfig = (p: typeof me, isLime: boolean) => ({
    initial: isLime ? "L" : "C",
    accentVar: isLime ? "var(--lime-400)" : "var(--sky-400)",
    bgVar: isLime ? "var(--lime-50)" : "var(--sky-50)",
  });

  const meIsLime = me?.username === "lime";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 border-b"
      style={{ background: "var(--surface-base)", borderColor: "var(--border-subtle)" }}
    >
      {/* L=lime, C=sky 로고 */}
      <Link href="/" className="font-black text-xl select-none" style={{ letterSpacing: "-0.06em" }}>
        <span style={{ color: "var(--lime-500)" }}>L</span>
        <span style={{ color: "var(--sky-500)" }}>C</span>
      </Link>

      <div className="flex gap-1.5">
        {me && (
          <UserCard
            displayName={me.display_name}
            emotion={getEmoji(me)}
            isSelf
            {...userConfig(me, meIsLime)}
          />
        )}
        {partner && (
          <UserCard
            displayName={partner.display_name}
            emotion={getEmoji(partner)}
            {...userConfig(partner, !meIsLime)}
          />
        )}
      </div>
    </header>
  );
}
