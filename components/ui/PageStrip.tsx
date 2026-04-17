/** 헤더 하단 라임→하늘 그라데이션 구분선 */
export default function PageStrip() {
  return (
    <div
      className="h-[3px] w-full flex-shrink-0"
      style={{
        background: "linear-gradient(90deg, var(--lime-400) 0%, var(--lime-300) 30%, var(--sky-300) 70%, var(--sky-400) 100%)",
      }}
    />
  );
}
