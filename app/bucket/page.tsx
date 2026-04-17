"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BucketItem = { id: string; title: string; done: boolean };

export default function BucketPage() {
  const [list, setList] = useState<BucketItem[]>([]);
  const [title, setTitle] = useState("");

  async function load() {
    const res = await fetch("/api/bucket");
    setList(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!title.trim()) return;
    await fetch("/api/bucket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    load();
  }

  async function toggle(item: BucketItem) {
    await fetch("/api/bucket", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, done: !item.done }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/bucket", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-sm mx-auto">
        <Link href="/" className="text-pink-400 text-sm mb-4 block">← 홈으로</Link>
        <h1 className="text-2xl font-bold text-pink-500 mb-6">🪣 버킷리스트</h1>

        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm flex-1"
            placeholder="버킷리스트 추가..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button
            onClick={add}
            className="bg-pink-400 text-white rounded-lg px-4 text-sm font-semibold hover:bg-pink-500 transition"
          >
            추가
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-4 flex items-center gap-3"
            >
              <span
                className="text-xl cursor-pointer"
                onClick={() => toggle(item)}
              >
                {item.done ? "✅" : "⬜"}
              </span>
              <span
                className={`text-sm flex-1 cursor-pointer ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}
                onClick={() => toggle(item)}
              >
                {item.title}
              </span>
              <button
                onClick={() => remove(item.id)}
                className="text-gray-300 hover:text-red-400 text-xs"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
