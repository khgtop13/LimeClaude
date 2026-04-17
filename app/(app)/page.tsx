/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import EmotionPicker from "@/components/emotions/EmotionPicker";
import { IconCalendar, IconStar, IconMap, IconPlane, IconLightbulb, IconApproval } from "@/components/ui/Icons";

const menus = [
  { href: "/calendar",   Icon: IconCalendar,  label: "달력",      sub: "일정 · 기념일",    accent: "lime" },
  { href: "/bucket",     Icon: IconStar,      label: "버킷리스트", sub: "함께할 목표",      accent: "sky"  },
  { href: "/map",        Icon: IconMap,       label: "우리 지도",  sub: "다닌 곳 기록",     accent: "sky"  },
  { href: "/travel",     Icon: IconPlane,     label: "여행",       sub: "여행 계획",        accent: "lime" },
  { href: "/brainstorm", Icon: IconLightbulb, label: "브레인스토밍",sub: "자유로운 아이디어", accent: "lime" },
  { href: "/approvals",  Icon: IconApproval,  label: "승인함",     sub: "요청 관리",        accent: "sky"  },
] as const;

function calcDays(s: string) {
  const start = new Date(s); start.setHours(0,0,0,0);
  const today = new Date();  today.setHours(0,0,0,0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
}

function nextMilestone(d: number) {
  return [100,200,300,365,500,730,1000,1500,2000].find((m) => m > d) ?? Math.ceil(d / 1000) * 1000;
}

function formatKoreanDate(d: string) {
  const [y,m,dd] = d.split("-");
  return `${y}.${m.padStart(2,"0")}.${dd.padStart(2,"0")}`;
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
        className="w-full rounded-3xl px-6 py-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--lime-100) 0%, var(--sky-100) 100%)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* 배경 타이포 장식 */}
        <span
          className="absolute -right-2 -top-4 font-black select-none pointer-events-none"
          style={{ fontSize: "100px", lineHeight: 1, color: "var(--sky-100)", letterSpacing: "-0.06em" }}
          aria-hidden
        >D+</span>

        <p className="text-[11px] font-semibold tracking-widest uppercase relative" style={{ color: "var(--lime-600)" }}>
          Since {formatKoreanDate(startDate)}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1 relative">
          <span
            className="font-black"
            style={{ fontSize: "clamp(52px,14vw,68px)", color: "var(--text-primary)", letterSpacing: "-0.05em", lineHeight: 1 }}
          >
            {days.toLocaleString("ko-KR")}
          </span>
          <span className="text-xl font-bold" style={{ color: "var(--text-secondary)" }}>일</span>
        </div>

        {/* 다음 마일스톤 바 */}
        <div className="mt-4 relative">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
              다음 기념일 <strong style={{ color: "var(--text-primary)" }}>{next.toLocaleString()}일</strong>
            </span>
            <span className="text-[11px] font-bold" style={{ color: "var(--sky-600)" }}>
              D-{next - days}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(((days % next) / next) * 100, 100)}%`,
                background: "linear-gradient(90deg, var(--lime-400), var(--sky-400))",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 감정 카드 ── */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: "var(--surface-base)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="px-4 pt-3 pb-1 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Today&apos;s Mood</p>
        </div>
        <div className="flex">
          {/* 나 */}
          <div className="flex-1 flex flex-col items-center gap-2 px-4 py-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: meIsLime ? "var(--lime-400)" : "var(--sky-400)" }}
            >
              {meIsLime ? "L" : "C"}
            </div>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
              {me?.display_name ?? "나"}
            </p>
            <EmotionPicker emotions={emotions ?? []} current={getEmotion(me)} />
            <p className="text-[11px] font-medium min-h-[14px]" style={{ color: "var(--text-secondary)" }}>
              {getEmotion(me)?.label ?? "—"}
            </p>
          </div>

          {/* 구분선 */}
          <div className="w-px self-stretch my-4" style={{ background: "var(--border-subtle)" }} />

          {/* 상대방 */}
          <div className="flex-1 flex flex-col items-center gap-2 px-4 py-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: meIsLime ? "var(--sky-400)" : "var(--lime-400)" }}
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
              {getEmotion(partner)?.emoji ?? <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>—</span>}
            </div>
            <p className="text-[11px] font-medium min-h-[14px]" style={{ color: "var(--text-secondary)" }}>
              {getEmotion(partner)?.label ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 메뉴 그리드 ── */}
      <div className="w-full grid grid-cols-2 gap-2.5">
        {menus.map((m) => {
          const isLime = m.accent === "lime";
          const iconColor = isLime ? "var(--lime-500)" : "var(--sky-500)";
          const bg    = isLime ? "var(--surface-lime)" : "var(--surface-sky)";
          const bd    = isLime ? "var(--border-lime)"  : "var(--border-subtle)";
          return (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-95"
              style={{ background: bg, border: `1px solid ${bd}`, boxShadow: "var(--shadow-xs)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${bd}` }}
              >
                <m.Icon size={18} color={iconColor} strokeWidth={1.8} />
              </div>
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
