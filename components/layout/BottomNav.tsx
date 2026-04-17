"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/",             icon: "🏠", label: "홈"   },
  { href: "/calendar",     icon: "📅", label: "달력"  },
  { href: "/bucket",       icon: "⭐", label: "버킷"  },
  { href: "/map",          icon: "🗺️", label: "지도"  },
  { href: "/travel",       icon: "✈️", label: "여행"  },
  { href: "/notifications",icon: "🔔", label: "알림"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t safe-bottom"
      style={{
        background: "rgba(232,244,252,0.92)",
        backdropFilter: "blur(16px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex justify-around items-center px-1 pt-1 pb-0.5">
        {menus.map((m) => {
          const isActive = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl relative transition-all"
              style={{ minWidth: "3rem" }}
            >
              {/* 활성 배경 */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, var(--lime-100), var(--sky-100))", opacity: 0.9 }}
                />
              )}
              <span
                className="relative text-[20px] leading-none"
                style={{ filter: isActive ? "none" : "grayscale(0.4) opacity(0.65)" }}
              >
                {m.icon}
              </span>
              <span
                className="relative text-[9px] font-semibold"
                style={{ color: isActive ? "var(--sky-600)" : "var(--text-muted)" }}
              >
                {m.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
