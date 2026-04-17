"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconCalendar, IconStar, IconMap, IconPlane, IconBell } from "@/components/ui/Icons";

const menus = [
  { href: "/",             Icon: IconHome,     label: "홈"   },
  { href: "/calendar",     Icon: IconCalendar, label: "달력"  },
  { href: "/bucket",       Icon: IconStar,     label: "버킷"  },
  { href: "/map",          Icon: IconMap,      label: "지도"  },
  { href: "/travel",       Icon: IconPlane,    label: "여행"  },
  { href: "/notifications",Icon: IconBell,     label: "알림"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t safe-bottom"
      style={{
        background: "rgba(232,244,252,0.94)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex justify-around items-center px-1 pt-2 pb-1">
        {menus.map(({ href, Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative transition-all"
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, var(--lime-100), var(--sky-100))" }}
                />
              )}
              <span className="relative">
                <Icon
                  size={21}
                  color={isActive ? "var(--sky-500)" : "var(--text-muted)"}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </span>
              <span
                className="relative text-[10px] font-semibold"
                style={{ color: isActive ? "var(--sky-600)" : "var(--text-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
