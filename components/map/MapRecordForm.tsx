"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createMapRecord, updateMapRecord } from "@/features/map/actions";

interface Record {
  id: string; title: string; address?: string | null; comment?: string | null;
  visit_start: string; visit_end?: string | null; weather?: string | null;
  lat?: number | null; lng?: number | null;
}
interface Props { record?: Record; onClose: () => void; }

const WEATHERS = [
  { value: "sunny", label: "☀️ 맑음" }, { value: "cloudy", label: "☁️ 흐림" },
  { value: "rainy", label: "🌧️ 비" }, { value: "snowy", label: "❄️ 눈" }, { value: "mixed", label: "⛅ 혼합" },
];

export default function MapRecordForm({ record, onClose }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [latStr, setLatStr] = useState(record?.lat ? String(record.lat) : "");
  const [lngStr, setLngStr] = useState(record?.lng ? String(record.lng) : "");
  const pin = latStr && lngStr ? { lat: parseFloat(latStr), lng: parseFloat(lngStr) } : null;
  const [weather, setWeather] = useState(record?.weather ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current!);
    if (pin) { fd.set("lat", String(pin.lat)); fd.set("lng", String(pin.lng)); }
    fd.set("weather", weather);
    startTransition(async () => {
      try {
        if (record) await updateMapRecord(record.id, fd);
        else        await createMapRecord(fd);
        onClose();
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="sheet-title">{record ? "장소 수정" : "장소 추가"}</p>

        <form ref={formRef} onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label">장소 이름 *</label>
            <input name="title" defaultValue={record?.title} required placeholder="예: 남산타워" className="input" />
          </div>
          <div className="field">
            <label className="label">주소</label>
            <input name="address" defaultValue={record?.address ?? ""} placeholder="예: 서울 용산구 남산공원길" className="input" />
          </div>
          <div className="row2">
            <div className="field">
              <label className="label">방문 시작 *</label>
              <input name="visit_start" type="date" defaultValue={record?.visit_start ?? new Date().toISOString().split("T")[0]} required className="input" />
            </div>
            <div className="field">
              <label className="label">방문 종료</label>
              <input name="visit_end" type="date" defaultValue={record?.visit_end ?? ""} className="input" />
            </div>
          </div>
          <div className="field">
            <label className="label">날씨</label>
            <div className="weather-row">
              {WEATHERS.map((w) => (
                <button key={w.value} type="button" onClick={() => setWeather(weather === w.value ? "" : w.value)}
                  className={`weather-btn ${weather === w.value ? "on" : ""}`}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label className="label">위도 (선택)</label>
              <input value={latStr} onChange={(e) => setLatStr(e.target.value)} placeholder="예: 37.5512" className="input" inputMode="decimal" />
            </div>
            <div className="field">
              <label className="label">경도 (선택)</label>
              <input value={lngStr} onChange={(e) => setLngStr(e.target.value)} placeholder="예: 126.9882" className="input" inputMode="decimal" />
            </div>
          </div>
          <div className="field">
            <label className="label">메모</label>
            <textarea name="comment" defaultValue={record?.comment ?? ""} rows={2} placeholder="이 날의 기억..." className="input textarea" />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="row">
            <button type="button" onClick={onClose} className="btn-cancel">취소</button>
            <button type="submit" disabled={isPending} className="btn-submit">
              {isPending ? "저장 중..." : record ? "수정 요청" : "추가 요청"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .backdrop { position:fixed; inset:0; z-index:60; background:rgba(15,37,53,0.4); display:flex; align-items:flex-end; }
        .sheet { width:100%; background:var(--surface-base); border-radius:1.25rem 1.25rem 0 0; padding:0.75rem 1rem 2rem; display:flex; flex-direction:column; gap:0.875rem; max-height:95dvh; overflow-y:auto; }
        .sheet-handle { width:2.5rem; height:4px; background:var(--border); border-radius:99px; margin:0 auto; }
        .sheet-title { font-size:0.9375rem; font-weight:700; color:var(--text-primary); text-align:center; }
        .form { display:flex; flex-direction:column; gap:0.75rem; }
        .field { display:flex; flex-direction:column; gap:0.3rem; }
        .label { font-size:0.8125rem; font-weight:500; color:var(--text-secondary); }
        .input { padding:0.5rem 0.75rem; border:1px solid var(--border-default); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-primary); font-size:0.9rem; outline:none; font-family:inherit; }
        .input:focus { border-color:var(--sky-400); }
        .textarea { resize:vertical; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
        .weather-row { display:flex; gap:0.375rem; flex-wrap:wrap; }
        .weather-btn { padding:0.3rem 0.625rem; border-radius:0.5rem; font-size:0.75rem; border:1px solid var(--border); background:var(--surface-sub); cursor:pointer; transition:all 0.12s; }
        .weather-btn.on { background:var(--surface-sky); border-color:var(--sky-400); color:var(--sky-600); font-weight:600; }
        .error { font-size:0.8125rem; color:#c0392b; }
        .row { display:flex; gap:0.625rem; }
        .btn-cancel { flex:1; padding:0.7rem; border:1px solid var(--border); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-secondary); font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit { flex:2; padding:0.7rem; border:none; border-radius:0.625rem; background:linear-gradient(90deg,var(--sky-400),var(--sky-500)); color:#fff; font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
