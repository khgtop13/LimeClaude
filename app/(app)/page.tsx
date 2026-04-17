/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const menus = [
  { href: "/calendar",      abbr: "CAL", label: "달력" },
  { href: "/bucket",        abbr: "BKT", label: "버킷리스트" },
  { href: "/map",           abbr: "MAP", label: "지도" },
  { href: "/brainstorm",    abbr: "BST", label: "브레인스토밍" },
  { href: "/notifications", abbr: "ALM", label: "알림함" },
];

function calcDays(startDateStr: string): number {
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
}

function nextMilestone(days: number): number {
  const milestones = [100, 200, 300, 365, 500, 730, 1000];
  return milestones.find((m) => m > days) ?? Math.ceil(days / 1000) * 1000;
}

function formatKoreanDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${y} · ${m} · ${d}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: setting } = await (supabase as any)
    .from("settings")
    .select("value")
    .eq("key", "couple_start_date")
    .single();

  const startDate: string = (setting?.value as { date: string })?.date ?? "2025-09-22";
  const days = calcDays(startDate);
  const next = nextMilestone(days);
  const daysToNext = next - days;

  return (
    <div className="flex flex-col items-center px-5 py-6 gap-5 max-w-sm mx-auto w-full">

      {/* D-Day 카드 */}
      <div
        className="w-full rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--lime-100) 0%, var(--sky-100) 100%)",
          border: "1px solid var(--lime-200)",
        }}
      >
        <span
          className="absolute -right-3 -top-3 font-black select-none pointer-events-none"
          style={{
            fontSize: "96px",
            lineHeight: 1,
            color: "var(--lime-200)",
            letterSpacing: "-0.05em",
          }}
          aria-hidden
        >
          D+
        </span>

        <p className="text-xs font-medium mb-3 relative" style={{ color: "var(--text-secondary)" }}>
          {formatKoreanDate(startDate)}
        </p>
        <p
          className="font-black relative"
          style={{
            fontSize: "clamp(52px,14vw,72px)",
            color: "var(--lime-500)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {days.toLocaleString("ko-KR")}
        </p>
        <p className="text-xs mt-3 relative" style={{ color: "var(--text-secondary)" }}>
          다음 기념일 &nbsp;·&nbsp;
          <strong style={{ color: "var(--text-primary)" }}>{next}일</strong>까지{" "}
          <strong style={{ color: "var(--lime-500)" }}>{daysToNext}일</strong>
        </p>
      </div>

      {/* 메뉴 그리드 */}
      <div className="w-full grid grid-cols-3 gap-3">
        {menus.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="flex flex-col items-start justify-between p-4 rounded-2xl aspect-square transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}
          >
            <span
              className="text-xl font-black"
              style={{ color: "var(--lime-300)", letterSpacing: "-0.03em" }}
            >
              {m.abbr}
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              {m.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
