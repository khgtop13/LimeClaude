-- ============================================================
-- 04_triggers.sql — updated_at 자동 갱신
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'approval_requests', 'anniversaries', 'birthdays',
    'schedules', 'travel_plans', 'travel_checklists', 'map_records',
    'bucket_items', 'posts', 'comments'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t
    );
  END LOOP;
END;
$$;
