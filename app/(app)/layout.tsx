import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import RealtimeNotifications from "@/components/popup/RealtimeNotifications";
import PageStrip from "@/components/ui/PageStrip";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--surface-sub)" }}>
      <AppHeader />
      <PageStrip />
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav />
      {user && <RealtimeNotifications userId={user.id} />}
    </div>
  );
}
