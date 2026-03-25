-- D1 schema for industriallystrong.com telemetry
-- Apply with: wrangler d1 execute is-telemetry --file=./schema.sql

CREATE TABLE IF NOT EXISTS pageviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT    NOT NULL DEFAULT 'pageview',   -- pageview | event | engagement
  site       TEXT    NOT NULL,
  ts         INTEGER NOT NULL,                      -- client epoch ms
  session_id TEXT    NOT NULL,
  visitor_id TEXT    NOT NULL,
  page_id    TEXT    NOT NULL,
  path       TEXT    NOT NULL,
  title      TEXT    NOT NULL DEFAULT '',
  referrer   TEXT    NOT NULL DEFAULT '',
  viewport_w INTEGER NOT NULL DEFAULT 0,
  viewport_h INTEGER NOT NULL DEFAULT 0,
  ua         TEXT    NOT NULL DEFAULT '',
  meta       TEXT    NOT NULL DEFAULT '{}',          -- JSON blob for flexible fields
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Fast lookups by date range + site
CREATE INDEX IF NOT EXISTS idx_pageviews_site_ts   ON pageviews (site, ts);
-- Unique visitor / session queries
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor    ON pageviews (visitor_id, ts);
CREATE INDEX IF NOT EXISTS idx_pageviews_session    ON pageviews (session_id, ts);
-- Path-level analytics
CREATE INDEX IF NOT EXISTS idx_pageviews_path       ON pageviews (site, path, ts);
-- Type filtering (engagement heartbeats vs pageviews)
CREATE INDEX IF NOT EXISTS idx_pageviews_type       ON pageviews (type, ts);
