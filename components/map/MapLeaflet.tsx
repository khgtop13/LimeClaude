import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Leaflet 기본 마커 아이콘 수정 (Next.js 번들링 이슈)
const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);transform:rotate(-45deg);"></div>`,
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

interface MapRecord {
  id: string; title: string; address?: string | null;
  lat: number; lng: number; visit_start: string;
  weather?: string | null;
}

interface Props {
  records: MapRecord[];
  onPinPlace?: (lat: number, lng: number) => void;
  pickMode?: boolean;
  selectedPin?: { lat: number; lng: number } | null;
}

function ClickHandler({ onPinPlace }: { onPinPlace: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onPinPlace(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

const weatherEmoji: { [k: string]: string } = {
  sunny: "☀️", cloudy: "☁️", rainy: "🌧️", snowy: "❄️", mixed: "⛅",
};

export default function MapLeaflet({ records, onPinPlace, pickMode, selectedPin }: Props) {
  const defaultCenter: [number, number] = records.length > 0
    ? [records[0].lat, records[0].lng] as [number, number]
    : [37.5665, 126.9780]; // 서울 기본

  return (
    <MapContainer
      center={defaultCenter}
      zoom={records.length > 0 ? 12 : 10}
      style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickMode && onPinPlace && <ClickHandler onPinPlace={onPinPlace} />}

      {selectedPin && (
        <Marker position={[selectedPin.lat, selectedPin.lng]} icon={pinIcon("var(--sky-500, #0e8ec2)")} />
      )}

      {records.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={pinIcon("#6fa810")}>
          <Popup>
            <div style={{ minWidth: "120px" }}>
              <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "13px" }}>
                {weatherEmoji[r.weather ?? ""] ?? ""} {r.title}
              </p>
              {r.address && <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#555" }}>{r.address}</p>}
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>{r.visit_start}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
