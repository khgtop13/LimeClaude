/** 각 페이지 상단 lime / sky 50:50 구분선 */
export default function PageStrip() {
  return (
    <div className="flex h-1 w-full flex-shrink-0">
      <div className="flex-1" style={{ background: "var(--lime-300)" }} />
      <div className="flex-1" style={{ background: "var(--sky-300)" }} />
    </div>
  );
}
