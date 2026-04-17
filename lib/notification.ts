/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { NOTIFICATION_PRIORITY } from "@/types/common";
import type { EntityType, NotificationType } from "@/types/common";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  body?: string;
  entityType?: EntityType;
  entityId?: string;
  requesterId: string;      // 알림 생성자 (상대방에게 보냄)
  recipientId?: string;     // 명시적 수신자 (없으면 상대방 자동 조회)
}

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient() as any;

  // 수신자: 명시적 지정 없으면 상대방
  let recipientId = params.recipientId;
  if (!recipientId) {
    const { data } = await supabase.rpc("get_partner_id", { p_user_id: params.requesterId });
    recipientId = data;
  }
  if (!recipientId) return;

  await supabase.from("notifications").insert({
    recipient_id: recipientId,
    type: params.type,
    priority: NOTIFICATION_PRIORITY[params.type],
    title: params.title,
    body: params.body ?? null,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
  });
}
