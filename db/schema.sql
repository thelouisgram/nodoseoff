-- Run once against your Neon database (SQL Editor or: psql $DATABASE_URL -f db/schema.sql)

CREATE TABLE IF NOT EXISTS users (
  "userId" TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'light',
  profile_picture TEXT NOT NULL DEFAULT '',
  profile_picture_url TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS drugs (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users ("userId") ON DELETE CASCADE,
  drug TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT '',
  route TEXT NOT NULL DEFAULT '',
  start TEXT NOT NULL DEFAULT '',
  "end" TEXT NOT NULL DEFAULT '',
  time JSONB NOT NULL DEFAULT '[]'::jsonb,
  reminder BOOLEAN NOT NULL DEFAULT true,
  "drugId" TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS drugs_user_id_idx ON drugs ("userId");

CREATE TABLE IF NOT EXISTS allergies (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users ("userId") ON DELETE CASCADE,
  drug TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT '',
  route TEXT NOT NULL DEFAULT '',
  start TEXT NOT NULL DEFAULT '',
  "end" TEXT NOT NULL DEFAULT '',
  time JSONB NOT NULL DEFAULT '[]'::jsonb,
  reminder BOOLEAN NOT NULL DEFAULT true,
  "drugId" TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS allergies_user_id_idx ON allergies ("userId");

CREATE TABLE IF NOT EXISTS "completedDrugs" (
  "userId" TEXT PRIMARY KEY REFERENCES users ("userId") ON DELETE CASCADE,
  "completedDrugs" JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS "drugHistory" (
  "userId" TEXT PRIMARY KEY REFERENCES users ("userId") ON DELETE CASCADE,
  "otcDrugs" TEXT NOT NULL DEFAULT '',
  herbs TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS schedule (
  "userId" TEXT PRIMARY KEY REFERENCES users ("userId") ON DELETE CASCADE,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  "userId" TEXT,
  visitor_id TEXT,
  referrer TEXT,
  ua TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visits_created_at_idx ON visits (created_at DESC);
CREATE INDEX IF NOT EXISTS visits_path_idx ON visits (path);

CREATE TABLE IF NOT EXISTS ai_daily_usage (
  "userId" TEXT NOT NULL,
  day DATE NOT NULL,
  prompts INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId", day)
);

CREATE TABLE IF NOT EXISTS ai_chat_history (
  "userId" TEXT PRIMARY KEY,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_chats (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'New chat',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_chats_user_updated_idx ON ai_chats ("userId", updated_at DESC);

CREATE TABLE IF NOT EXISTS appointments (
  "userId" TEXT PRIMARY KEY REFERENCES users ("userId") ON DELETE CASCADE,
  doctor TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
  ON newsletter_subscribers (created_at DESC);
