import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-pink-500 mb-2">💑 우리만의 공간</h1>
      <p className="text-gray-400 mb-10 text-sm">둘만의 소중한 기록</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <Link
          href="/dday"
          className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2 hover:shadow-md transition"
        >
          <span className="text-3xl">📅</span>
          <span className="font-semibold text-gray-700">D-DAY</span>
        </Link>

        <Link
          href="/photos"
          className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2 hover:shadow-md transition"
        >
          <span className="text-3xl">📷</span>
          <span className="font-semibold text-gray-700">사진첩</span>
        </Link>

        <Link
          href="/bucket"
          className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2 hover:shadow-md transition col-span-2"
        >
          <span className="text-3xl">🪣</span>
          <span className="font-semibold text-gray-700">버킷리스트</span>
        </Link>
      </div>
    </main>
  );
}
