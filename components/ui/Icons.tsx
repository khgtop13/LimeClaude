/** 공통 SVG 아이콘 — stroke 기반, size prop으로 크기 조절 */
interface IconProps { size?: number; color?: string; strokeWidth?: number; }

const d = (strokeWidth = 1.8) => ({ fill:"none", strokeLinecap:"round" as const, strokeLinejoin:"round" as const, strokeWidth });

export function IconHome({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
      <path d="M5 10v11h14V10" />
    </svg>
  );
}

export function IconCalendar({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1" fill={color} stroke="none" />
      <circle cx="12" cy="15" r="1" fill={color} stroke="none" />
      <circle cx="16" cy="15" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconStar({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function IconMap({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
      <path d="M9 4v16M15 7v13" />
    </svg>
  );
}

export function IconPlane({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 22-7z" />
    </svg>
  );
}

export function IconBell({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export function IconCheck({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconEdit({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function IconTrash({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export function IconChevronDown({ size=16, color="currentColor", strokeWidth=2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function IconPlus({ size=16, color="currentColor", strokeWidth=2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function IconMessageCircle({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export function IconLightbulb({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" />
    </svg>
  );
}

export function IconApproval({ size=20, color="currentColor", strokeWidth=1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

export function IconX({ size=16, color="currentColor", strokeWidth=2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...d(strokeWidth)} stroke={color}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
