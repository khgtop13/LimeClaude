/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import Link from "next/link";

interface SearchParams { year?: string; month?: string; }

function pad(n: number) { return String(n).padStart(2, "0"); }

export default async function CalendarPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const year  = parseInt(sp.year  ?? "") || now.getFullYear();
  const month = parseInt(sp.month ?? "") || now.getMonth() + 1;

  const rangeStart = `${year}-${pad(month)}-01`;
  const rangeEnd   = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`;

  const supabase = await createClient();

  const [{ data: schedules }, { data: anniversaries }, { data: birthdays }] = await Promise.all([
    (supabase as any)
      .from("schedules")
      .select("title, start_date")
      .eq("approval_status", "approved")
      .eq("is_deleted", false)
      .gte("start_date", rangeStart)
      .lte("start_date", rangeEnd),
    (supabase as any).from("anniversaries").select("title, reference_date").eq("is_deleted", false),
    (supabase as any).from("birthdays").select("name, birth_date").eq("is_deleted", false),
  ]);

  type CalEvent = { date: string; title: string; color: "lime" | "sky" | "pink"; type: string };
  const events: CalEvent[] = [];

  // 일정
  for (const s of schedules ?? []) {
    events.push({ date: s.start_date, title: s.title, color: "lime", type: "schedule" });
  }

  // 기념일 — 해당 월에 해당하는 월/일
  for (const a of anniversaries ?? []) {
    if (!a.reference_date) continue;
    const [, am, ad] = a.reference_date.split("-");
    if (parseInt(am) === month) {
      events.push({ date: `${year}-${pad(month)}-${ad}`, title: a.title, color: "sky", type: "anniversary" });
    }
  }

  // 생일 — 해당 월에 해당하는 월/일
  for (const b of birthdays ?? []) {
    if (!b.birth_date) continue;
    const [, bm, bd] = b.birth_date.split("-");
    if (parseInt(bm) === month) {
      events.push({ date: `${year}-${pad(month)}-${bd}`, title: `${b.name} 생일`, color: "pink", type: "birthday" });
    }
  }

  return (
    <div className="flex flex-col px-4 py-5 gap-4 max-w-sm mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold" style={{ color:"var(--text-primary)" }}>달력</h1>
        <Link
          href="/schedules/new"
          className="text-[12px] font-semibold px-3 py-1 rounded-full"
          style={{ background:"var(--surface-sky)", color:"var(--sky-600)", border:"1px solid var(--border)" }}
        >
          + 일정 추가
        </Link>
      </div>

      {/* 범례 */}
      <div className="flex gap-3 text-[11px]" style={{ color:"var(--text-muted)" }}>
        {[
          { color:"var(--lime-400)", label:"일정" },
          { color:"var(--sky-400)",  label:"기념일" },
          { color:"#e06090",         label:"생일" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background:l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      <MonthCalendar year={year} month={month} events={events} />
    </div>
  );
}
