"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CalEvent {
  date: string;         // YYYY-MM-DD
  title: string;
  color: "lime" | "sky" | "pink";
  type: string;
}

interface Props {
  year: number;
  month: number;        // 1-12
  events: CalEvent[];
}

const DAYS = ["일","월","화","수","목","금","토"];

const dotColor: Record<string, string> = {
  lime:  "var(--lime-400)",
  sky:   "var(--sky-400)",
  pink:  "#e06090",
};

export default function MonthCalendar({ year, month, events }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const lastDate = new Date(year, month, 0).getDate();

  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  const eventMap = new Map<string, CalEvent[]>();
  for (const e of events) {
    if (!eventMap.has(e.date)) eventMap.set(e.date, []);
    eventMap.get(e.date)!.push(e);
  }

  function pad(n: number) { return String(n).padStart(2,"0"); }
  function dateStr(d: number) { return `${year}-${pad(month)}-${pad(d)}`; }

  function navigate(delta: number) {
    let y = year, m = month + delta;
    if (m > 12) { y++; m = 1; }
    if (m < 1)  { y--; m = 12; }
    setSelected(null);
    router.push(`/calendar?year=${y}&month=${m}`);
  }

  const selectedEvents = selected ? (eventMap.get(selected) ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="nav-btn">‹</button>
        <span className="font-bold text-base" style={{ color:"var(--text-primary)" }}>
          {year}년 {month}월
        </span>
        <button onClick={() => navigate(1)} className="nav-btn">›</button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center">
        {DAYS.map((d, i) => (
          <span
            key={d}
            className="text-[11px] font-semibold py-1"
            style={{ color: i===0 ? "#e05252" : i===6 ? "var(--sky-500)" : "var(--text-muted)" }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* 빈 칸 */}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

        {/* 날짜 */}
        {Array.from({ length: lastDate }).map((_, i) => {
          const day = i + 1;
          const ds = dateStr(day);
          const isToday = ds === todayStr;
          const isSel = ds === selected;
          const dayEvents = eventMap.get(ds) ?? [];
          const isSun = (firstDay + i) % 7 === 0;
          const isSat = (firstDay + i) % 7 === 6;

          return (
            <div
              key={day}
              onClick={() => setSelected(isSel ? null : ds)}
              className="flex flex-col items-center gap-0.5 py-1 rounded-xl cursor-pointer transition-colors"
              style={{
                background: isSel ? "var(--surface-sky)" : isToday ? "var(--surface-lime)" : "transparent",
                border: isSel ? "1.5px solid var(--sky-300)" : isToday ? "1.5px solid var(--border-lime)" : "1.5px solid transparent",
              }}
            >
              <span
                className="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  color: isSun ? "#e05252" : isSat ? "var(--sky-500)" : "var(--text-primary)",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {day}
              </span>
              {/* 이벤트 점 (최대 3개) */}
              <div className="flex gap-0.5">
                {dayEvents.slice(0, 3).map((ev, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: dotColor[ev.color] }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 선택된 날 이벤트 */}
      {selected && (
        <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor:"var(--border-subtle)" }}>
          <p className="text-xs font-semibold" style={{ color:"var(--text-muted)" }}>
            {parseInt(selected.split("-")[2])}일 일정
          </p>
          {selectedEvents.length === 0 ? (
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>일정 없음</p>
          ) : (
            selectedEvents.map((ev, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background:"var(--surface-base)", border:"1px solid var(--border-subtle)" }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor[ev.color] }} />
                <span className="text-sm" style={{ color:"var(--text-primary)" }}>{ev.title}</span>
                <span className="text-[10px] ml-auto" style={{ color:"var(--text-muted)" }}>
                  {ev.type === "schedule" ? "일정" : ev.type === "anniversary" ? "기념일" : "생일"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .nav-btn {
          width:2.25rem; height:2.25rem;
          border-radius:50%; border:1px solid var(--border);
          background:var(--surface-base); color:var(--text-secondary);
          font-size:1.25rem; cursor:pointer; transition:background 0.15s;
          display:flex; align-items:center; justify-content:center;
        }
        .nav-btn:hover { background:var(--surface-sky); }
      `}</style>
    </div>
  );
}
