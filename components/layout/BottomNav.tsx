"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/",             abbr: "HOME", label: "홈" },
  { href: "/calendar",     abbr: "CAL",  label: "달력" },
  { href: "/bucket",       abbr: "BKT",  label: "버킷" },
  { href: "/map",          abbr: "MAP",  label: "지도" },
  { href: "/brainstorm",   abbr: "BST",  label: "브레인" },
  { href: "/notifications",abbr: "ALM",  label: "알림" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 flex justify-around items-center py-2 border-t safe-bottom"
      style={{ background: "var(--surface-base)", borderColor: "var(--border-subtle)" }}
    >
      {menus.map((m) => {
        const isActive = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors"
            style={{ color: isActive ? "var(--sky-500)" : "var(--text-muted)" }}
          >
            <span
              className="text-[11px] font-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              {m.abbr}
            </span>
            <span className="text-[9px]">{m.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
