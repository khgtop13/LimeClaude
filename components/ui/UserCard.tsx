interface UserCardProps {
  initial: string;
  displayName: string;
  emotion?: string | null;   // emoji
  accentVar: string;         // CSS var, e.g. "var(--lime-400)"
  bgVar: string;             // CSS var, e.g. "var(--lime-50)"
  isSelf?: boolean;
}

export default function UserCard({
  initial, displayName, emotion, accentVar, bgVar, isSelf,
}: UserCardProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
      style={{ background: bgVar, border: "1px solid var(--border-subtle)" }}
    >
      <div className="relative">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: accentVar }}
        >
          {initial}
        </span>
        {emotion && (
          <span className="absolute -bottom-0.5 -right-1 text-[10px] leading-none">
            {emotion}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {displayName}
          {isSelf && <span className="ml-1 text-[9px] font-normal" style={{ color: "var(--text-muted)" }}>나</span>}
        </span>
      </div>
    </div>
  );
}
