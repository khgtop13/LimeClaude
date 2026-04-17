-- ============================================================
-- 07_seed.sql — 초기 데이터
-- 주의: profiles는 Auth 계정 생성 후 id 교체 필요
-- ============================================================

-- 앱 설정
INSERT INTO settings (key, value) VALUES
  ('couple_start_date', '{"date": "2025-09-22"}'),
  ('app_name',          '{"value": "LimeCloud"}'),
  ('timezone',          '{"value": "Asia/Seoul"}');

-- 생일
INSERT INTO birthdays (name, relation, month, day, approval_status, status) VALUES
  ('한결', 'partner', 7,  13, 'approved', 'active'),
  ('정석', 'self',   10, 20, 'approved', 'active');

-- 자동 기념일 (profiles가 있을 때 실행)
-- Auth 계정 생성 후 아래 INSERT 실행
-- INSERT INTO anniversaries (title, type, offset_days, approval_status, status, created_by)
-- SELECT title, 'auto', offset_days, 'approved', 'active', '<lime_user_id>'
-- FROM (VALUES
--   ('100일',99),('200일',199),('300일',299),
--   ('1주년',364),('500일',499),('2주년',729),
--   ('3주년',1094),('4주년',1460),('5주년',1825)
-- ) AS t(title, offset_days);

-- 감정 마스터
INSERT INTO emotions (emoji, label, score, is_custom, sort_order) VALUES
  ('😄','매우 행복', 10, false, 1),
  ('😊','행복',      8,  false, 2),
  ('🙂','좋음',      7,  false, 3),
  ('🥰','설렘',      9,  false, 4),
  ('😐','보통',      5,  false, 5),
  ('😑','무감각',    4,  false, 6),
  ('😴','피곤',      3,  false, 7),
  ('😔','우울',      3,  false, 8),
  ('😢','슬픔',      2,  false, 9),
  ('🤒','아픔',      2,  false, 10),
  ('😤','짜증',      3,  false, 11),
  ('😡','화남',      1,  false, 12);
