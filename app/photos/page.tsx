"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Photo = { id: string; name: string; thumbnailLink: string; createdTime: string };

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/photos");
    setPhotos(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/photos", { method: "POST", body: form });
    setUploading(false);
    load();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-sm mx-auto">
        <Link href="/" className="text-pink-400 text-sm mb-4 block">← 홈으로</Link>
        <h1 className="text-2xl font-bold text-pink-500 mb-6">📷 사진첩</h1>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-pink-400 text-white rounded-2xl py-3 mb-6 font-semibold hover:bg-pink-500 transition disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "📤 사진 추가"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={upload} />

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl shadow overflow-hidden">
              {photo.thumbnailLink ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.thumbnailLink} alt={photo.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  미리보기 없음
                </div>
              )}
              <p className="text-xs text-gray-400 p-2 truncate">{photo.name}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
