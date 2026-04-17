"use client";

export type RegionColor = "lime" | "sky" | "none";

export interface Region {
  id: string;
  name: string;
  short: string;
  path: string;
  labelX: number;
  labelY: number;
}

// 한국 시도 SVG 경로 — viewBox "0 0 300 420"
// 경도 125.5~130.5°E → x: (lon-125.5)*53
// 위도 38.6~33.0°N   → y: (38.6-lat)*62
export const REGIONS: Region[] = [
  // ── 수도권 ──
  {
    id: "incheon",
    name: "인천광역시", short: "인천",
    path: "M 38,112 L 68,104 L 72,126 L 56,138 L 36,132 Z",
    labelX: 50, labelY: 121,
  },
  {
    id: "seoul",
    name: "서울특별시", short: "서울",
    path: "M 76,100 L 102,96 L 108,116 L 82,122 Z",
    labelX: 91, labelY: 110,
  },
  {
    id: "gyeonggi",
    name: "경기도", short: "경기",
    path: "M 46,72 L 118,60 L 160,70 L 168,108 L 148,128 L 108,138 L 72,136 L 54,120 L 68,104 L 72,126 L 56,138 L 38,132 L 36,108 Z",
    labelX: 108, labelY: 102,
  },
  // ── 강원 ──
  {
    id: "gangwon",
    name: "강원특별자치도", short: "강원",
    path: "M 156,48 L 248,36 L 260,92 L 230,110 L 195,118 L 162,112 L 148,90 Z",
    labelX: 200, labelY: 80,
  },
  // ── 충청권 ──
  {
    id: "chungnam",
    name: "충청남도", short: "충남",
    path: "M 34,148 L 108,138 L 122,158 L 118,192 L 70,202 L 26,178 Z",
    labelX: 72, labelY: 172,
  },
  {
    id: "sejong",
    name: "세종특별자치시", short: "세종",
    path: "M 122,158 L 144,154 L 150,172 L 126,176 Z",
    labelX: 135, labelY: 166,
  },
  {
    id: "daejeon",
    name: "대전광역시", short: "대전",
    path: "M 106,184 L 130,178 L 136,198 L 110,204 Z",
    labelX: 120, labelY: 193,
  },
  {
    id: "chungbuk",
    name: "충청북도", short: "충북",
    path: "M 118,130 L 162,112 L 196,128 L 198,172 L 154,178 L 126,176 L 122,158 L 108,138 Z",
    labelX: 158, labelY: 150,
  },
  // ── 경상권 ──
  {
    id: "gyeongbuk",
    name: "경상북도", short: "경북",
    path: "M 192,118 L 258,90 L 272,142 L 268,210 L 232,228 L 178,218 L 164,180 L 172,148 L 196,130 Z",
    labelX: 224, labelY: 160,
  },
  {
    id: "daegu",
    name: "대구광역시", short: "대구",
    path: "M 196,202 L 226,196 L 232,224 L 200,230 Z",
    labelX: 213, labelY: 214,
  },
  {
    id: "ulsan",
    name: "울산광역시", short: "울산",
    path: "M 258,208 L 280,200 L 284,236 L 258,242 Z",
    labelX: 268, labelY: 222,
  },
  {
    id: "gyeongnam",
    name: "경상남도", short: "경남",
    path: "M 162,220 L 232,230 L 260,244 L 248,286 L 206,300 L 152,292 L 134,272 Z",
    labelX: 196, labelY: 262,
  },
  {
    id: "busan",
    name: "부산광역시", short: "부산",
    path: "M 248,268 L 276,258 L 280,292 L 246,298 Z",
    labelX: 261, labelY: 278,
  },
  // ── 전라권 ──
  {
    id: "jeonbuk",
    name: "전북특별자치도", short: "전북",
    path: "M 26,198 L 118,192 L 130,212 L 124,248 L 74,258 L 22,234 Z",
    labelX: 72, labelY: 226,
  },
  {
    id: "jeonnam",
    name: "전라남도", short: "전남",
    path: "M 22,236 L 74,258 L 124,248 L 138,278 L 110,306 L 48,312 L 14,276 Z",
    labelX: 62, labelY: 278,
  },
  {
    id: "gwangju",
    name: "광주광역시", short: "광주",
    path: "M 92,246 L 118,240 L 124,262 L 96,268 Z",
    labelX: 107, labelY: 255,
  },
  // ── 제주 ──
  {
    id: "jeju",
    name: "제주특별자치도", short: "제주",
    path: "M 72,362 L 188,354 L 194,382 L 68,388 Z",
    labelX: 130, labelY: 373,
  },
];

const colorStyle: Record<RegionColor, { fill: string; stroke: string }> = {
  none: { fill: "var(--surface-sub)",  stroke: "var(--border)" },
  lime: { fill: "var(--lime-200)",      stroke: "var(--lime-400)" },
  sky:  { fill: "var(--sky-200)",       stroke: "var(--sky-400)" },
};

interface Props {
  colors: Record<string, RegionColor>;
  onToggle: (id: string) => void;
  loading?: boolean;
}

export default function KoreaMap({ colors, onToggle, loading }: Props) {
  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 300 420"
        className="w-full"
        style={{ maxHeight: "520px" }}
      >
        {/* 바다 배경 */}
        <rect width="300" height="420" fill="var(--sky-50)" rx="12" />

        {/* 도서 구분선 (제주) */}
        <line x1="10" y1="340" x2="290" y2="340" stroke="var(--border)" strokeWidth="1" strokeDasharray="6,4" />

        {REGIONS.map((r) => {
          const color = colors[r.id] ?? "none";
          const style = colorStyle[color];
          return (
            <g key={r.id} onClick={() => !loading && onToggle(r.id)} style={{ cursor: loading ? "wait" : "pointer" }}>
              <path
                d={r.path}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ transition: "fill 0.2s" }}
              />
              <text
                x={r.labelX}
                y={r.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={r.id === "sejong" || r.id === "daejeon" || r.id === "gwangju" || r.id === "daegu" || r.id === "ulsan" || r.id === "busan" ? "7" : "8.5"}
                fontWeight="600"
                fill={color === "none" ? "var(--text-muted)" : "var(--text-primary)"}
                style={{ pointerEvents: "none" }}
              >
                {r.short}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background:"var(--lime-200)", border:"1px solid var(--lime-400)" }} />
          다녀왔어요
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background:"var(--sky-200)", border:"1px solid var(--sky-400)" }} />
          가고싶어요
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background:"var(--surface-sub)", border:"1px solid var(--border)" }} />
          미방문
        </span>
      </div>
    </div>
  );
}
