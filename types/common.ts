// 공통 상태 타입
export type ApprovalStatus = "draft" | "pending" | "approved" | "rejected" | "cancelled";
export type ActionType = "create" | "update" | "delete" | "deactivate" | "complete" | "photo_change";
export type EntityType =
  | "schedule" | "bucket_item" | "travel_plan" | "map_record"
  | "anniversary" | "birthday" | "profile_photo";
export type ApprovalAction = "submitted" | "cancelled" | "approved" | "rejected" | "resubmitted";
export type NotificationType = "approval_request" | "schedule" | "birthday" | "travel" | "brainstorm" | "general";
export type ItemStatus = "active" | "inactive";
export type CompletionStatus = "incomplete" | "complete_pending" | "completed";
export type TravelCompletion = "planned" | "completed" | "cancelled";
export type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "mixed";
export type ReactionType = "like" | "dislike";

// 공통 믹스인
export interface SoftDeletable {
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Auditable {
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface WithApproval {
  approval_status: ApprovalStatus;
}

// 알림 우선순위
export const NOTIFICATION_PRIORITY: Record<NotificationType, number> = {
  approval_request: 1,
  schedule:         2,
  birthday:         3,
  travel:           4,
  brainstorm:       5,
  general:          6,
};
