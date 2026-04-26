/**
 * Cloudflare Pages Function — /api/telemetry
 *
 * Receives telemetry POSTs from src/utils/telemetry.js (sendTelemetry) on
 * the apex industriallystrong.com origin. Inserts each event into the same
 * D1 database / table that /api/metrics queries, so metrics counts surface
 * the events posted here.
 *
 * Required binding (set in Cloudflare Pages → Settings → Bindings):
 *   DB  –  D1 database "is-telemetry"
 *
 * Method matrix
 * -------------
 *   OPTIONS  → 204 with same-origin CORS headers (preflight friendly)
 *   GET      → 200 JSON health envelope
 *                { ok: true, endpoint: "/api/telemetry", accepts: ["POST"], db_bound: boolean }
 *   POST     → parse JSON, normalize, INSERT into pageviews, return JSON
 *                success → { ok: true, inserted: true }
 *                failure → { ok: false, error, detail }
 *   other    → 405 JSON
 *
 * Schema doctrine
 * ---------------
 * The `pageviews` table is shared with /api/metrics (which queries:
 *   SELECT COUNT(DISTINCT visitor_id) FROM pageviews WHERE ts >= ?
 *   SELECT COUNT(*)                  FROM pageviews WHERE ts >= ? AND type = 'pageview'
 *   SELECT DISTINCT visitor_id ...
 * ). So at minimum the columns `ts`, `type`, `visitor_id` must exist.
 *
 * This function attempts the FULL column set first
 * (ts, type, app, lane, route, title, referrer, referrer_source,
 * session_id, visitor_id, utm_source, utm_medium, utm_campaign,
 * utm_content, metadata). If D1 rejects it as a schema mismatch
 * ("no such column" / "table pageviews has no column ..."), the function
 * runs PRAGMA table_info(pageviews) once and retries the INSERT against
 * exactly the columns that exist. No column is guessed beyond what
 * PRAGMA reports.
 *
 * Frontend payload (src/utils/telemetry.js sendTelemetry):
 *   app, lane, event_type, route, title,
 *   referrer, referrer_source,
 *   session_id, visitor_id,
 *   metadata (object — stored as JSON string),
 *   utm_source, utm_medium, utm_campaign, utm_content
 *
 * NOTE: the frontend sends `event_type`. We map it to the `type` column
 * because metrics.js filters on `type = 'pageview'`.
 */

const ALLOWED_ORIGINS = [
  "https://industriallystrong.com",
  "https://www.industriallystrong.com",
];

// Full column set, in INSERT order. Aligned with the ACTUAL D1 schema
// of the `pageviews` table (verified via wrangler `PRAGMA table_info`):
//
//   id (PK auto), type, site, ts, session_id, visitor_id, page_id,
//   path, title, referrer, viewport_w, viewport_h, ua, meta, created_at
//
// Mappings from the frontend payload (src/utils/telemetry.js):
//   event_type     → type         (matches metrics.js type='pageview' query)
//   route          → path
//   metadata       → meta         (JSON string; folds in orphan fields below)
//   referrer       → referrer
//   session_id     → session_id
//   visitor_id     → visitor_id
//   title          → title
//
// Server-side derived:
//   ts          = Date.now()                    (ms epoch UTC)
//   site        = new URL(request.url).hostname (e.g. "industriallystrong.com")
//   page_id     = "p_" + crypto.randomUUID()    (per-event unique key)
//   ua          = request.headers.get("User-Agent")
//   viewport_w  = metadata.viewport_w (number) if present
//   viewport_h  = metadata.viewport_h (number) if present
//
// Orphan frontend fields with no schema column (app, lane, referrer_source,
// utm_source/medium/campaign/content) are folded into the `meta` JSON so
// no telemetry data is lost.
//
// `id` and `created_at` are NOT in this list because D1 fills them
// automatically (autoincrement PK + DEFAULT CURRENT_TIMESTAMP).
const FULL_COLUMNS = [
  "type",
  "site",
  "ts",
  "session_id",
  "visitor_id",
  "page_id",
  "path",
  "title",
  "referrer",
  "viewport_w",
  "viewport_h",
  "ua",
  "meta",
];

function buildCorsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : "https://industriallystrong.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function jsonResponse(body, init = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...(init.headers || {}),
  };
  return new Response(JSON.stringify(body), { ...init, headers });
}

function isOriginAllowed(origin) {
  if (!origin) return true; // same-origin requests have no Origin header
  return ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
}

function normalizePayload(raw, request) {
  // All fields default to safe empty values so the INSERT never throws on
  // missing keys. Numbers stay numeric; objects become JSON strings;
  // everything else is coerced to string.
  const safeStr = (v) => (v == null ? "" : String(v));
  const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Frontend metadata is an object: { ...userMetadata, viewport_w, viewport_h }.
  // We extract viewport_w/h for first-class columns, then fold the orphan
  // frontend fields (app, lane, referrer_source, utm_*) into the surviving
  // `meta` JSON column so no data is silently dropped.
  const fmeta = raw.metadata && typeof raw.metadata === "object" && !Array.isArray(raw.metadata)
    ? raw.metadata
    : {};

  const viewport_w = safeNum(fmeta.viewport_w);
  const viewport_h = safeNum(fmeta.viewport_h);

  // Build the meta JSON: original frontend metadata (minus the viewport
  // fields we promoted to columns) + orphan top-level fields that have no
  // schema column.
  const { viewport_w: _vw, viewport_h: _vh, ...metaRest } = fmeta;
  const metaPayload = {
    ...metaRest,
    app: raw.app || undefined,
    lane: raw.lane || undefined,
    referrer_source: raw.referrer_source || undefined,
    utm_source: raw.utm_source || undefined,
    utm_medium: raw.utm_medium || undefined,
    utm_campaign: raw.utm_campaign || undefined,
    utm_content: raw.utm_content || undefined,
  };
  // Strip undefined keys so JSON.stringify produces clean output.
  for (const k of Object.keys(metaPayload)) {
    if (metaPayload[k] === undefined) delete metaPayload[k];
  }

  // Server-side derivations.
  let site = "";
  try {
    site = new URL(request.url).hostname || "";
  } catch {
    site = "";
  }
  const ua = request.headers.get("User-Agent") || "";
  const page_id = (() => {
    try {
      return "p_" + crypto.randomUUID();
    } catch {
      return "p_" + Math.random().toString(36).slice(2);
    }
  })();

  return {
    type: safeStr(raw.event_type || "pageview"),
    site: safeStr(site),
    ts: Date.now(),
    session_id: safeStr(raw.session_id),
    visitor_id: safeStr(raw.visitor_id),
    page_id,
    path: safeStr(raw.route),
    title: safeStr(raw.title),
    referrer: safeStr(raw.referrer),
    viewport_w,
    viewport_h,
    ua: safeStr(ua),
    meta: JSON.stringify(metaPayload),
  };
}

function buildInsertStatement(env, columns, values) {
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT INTO pageviews (${columns.join(", ")}) VALUES (${placeholders})`;
  return env.DB.prepare(sql).bind(...values);
}

async function tryInsertFull(env, normalized) {
  const values = FULL_COLUMNS.map((col) => normalized[col]);
  await buildInsertStatement(env, FULL_COLUMNS, values).run();
}

async function inspectTableColumns(env) {
  // PRAGMA returns rows like {cid, name, type, notnull, dflt_value, pk}.
  // We only need the `name` column.
  const res = await env.DB.prepare("PRAGMA table_info(pageviews)").all();
  const rows = res?.results || [];
  return rows.map((r) => r.name).filter(Boolean);
}

async function tryInsertFiltered(env, normalized) {
  const existingCols = await inspectTableColumns(env);
  if (!existingCols.length) {
    throw new Error("pageviews table missing or PRAGMA returned no columns");
  }
  // Use only columns we have a normalized value for AND that exist in the
  // schema. No guessing.
  const usable = FULL_COLUMNS.filter((c) => existingCols.includes(c));
  if (!usable.length) {
    throw new Error(
      `pageviews schema has none of the expected columns; got [${existingCols.join(", ")}]`
    );
  }
  const values = usable.map((col) => normalized[col]);
  await buildInsertStatement(env, usable, values).run();
  return { columns_used: usable };
}

export async function onRequest(context) {
  const { env, request } = context;
  const origin = request.headers.get("Origin") || "";
  const corsHeaders = buildCorsHeaders(origin);

  // ─── OPTIONS preflight ───────────────────────────────────────────────────
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store",
      },
    });
  }

  // ─── Same-origin enforcement (mirrors metrics.js) ────────────────────────
  if (!isOriginAllowed(origin)) {
    return jsonResponse(
      { ok: false, error: "Forbidden", detail: "origin not allowed" },
      { status: 403, headers: corsHeaders }
    );
  }

  // ─── GET health envelope ─────────────────────────────────────────────────
  if (request.method === "GET") {
    return jsonResponse(
      {
        ok: true,
        endpoint: "/api/telemetry",
        accepts: ["POST"],
        db_bound: Boolean(env.DB),
      },
      { status: 200, headers: corsHeaders }
    );
  }

  // ─── 405 for non-POST/non-GET ────────────────────────────────────────────
  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, error: "Method not allowed", detail: `method=${request.method}` },
      {
        status: 405,
        headers: { ...corsHeaders, Allow: "GET, POST, OPTIONS" },
      }
    );
  }

  // ─── POST: D1 binding required ───────────────────────────────────────────
  if (!env.DB) {
    return jsonResponse(
      { ok: false, error: "Storage unavailable", detail: "D1 binding env.DB not configured" },
      { status: 503, headers: corsHeaders }
    );
  }

  // ─── POST: parse JSON safely ─────────────────────────────────────────────
  let raw;
  try {
    raw = await request.json();
  } catch (err) {
    return jsonResponse(
      { ok: false, error: "Invalid JSON", detail: String(err?.message || err) },
      { status: 400, headers: corsHeaders }
    );
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return jsonResponse(
      { ok: false, error: "Invalid payload", detail: "expected JSON object" },
      { status: 400, headers: corsHeaders }
    );
  }

  const normalized = normalizePayload(raw, request);

  // ─── POST: insert with PRAGMA-driven fallback ────────────────────────────
  try {
    await tryInsertFull(env, normalized);
    return jsonResponse({ ok: true, inserted: true }, { status: 200, headers: corsHeaders });
  } catch (firstErr) {
    const msg = String(firstErr?.message || firstErr);
    // If the failure looks like a column / schema mismatch, fall back to
    // PRAGMA inspection and retry with the subset that actually exists.
    const looksLikeSchemaMismatch =
      /no such column|has no column|table pageviews has no column|cannot find column|near "/i.test(msg);

    if (!looksLikeSchemaMismatch) {
      console.error("telemetry insert failed (non-schema):", msg);
      return jsonResponse(
        { ok: false, error: "Insert failed", detail: msg },
        { status: 500, headers: corsHeaders }
      );
    }

    try {
      const { columns_used } = await tryInsertFiltered(env, normalized);
      return jsonResponse(
        { ok: true, inserted: true, fallback: true, columns_used },
        { status: 200, headers: corsHeaders }
      );
    } catch (secondErr) {
      const detail = String(secondErr?.message || secondErr);
      console.error("telemetry insert failed after PRAGMA fallback:", detail);
      return jsonResponse(
        {
          ok: false,
          error: "Insert failed (schema fallback also failed)",
          detail,
          first_error: msg,
        },
        { status: 500, headers: corsHeaders }
      );
    }
  }
}
