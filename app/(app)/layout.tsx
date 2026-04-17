import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--surface-sub)" }}>
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
