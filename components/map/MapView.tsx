"use client";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{ background: "var(--surface-sky)", border: "1px solid var(--border)" }}
    >
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>지도 로딩 중...</p>
    </div>
  ),
});

interface Record {
  id: string; title: string; address?: string | null;
  lat: number; lng: number; visit_start: string; weather?: string | null;
}

interface Props {
  records: Record[];
  onPinPlace?: (lat: number, lng: number) => void;
  pickMode?: boolean;
  selectedPin?: { lat: number; lng: number } | null;
}

export default function MapView(props: Props) {
  return <MapLeaflet {...props} />;
}
