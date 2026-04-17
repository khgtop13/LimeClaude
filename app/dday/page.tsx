"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";

type DDay = { id: string; label: string; date: string };

export default function DDayPage() {
  const [list, setList] = useState<DDay[]>([]);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");

  async function load() {
    const res = await fetch("/api/dday");
    setList(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!label.trim() || !date) return;
    await fetch("/api/dday", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, date }),
    });
    setLabel("");
    setDate("");
    load();
  }

  async function remove(id: string) {
    await fetch("/api/dday", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function calcDday(date: string) {
    const diff = dayjs(date).diff(dayjs().startOf("day"), "day");
    if (diff === 0) return "D-DAY";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-sm mx-auto">
        <Link href="/" className="text-pink-400 text-sm mb-4 block">← 홈으로</Link>
        <h1 className="text-2xl font-bold text-pink-500 mb-6">📅 D-DAY</h1>

        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            placeholder="이름 (예: 100일)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={add}
            className="bg-pink-400 text-white rounded-lg py-2 text-sm font-semibold hover:bg-pink-500 transition"
          >
            추가
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-pink-500">{calcDday(item.date)}</span>
                <button
                  onClick={() => remove(item.id)}
                  className="text-gray-300 hover:text-red-400 text-xs"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
