// Supabase 자동 생성 타입 플레이스홀더
// 실제 타입은 아래 명령으로 생성:
// npx supabase gen types typescript --project-id hvmcrvnkmglxiuyshpzl > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          avatar_pending_url: string | null;
          must_change_password: boolean;
          current_emotion_id: string | null;
          status_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      emotions: {
        Row: {
          id: string;
          emoji: string;
          label: string;
          score: number;
          is_custom: boolean;
          created_by: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["emotions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["emotions"]["Insert"]>;
      };
      emotion_logs: {
        Row: {
          id: string;
          user_id: string;
          emotion_id: string;
          status_message: string | null;
          logged_at: string;
          log_date: string;
        };
        Insert: Omit<Database["public"]["Tables"]["emotion_logs"]["Row"], "id" | "logged_at">;
        Update: never;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: string;
          priority: number;
          title: string;
          body: string | null;
          entity_type: string | null;
          entity_id: string | null;
          is_read: boolean;
          read_at: string | null;
          popup_shown_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      approval_requests: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          action_type: string;
          status: string;
          requested_by: string;
          snapshot_before: Json | null;
          snapshot_after: Json | null;
          rejection_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["approval_requests"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["approval_requests"]["Insert"]>;
      };
      bucket_items: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          importance: number;
          target_date: string | null;
          approval_status: string;
          completion_status: string;
          status: string;
          completed_at: string | null;
          is_deleted: boolean;
          deleted_at: string | null;
          deleted_by: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bucket_items"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["bucket_items"]["Insert"]>;
      };
      schedules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          is_all_day: boolean;
          start_time: string | null;
          end_time: string | null;
          is_period: boolean;
          is_recurring: boolean;
          recurrence_type: string | null;
          approval_status: string;
          status: string;
          is_deleted: boolean;
          deleted_at: string | null;
          deleted_by: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schedules"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["schedules"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          created_by: string;
          is_deleted: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["posts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          parent_id: string | null;
          content: string;
          created_by: string;
          is_deleted: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["comments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      settings: {
        Row: { key: string; value: Json; updated_at: string; updated_by: string | null };
        Insert: Omit<Database["public"]["Tables"]["settings"]["Row"], "updated_at">;
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
    };
    Functions: {
      get_partner_id: { Args: { p_user_id: string }; Returns: string };
      get_daily_emotion: {
        Args: { p_user_id: string; p_date: string };
        Returns: { emotion_id: string; status_message: string; logged_at: string }[];
      };
      create_approval_request: {
        Args: {
          p_entity_type: string;
          p_entity_id: string;
          p_action_type: string;
          p_requested_by: string;
          p_snapshot_before?: Json;
          p_snapshot_after?: Json;
        };
        Returns: string;
      };
    };
  };
}
