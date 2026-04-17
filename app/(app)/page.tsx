/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import EmotionPicker from "@/components/emotions/EmotionPicker";

const menus = [
  { href: "/calendar",      icon: "📅", label: "달력",         sub: "일정·기념일",   accent: "lime" },
  { href: "/bucket",        icon: "⭐", label: "버킷리스트",   sub: "함께할 목표",   accent: "sky"  },
  { href: "/map",           icon: "🗺️", label: "우리 지도",    sub: "다닌 곳 기록",  accent: "sky"  },
  { href: "/travel",        icon: "✈️", label: "여행 계획",    sub: "떠나볼 여행",   accent: "lime" },
  { href: "/brainstorm",    icon: "💡", label: "브레인스토밍", sub: "자유로운 아이디어", accent: "sky"  },
  { href: "/approvals",     icon: "✅", label: "승인함",       sub: "요청 관리",     accent: "lime" },
] as const;

function calcDays(startDateStr: string) {
  const start = new Date(startDateStr); start.setHours(0,0,0,0);
  const today = new Date();             today.setHours(0,0,0,0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
}

function nextMilestone(days: number) {
  const ms = [100,200,300,365,500,730,1000,1500,2000];
  return ms.find((m) => m > days) ?? Math.ceil(days / 1000) * 1000;
}

function formatKoreanDate(d: string) {
  const [y,m,dd] = d.split("-");
  return `${y}년 ${Number(m)}월 ${Number(dd)}일`;
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

  const me      = profiles?.find((p: any) => p.id === user?.id);
  const partner = profiles?.find((p: any) => p.id !== user?.id);
  const getEmotion = (p: any) => p?.emotions as { id:string; emoji:string; label:string } | null;

  const meIsLime = me?.username === "lime";

  return (
    <div className="flex flex-col items-center px-4 py-5 gap-4 max-w-sm mx-auto w-full">

      {/* ── D-Day 카드 ── */}
      <div
        className="w-full rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #c8f2b0 0%, #a8dcf8 100%)",
          boxShadow: "0 8px 32px rgba(100,168,14,0.18), 0 2px 8px rgba(31,163,224,0.12)",
        }}
      >
        {/* 배경 장식 */}
        <span
          className="absolute right-4 top-2 select-none pointer-events-none"
          style={{ fontSize: "72px", lineHeight: 1, opacity: 0.18, filter: "blur(1px)" }}
          aria-hidden
        >
          💚
        </span>
        <span
          className="absolute left-2 bottom-2 select-none pointer-events-none"
          style={{ fontSize: "48px", lineHeight: 1, opacity: 0.12, filter: "blur(1px)" }}
          aria-hidden
        >
          💙
        </span>

        <p className="text-xs font-semibold mb-1 relative" style={{ color: "var(--lime-600)" }}>
          {formatKoreanDate(startDate)} 부터
        </p>
        <div className="flex items-end gap-2 relative">
          <p
            className="font-black"
            style={{ fontSize: "clamp(54px,15vw,72px)", color: "var(--lime-600)", letterSpacing: "-0.05em", lineHeight: 1 }}
          >
            {days.toLocaleString("ko-KR")}
          </p>
          <p className="pb-2 text-lg font-bold" style={{ color: "var(--sky-600)" }}>일</p>
        </div>

        <div className="flex items-center gap-2 mt-3 relative">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.5)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(((days % (next - (nextMilestone(days - 1) === next ? 0 : nextMilestone(days-1)))) / (next - (nextMilestone(days - 1) === next ? 0 : nextMilestone(days-1)))) * 100, 100)}%`,
                background: "linear-gradient(90deg, var(--lime-500), var(--sky-500))"
              }}
            />
          </div>
          <p className="text-[11px] font-semibold" style={{ color: "var(--sky-700, var(--sky-600))" }}>
            {next}일까지 <strong style={{ color: "var(--lime-600)" }}>D-{next - days}</strong>
          </p>
        </div>
      </div>

      {/* ── 감정 카드 ── */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: "var(--surface-base)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <span className="text-sm">💬</span>
          <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>오늘의 감정</p>
        </div>
        <div className="flex items-center px-4 pb-4 gap-0">
          {/* 나 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ background: meIsLime ? "var(--lime-400)" : "var(--sky-400)", boxShadow: meIsLime ? "var(--shadow-lime)" : "var(--shadow-sky)" }}
            >
              {meIsLime ? "L" : "C"}
            </div>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {me?.display_name ?? "나"}
            </p>
            <EmotionPicker emotions={emotions ?? []} current={getEmotion(me)} />
            <p className="text-[11px] font-medium min-h-[16px]" style={{ color: "var(--text-secondary)" }}>
              {getEmotion(me)?.label ?? "기록 없음"}
            </p>
          </div>

          {/* 하트 구분 */}
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-lg">💕</span>
          </div>

          {/* 상대방 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ background: meIsLime ? "var(--sky-400)" : "var(--lime-400)", boxShadow: meIsLime ? "var(--shadow-sky)" : "var(--shadow-lime)" }}
            >
              {meIsLime ? "C" : "L"}
            </div>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {partner?.display_name ?? "상대방"}
            </p>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "var(--surface-sub)", border: "1.5px solid var(--border-subtle)" }}
            >
              {getEmotion(partner)?.emoji ?? <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>-</span>}
            </div>
            <p className="text-[11px] font-medium min-h-[16px]" style={{ color: "var(--text-secondary)" }}>
              {getEmotion(partner)?.label ?? "기록 없음"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 메뉴 그리드 ── */}
      <div className="w-full grid grid-cols-2 gap-2.5">
        {menus.map((m) => {
          const isLime = m.accent === "lime";
          return (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-95"
              style={{
                background: isLime ? "var(--surface-lime)" : "var(--surface-sky)",
                border: `1px solid ${isLime ? "var(--border-lime)" : "var(--border-subtle)"}`,
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {m.label}
                </span>
                <span className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                  {m.sub}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
