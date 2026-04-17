-- ============================================================
-- 05_functions.sql — DB 함수
-- ============================================================

-- 일간 대표 감정 조회 (마지막 기록 기준)
CREATE OR REPLACE FUNCTION get_daily_emotion(p_user_id UUID, p_date DATE)
RETURNS TABLE(emotion_id UUID, status_message TEXT, logged_at TIMESTAMPTZ) AS $$
  SELECT emotion_id, status_message, logged_at
  FROM emotion_logs
  WHERE user_id = p_user_id AND log_date = p_date
  ORDER BY logged_at DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- 승인 요청 생성 (중복 pending 방지 내장)
CREATE OR REPLACE FUNCTION create_approval_request(
  p_entity_type    entity_type,
  p_entity_id      UUID,
  p_action_type    action_type,
  p_requested_by   UUID,
  p_snapshot_before JSONB DEFAULT NULL,
  p_snapshot_after  JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE v_id UUID;
BEGIN
  IF EXISTS (
    SELECT 1 FROM approval_requests
    WHERE entity_id = p_entity_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'DUPLICATE_PENDING';
  END IF;

  INSERT INTO approval_requests (
    entity_type, entity_id, action_type, status,
    requested_by, snapshot_before, snapshot_after
  ) VALUES (
    p_entity_type, p_entity_id, p_action_type, 'pending',
    p_requested_by, p_snapshot_before, p_snapshot_after
  ) RETURNING id INTO v_id;

  INSERT INTO approval_history (request_id, action, actor_id)
  VALUES (v_id, 'submitted', p_requested_by);

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- 상대방 프로필 ID 조회 (2인 전용)
CREATE OR REPLACE FUNCTION get_partner_id(p_user_id UUID)
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE id != p_user_id LIMIT 1;
$$ LANGUAGE sql STABLE;
