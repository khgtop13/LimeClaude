-- ============================================================
-- 01_enums.sql — ENUM 타입 정의
-- ============================================================

CREATE TYPE approval_status  AS ENUM ('draft', 'pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE action_type      AS ENUM ('create', 'update', 'delete', 'deactivate', 'complete', 'photo_change');
CREATE TYPE entity_type      AS ENUM (
  'schedule', 'bucket_item', 'travel_plan', 'map_record',
  'anniversary', 'birthday', 'profile_photo'
);
CREATE TYPE approval_action  AS ENUM ('submitted', 'cancelled', 'approved', 'rejected', 'resubmitted');
CREATE TYPE notification_type AS ENUM (
  'approval_request', 'schedule', 'birthday', 'travel', 'brainstorm', 'general'
);
CREATE TYPE recurrence_type  AS ENUM ('yearly', 'monthly');
CREATE TYPE weather_type     AS ENUM ('sunny', 'cloudy', 'rainy', 'snowy', 'mixed');
CREATE TYPE reaction_type    AS ENUM ('like', 'dislike');
CREATE TYPE reaction_entity  AS ENUM ('post', 'comment');
CREATE TYPE completion_status AS ENUM ('incomplete', 'complete_pending', 'completed');
CREATE TYPE travel_completion AS ENUM ('planned', 'completed', 'cancelled');
CREATE TYPE item_status      AS ENUM ('active', 'inactive');
