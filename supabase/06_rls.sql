-- ============================================================
-- 06_rls.sql — RLS 정책
-- 원칙: 인증된 사용자(2명)만 접근 / 세부 권한은 API Route에서 처리
-- ============================================================

DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','settings','approval_requests','approval_history',
    'notifications','anniversaries','birthdays','schedules',
    'travel_plans','travel_checklists','map_records','map_record_photos',
    'bucket_items','posts','post_photos','comments','reactions',
    'emotions','emotion_logs'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY "auth_read" ON %I FOR SELECT TO authenticated USING (true)', t
    );
  END LOOP;
END; $$;

-- notifications: 본인 것만 읽기
DROP POLICY IF EXISTS "auth_read" ON notifications;
CREATE POLICY "read_own" ON notifications FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());
CREATE POLICY "update_own" ON notifications FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());

-- profiles: 본인만 수정
CREATE POLICY "update_own" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- approval_requests: 요청자만 생성
CREATE POLICY "insert_own" ON approval_requests FOR INSERT TO authenticated
  WITH CHECK (requested_by = auth.uid());
CREATE POLICY "update_all" ON approval_requests FOR UPDATE TO authenticated USING (true);

-- approval_history
CREATE POLICY "insert_own" ON approval_history FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- 공통 엔티티: 인증된 사용자 전체 쓰기 (비즈니스 로직은 Server Action에서)
DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'settings','anniversaries','birthdays','schedules',
    'travel_plans','travel_checklists','map_records','map_record_photos','bucket_items'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY "auth_write" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t
    );
  END LOOP;
END; $$;

-- 브레인스토밍: 본인만 수정/삭제
CREATE POLICY "insert_post"  ON posts FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "update_own"   ON posts FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "delete_own"   ON posts FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "insert_photo" ON post_photos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "insert_comment" ON comments FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "update_own"     ON comments FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "delete_own"     ON comments FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "manage_own" ON reactions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 감정
CREATE POLICY "insert_custom" ON emotions FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());
CREATE POLICY "update_own"    ON emotions FOR UPDATE TO authenticated
  USING (created_by = auth.uid());
CREATE POLICY "insert_own"    ON emotion_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
