-- ============================================================
-- 03_indexes.sql — 인덱스
-- ============================================================

-- 핵심: pending 중복 방지
CREATE UNIQUE INDEX uq_pending_approval
  ON approval_requests (entity_id) WHERE status = 'pending';

CREATE INDEX idx_approval_entity     ON approval_requests (entity_type, entity_id);
CREATE INDEX idx_approval_status     ON approval_requests (status);
CREATE INDEX idx_approval_requester  ON approval_requests (requested_by);

CREATE INDEX idx_notif_recipient     ON notifications (recipient_id, created_at DESC);
CREATE INDEX idx_notif_unread        ON notifications (recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notif_popup         ON notifications (recipient_id, popup_shown_date);

CREATE INDEX idx_schedule_date       ON schedules (start_date, end_date);
CREATE INDEX idx_schedule_status     ON schedules (approval_status, status, is_deleted);

CREATE INDEX idx_travel_date         ON travel_plans (start_date, end_date);
CREATE INDEX idx_travel_status       ON travel_plans (approval_status, status, is_deleted);

CREATE INDEX idx_map_region          ON map_records (region_code, country_code);
CREATE INDEX idx_map_travel          ON map_records (travel_plan_id);
CREATE INDEX idx_map_status          ON map_records (approval_status, status, is_deleted);

CREATE INDEX idx_bucket_status       ON bucket_items (approval_status, completion_status, status, is_deleted);
CREATE INDEX idx_bucket_created_by   ON bucket_items (created_by);

CREATE INDEX idx_post_created        ON posts (created_at DESC) WHERE is_deleted = FALSE;
CREATE INDEX idx_comment_post        ON comments (post_id, created_at);
CREATE INDEX idx_comment_parent      ON comments (parent_id);
CREATE INDEX idx_reaction_entity     ON reactions (entity_type, entity_id);

CREATE INDEX idx_emotion_user_date   ON emotion_logs (user_id, log_date DESC);
CREATE INDEX idx_emotion_log_date    ON emotion_logs (log_date);
