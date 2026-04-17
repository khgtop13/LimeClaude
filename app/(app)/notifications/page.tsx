/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { markAllRead } from "@/features/notifications/actions";
import NotificationList from "@/components/notifications/NotificationList";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await (supabase as any)
    .from("notifications")
    .select("id, type, priority, title, body, entity_type, entity_id, is_read, created_at")
    .eq("recipient_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length ?? 0;

  return (
    <div className="flex flex-col gap-4 px-4 py-5 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
          알림함
        </h1>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="text-[12px] font-semibold px-3 py-1 rounded-full"
              style={{ background: "var(--surface-sky)", color: "var(--sky-600)", border: "1px solid var(--border)" }}
            >
              전체 읽음
            </button>
          </form>
        )}
      </div>

      <NotificationList notifications={notifications ?? []} />
    </div>
  );
}
