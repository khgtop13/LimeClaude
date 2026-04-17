-- ============================================================
-- 02_tables.sql — 테이블 생성
-- ============================================================

-- profiles
CREATE TABLE profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username             TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL,
  avatar_url           TEXT,
  avatar_pending_url   TEXT,
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  current_emotion_id   UUID,
  status_message       TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- settings
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- approval_requests
CREATE TABLE approval_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      entity_type NOT NULL,
  entity_id        UUID NOT NULL,
  action_type      action_type NOT NULL,
  status           approval_status NOT NULL DEFAULT 'draft',
  requested_by     UUID NOT NULL REFERENCES profiles(id),
  snapshot_before  JSONB,
  snapshot_after   JSONB,
  rejection_reason TEXT,
  reviewed_by      UUID REFERENCES profiles(id),
  reviewed_at      TIMESTAMPTZ,
  cancelled_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- approval_history
CREATE TABLE approval_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES approval_requests(id),
  action     approval_action NOT NULL,
  actor_id   UUID NOT NULL REFERENCES profiles(id),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- notifications
CREATE TABLE notifications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id     UUID NOT NULL REFERENCES profiles(id),
  type             notification_type NOT NULL,
  priority         INT NOT NULL DEFAULT 6,
  title            TEXT NOT NULL,
  body             TEXT,
  entity_type      entity_type,
  entity_id        UUID,
  is_read          BOOLEAN NOT NULL DEFAULT FALSE,
  read_at          TIMESTAMPTZ,
  popup_shown_date DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- anniversaries
CREATE TABLE anniversaries (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  type               TEXT NOT NULL DEFAULT 'custom',
  reference_date     DATE,
  offset_days        INT,
  notify_before_days INT NOT NULL DEFAULT 7,
  approval_status    approval_status NOT NULL DEFAULT 'draft',
  status             item_status NOT NULL DEFAULT 'active',
  is_deleted         BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at         TIMESTAMPTZ,
  deleted_by         UUID REFERENCES profiles(id),
  created_by         UUID NOT NULL REFERENCES profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- birthdays
CREATE TABLE birthdays (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  relation           TEXT NOT NULL DEFAULT 'other',
  month              INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  day                INT NOT NULL CHECK (day BETWEEN 1 AND 31),
  notify_before_days INT NOT NULL DEFAULT 0,
  approval_status    approval_status NOT NULL DEFAULT 'approved',
  status             item_status NOT NULL DEFAULT 'active',
  is_deleted         BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at         TIMESTAMPTZ,
  deleted_by         UUID REFERENCES profiles(id),
  created_by         UUID REFERENCES profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- schedules
CREATE TABLE schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  start_date      DATE NOT NULL,
  end_date        DATE,
  is_all_day      BOOLEAN NOT NULL DEFAULT TRUE,
  start_time      TIME,
  end_time        TIME,
  is_period       BOOLEAN NOT NULL DEFAULT FALSE,
  is_recurring    BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_type recurrence_type,
  approval_status approval_status NOT NULL DEFAULT 'draft',
  status          item_status NOT NULL DEFAULT 'active',
  is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ,
  deleted_by      UUID REFERENCES profiles(id),
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- travel_plans
CREATE TABLE travel_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  description       TEXT,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  completion_status travel_completion NOT NULL DEFAULT 'planned',
  approval_status   approval_status NOT NULL DEFAULT 'draft',
  status            item_status NOT NULL DEFAULT 'active',
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ,
  deleted_by        UUID REFERENCES profiles(id),
  created_by        UUID NOT NULL REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- travel_checklists
CREATE TABLE travel_checklists (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_plan_id UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE,
  item           TEXT NOT NULL,
  is_checked     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order     INT NOT NULL DEFAULT 0,
  created_by     UUID NOT NULL REFERENCES profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- map_records
CREATE TABLE map_records (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_plan_id          UUID REFERENCES travel_plans(id),
  region_code             TEXT NOT NULL,
  country_code            TEXT NOT NULL,
  title                   TEXT NOT NULL,
  visit_start             DATE NOT NULL,
  visit_end               DATE,
  weather                 weather_type,
  comment                 TEXT,
  representative_photo_id UUID,
  approval_status         approval_status NOT NULL DEFAULT 'draft',
  status                  item_status NOT NULL DEFAULT 'active',
  is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at              TIMESTAMPTZ,
  deleted_by              UUID REFERENCES profiles(id),
  created_by              UUID NOT NULL REFERENCES profiles(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- map_record_photos
CREATE TABLE map_record_photos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_record_id     UUID NOT NULL REFERENCES map_records(id) ON DELETE CASCADE,
  storage_path      TEXT NOT NULL,
  is_representative BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order        INT NOT NULL DEFAULT 0,
  created_by        UUID NOT NULL REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- circular FK
ALTER TABLE map_records
  ADD CONSTRAINT fk_representative_photo
  FOREIGN KEY (representative_photo_id)
  REFERENCES map_record_photos(id) ON DELETE SET NULL;

-- bucket_items
CREATE TABLE bucket_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  content           TEXT,
  importance        INT NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  target_date       DATE,
  approval_status   approval_status NOT NULL DEFAULT 'draft',
  completion_status completion_status NOT NULL DEFAULT 'incomplete',
  status            item_status NOT NULL DEFAULT 'active',
  completed_at      TIMESTAMPTZ,
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ,
  deleted_by        UUID REFERENCES profiles(id),
  created_by        UUID NOT NULL REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- posts
CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  content    TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- post_photos
CREATE TABLE post_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- comments
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES comments(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- reactions
CREATE TABLE reactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type reaction_entity NOT NULL,
  entity_id   UUID NOT NULL,
  user_id     UUID NOT NULL REFERENCES profiles(id),
  type        reaction_type NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, user_id)
);

-- emotions
CREATE TABLE emotions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji      TEXT NOT NULL,
  label      TEXT NOT NULL,
  score      INT NOT NULL CHECK (score BETWEEN 1 AND 10),
  is_custom  BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles
  ADD CONSTRAINT fk_current_emotion
  FOREIGN KEY (current_emotion_id) REFERENCES emotions(id) ON DELETE SET NULL;

-- emotion_logs
CREATE TABLE emotion_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id),
  emotion_id     UUID NOT NULL REFERENCES emotions(id),
  status_message TEXT,
  logged_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  log_date       DATE NOT NULL DEFAULT CURRENT_DATE
);
