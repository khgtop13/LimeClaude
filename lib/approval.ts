"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notification";
import type { ActionType, EntityType } from "@/types/common";

const TABLE_MAP: Record<string, string> = {
  schedule: "schedules",
  bucket_item: "bucket_items",
  travel_plan: "travel_plans",
  map_record: "map_records",
  anniversary: "anniversaries",
  birthday: "birthdays",
};

export async function submitApproval(
  entityType: EntityType,
  entityId: string,
  actionType: ActionType,
  snapshotBefore: object | null,
  snapshotAfter: object | null
) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: requestId, error } = await supabase.rpc("create_approval_request", {
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_action_type: actionType,
    p_requested_by: user.id,
    p_snapshot_before: snapshotBefore,
    p_snapshot_after: snapshotAfter,
  });

  if (error?.message?.includes("DUPLICATE_PENDING"))
    throw new Error("이미 승인 대기 중인 요청이 있습니다.");
  if (error) throw error;

  await createNotification({
    type: "approval_request",
    title: "승인 요청이 도착했습니다",
    entityType,
    entityId,
    requesterId: user.id,
  });

  return requestId as string;
}

export async function approveRequest(requestId: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: req } = await supabase
    .from("approval_requests").select("*").eq("id", requestId).single();

  if (!req) throw new Error("요청을 찾을 수 없습니다.");
  if (req.requested_by === user.id) throw new Error("본인 요청은 승인할 수 없습니다.");
  if (req.status !== "pending") throw new Error("승인 대기 상태가 아닙니다.");

  await supabase.from("approval_requests").update({
    status: "approved", reviewed_by: user.id, reviewed_at: new Date().toISOString(),
  }).eq("id", requestId);

  await supabase.from("approval_history").insert({
    request_id: requestId, action: "approved", actor_id: user.id,
  });

  await applyApproval(supabase, req);

  await createNotification({
    type: "approval_request",
    title: "승인되었습니다",
    body: "요청이 승인되어 반영되었습니다.",
    entityType: req.entity_type,
    entityId: req.entity_id,
    requesterId: user.id,
    recipientId: req.requested_by,
  });
}

export async function rejectRequest(requestId: string, reason: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!reason?.trim()) throw new Error("반려 의견을 입력해주세요.");

  const { data: req } = await supabase
    .from("approval_requests").select("*").eq("id", requestId).single();

  if (!req) throw new Error("요청을 찾을 수 없습니다.");
  if (req.requested_by === user.id) throw new Error("본인 요청은 반려할 수 없습니다.");

  await supabase.from("approval_requests").update({
    status: "rejected", rejection_reason: reason,
    reviewed_by: user.id, reviewed_at: new Date().toISOString(),
  }).eq("id", requestId);

  await supabase.from("approval_history").insert({
    request_id: requestId, action: "rejected", actor_id: user.id, note: reason,
  });

  await revertToDraft(supabase, req.entity_type, req.entity_id);

  await createNotification({
    type: "approval_request",
    title: "반려되었습니다",
    body: reason,
    entityType: req.entity_type,
    entityId: req.entity_id,
    requesterId: user.id,
    recipientId: req.requested_by,
  });
}

export async function cancelRequest(requestId: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: req } = await supabase
    .from("approval_requests")
    .select("requested_by, entity_type, entity_id")
    .eq("id", requestId).single();

  if (!req) throw new Error("요청을 찾을 수 없습니다.");
  if (req.requested_by !== user.id) throw new Error("본인 요청만 취소할 수 있습니다.");

  await supabase.from("approval_requests").update({
    status: "cancelled", cancelled_at: new Date().toISOString(),
  }).eq("id", requestId);

  await supabase.from("approval_history").insert({
    request_id: requestId, action: "cancelled", actor_id: user.id,
  });

  await revertToDraft(supabase, req.entity_type, req.entity_id);
}

async function applyApproval(supabase: any, req: any) {
  const table = TABLE_MAP[req.entity_type];
  if (!table) return;

  if (req.action_type === "delete") {
    await supabase.from(table).update({
      is_deleted: true, deleted_at: new Date().toISOString(),
    }).eq("id", req.entity_id);
    return;
  }
  if (req.action_type === "deactivate") {
    await supabase.from(table).update({ status: "inactive" }).eq("id", req.entity_id);
    return;
  }
  if (req.action_type === "complete") {
    await supabase.from(table).update({
      completion_status: "completed",
      completed_at: new Date().toISOString(),
      approval_status: "approved",
    }).eq("id", req.entity_id);
    return;
  }

  const update = req.snapshot_after
    ? { ...req.snapshot_after, approval_status: "approved" }
    : { approval_status: "approved" };
  await supabase.from(table).update(update).eq("id", req.entity_id);
}

async function revertToDraft(supabase: any, entityType: string, entityId: string) {
  const table = TABLE_MAP[entityType];
  if (!table) return;
  await supabase.from(table).update({ approval_status: "draft" }).eq("id", entityId);
}
