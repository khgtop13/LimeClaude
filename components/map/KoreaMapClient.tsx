"use client";
import { useState, useTransition } from "react";
import KoreaMap, { type RegionColor } from "./KoreaMap";
import { updateRegionColor } from "@/features/map/regionActions";
import { useRouter } from "next/navigation";

interface Props {
  initialColors: Record<string, RegionColor>;
}

export default function KoreaMapClient({ initialColors }: Props) {
  const [colors, setColors] = useState<Record<string, RegionColor>>(initialColors);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle(id: string) {
    const cur = colors[id] ?? "none";
    const next: RegionColor = cur === "none" ? "lime" : cur === "lime" ? "sky" : "none";

    // 낙관적 업데이트
    setColors((prev) => ({ ...prev, [id]: next }));

    startTransition(async () => {
      await updateRegionColor(id, next);
      router.refresh();
    });
  }

  const visited   = Object.values(colors).filter((c) => c === "lime").length;
  const wantToGo  = Object.values(colors).filter((c) => c === "sky").length;

  return (
    <div className="flex flex-col gap-3">
      {/* 통계 */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl px-4 py-3 text-center"
          style={{ background:"var(--lime-50)", border:"1px solid var(--border-lime)" }}>
          <p className="text-2xl font-black" style={{ color:"var(--lime-500)" }}>{visited}</p>
          <p className="text-[11px] font-medium" style={{ color:"var(--lime-600)" }}>다녀왔어요</p>
        </div>
        <div className="flex-1 rounded-2xl px-4 py-3 text-center"
          style={{ background:"var(--sky-50)", border:"1px solid var(--border)" }}>
          <p className="text-2xl font-black" style={{ color:"var(--sky-500)" }}>{wantToGo}</p>
          <p className="text-[11px] font-medium" style={{ color:"var(--sky-600)" }}>가고싶어요</p>
        </div>
        <div className="flex-1 rounded-2xl px-4 py-3 text-center"
          style={{ background:"var(--surface-base)", border:"1px solid var(--border-subtle)" }}>
          <p className="text-2xl font-black" style={{ color:"var(--text-muted)" }}>{17 - visited - wantToGo}</p>
          <p className="text-[11px] font-medium" style={{ color:"var(--text-muted)" }}>아직 미방문</p>
        </div>
      </div>

      <p className="text-[11px] text-center" style={{ color:"var(--text-muted)" }}>
        지역을 탭해서 색칠하세요 &nbsp;·&nbsp; lime=다녀옴 → sky=가고싶어 → 빈칸
      </p>

      <KoreaMap colors={colors} onToggle={handleToggle} loading={isPending} />
    </div>
  );
}
