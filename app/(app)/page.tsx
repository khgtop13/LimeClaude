/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import EmotionPicker from "@/components/emotions/EmotionPicker";

const menus = [
  { href: "/calendar",      abbr: "CAL", label: "달력",         accent: "lime" },
  { href: "/bucket",        abbr: "BKT", label: "버킷리스트",   accent: "sky"  },
  { href: "/map",           abbr: "MAP", label: "지도",         accent: "lime" },
  { href: "/travel",        abbr: "TRV", label: "여행",         accent: "sky"  },
  { href: "/brainstorm",    abbr: "BST", label: "브레인스토밍", accent: "lime" },
  { href: "/notifications", abbr: "ALM", label: "알림함",       accent: "sky"  },
] as const;

const accentColor = {
  lime: { abbr: "var(--lime-400)", bg: "var(--surface-lime)", border: "var(--border-lime)" },
  sky:  { abbr: "var(--sky-400)",  bg: "var(--surface-sky)",  border: "var(--border)"      },
};

function calcDays(startDateStr: string) {
  const start = new Date(startDateStr); start.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
}

function nextMilestone(days: number) {
  const ms = [100,200,300,365,500,730,1000];
  return ms.find((m) => m > days) ?? Math.ceil(days / 1000) * 1000;
}

function formatKoreanDate(d: string) {
  const [y,m,dd] = d.split("-"); return `${y} · ${m} · ${dd}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: setting }, { data: profiles }, { data: emotions }] = await Promise.all([
    (supabase as any).from("settings").select("value").eq("key","couple_start_date").single(),
    (supabase as any).from("profiles").select("id,username,display_name,current_emotion_id,emotions(id,emoji,label)").order("username"),
    (supabase as any).from("emotions").select("id,emoji,label,score").eq("is_active",true).order("sort_order"),
  ]);

  const startDate: string = (setting?.value as any)?.date ?? "2025-09-22";
  const days = calcDays(startDate);
  const next = nextMilestone(days);

  const me = profiles?.find((p: any) => p.id === user?.id);
  const partner = profiles?.find((p: any) => p.id !== user?.id);

  const getEmotion = (p: any) => p?.emotions as { id:string; emoji:string; label:string } | null;

  return (
    <div className="flex flex-col items-center px-4 py-5 gap-4 max-w-sm mx-auto w-full">

      {/* D-Day 카드 */}
      <div
        className="w-full rounded-3xl p-6 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,var(--sky-100) 0%,var(--lime-100) 100%)", border:"1px solid var(--border)" }}
      >
        <span
          className="absolute -right-3 -top-3 font-black select-none pointer-events-none"
          style={{ fontSize:"96px", lineHeight:1, color:"var(--sky-100)", letterSpacing:"-0.05em" }}
          aria-hidden
        >D+</span>
        <p className="text-xs font-medium mb-2 relative" style={{ color:"var(--text-secondary)" }}>
          {formatKoreanDate(startDate)}
        </p>
        <p className="font-black relative" style={{ fontSize:"clamp(52px,14vw,68px)", color:"var(--lime-500)", letterSpacing:"-0.04em", lineHeight:1 }}>
          {days.toLocaleString("ko-KR")}
        </p>
        <p className="text-xs mt-2.5 relative" style={{ color:"var(--text-secondary)" }}>
          다음 기념일&nbsp;·&nbsp;
          <strong style={{ color:"var(--text-primary)" }}>{next}일</strong>까지&nbsp;
          <strong style={{ color:"var(--sky-500)" }}>{next-days}일</strong>
        </p>
      </div>

      {/* 감정 카드 */}
      <div
        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between"
        style={{ background:"var(--surface-base)", border:"1px solid var(--border-subtle)" }}
      >
        {/* 나 */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <p className="text-[10px] font-semibold" style={{ color:"var(--text-muted)" }}>
            {me?.display_name ?? "나"}
          </p>
          <EmotionPicker emotions={emotions ?? []} current={getEmotion(me)} />
          {getEmotion(me) && (
            <p className="text-[11px]" style={{ color:"var(--text-secondary)" }}>{getEmotion(me)!.label}</p>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-px h-12 mx-2" style={{ background:"var(--border-subtle)" }} />

        {/* 상대방 */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <p className="text-[10px] font-semibold" style={{ color:"var(--text-muted)" }}>
            {partner?.display_name ?? "상대방"}
          </p>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
            style={{ background:"var(--surface-sky)", border:"1.5px solid var(--border)" }}
          >
            {getEmotion(partner)?.emoji ?? <span style={{ color:"var(--text-muted)", fontSize:"0.875rem" }}>-</span>}
          </div>
          {getEmotion(partner) && (
            <p className="text-[11px]" style={{ color:"var(--text-secondary)" }}>{getEmotion(partner)!.label}</p>
          )}
        </div>
      </div>

      {/* 메뉴 그리드 */}
      <div className="w-full grid grid-cols-3 gap-3">
        {menus.map((m) => {
          const c = accentColor[m.accent];
          return (
            <Link
              key={m.href}
              href={m.href}
              className="flex flex-col items-start justify-between p-4 rounded-2xl aspect-square transition-all hover:scale-[1.02] active:scale-95"
              style={{ background:c.bg, border:`1px solid ${c.border}` }}
            >
              <span className="text-xl font-black" style={{ color:c.abbr, letterSpacing:"-0.03em" }}>{m.abbr}</span>
              <span className="text-xs font-medium" style={{ color:"var(--text-secondary)" }}>{m.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
