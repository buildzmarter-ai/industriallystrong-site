-- Canonical telemetry schema for industriallystrong.com surfaces
-- Apply with:
-- wrangler d1 execute is-telemetry --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  app TEXT NOT NULL,
  lane TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  referrer_source TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  landing_route TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  ip_hash TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  colo TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  ts INTEGER NOT NULL,
  app TEXT NOT NULL,
  lane TEXT NOT NULL,
  route TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  event_type TEXT NOT NULL,
  referrer TEXT NOT NULL DEFAULT '',
  referrer_source TEXT NOT NULL DEFAULT '',
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  ip_hash TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  colo TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_page_views_timestamp
  ON page_views(timestamp);

CREATE INDEX IF NOT EXISTS idx_page_views_ts
  ON page_views(ts);

CREATE INDEX IF NOT EXISTS idx_page_views_app
  ON page_views(app);

CREATE INDEX IF NOT EXISTS idx_page_views_lane
  ON page_views(lane);

CREATE INDEX IF NOT EXISTS idx_page_views_route
  ON page_views(route);

CREATE INDEX IF NOT EXISTS idx_page_views_event_type
  ON page_views(event_type);

CREATE INDEX IF NOT EXISTS idx_page_views_referrer_source
  ON page_views(referrer_source);

CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id
  ON page_views(visitor_id);

CREATE INDEX IF NOT EXISTS idx_page_views_session_id
  ON page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id
  ON sessions(visitor_id);

CREATE INDEX IF NOT EXISTS idx_sessions_last_seen_at
  ON sessions(last_seen_at);
