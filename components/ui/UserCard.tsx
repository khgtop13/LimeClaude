interface UserCardProps {
  initial: string;
  displayName: string;
  emotion?: string | null;
  accentVar: string;
  bgVar: string;
  isSelf?: boolean;
}

export default function UserCard({
  initial, displayName, emotion, accentVar, bgVar, isSelf,
}: UserCardProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{
            background: accentVar,
            boxShadow: `0 2px 8px ${accentVar}55`,
          }}
        >
          {initial}
        </div>
        {emotion && (
          <span className="absolute -bottom-0.5 -right-1 text-[13px] leading-none drop-shadow-sm">
            {emotion}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {displayName}
        </span>
        {isSelf && (
          <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>나</span>
        )}
      </div>
    </div>
  );
}
