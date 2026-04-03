// Canonical telemetry worker for industriallystrong.com surfaces
// D1 binding required: env.DB

const MAX_BODY_BYTES = 8192;

const BOT_UA =
  /bot|crawl|spider|slurp|headless|preview|externalhit|linkedinbot|facebookexternalhit|discordbot|whatsapp|telegrambot|gptbot|claudebot|bytespider/i;

const ALLOWED_APPS = new Set([
  "industriallystrong",
  "gutsense-web",
  "qrl-phoenix-web",
  "dual-chain-ledger-lab",
]);

const ALLOWED_LANES = new Set([
  "general",
  "storage",
  "gut-health",
  "finance",
  "lithography",
]);

const GLOBAL_EVENT_TYPES = new Set([
  "page_view",
  "outbound_click",
  "contact_intent",
]);

const APP_EVENT_TYPES = {
  "industriallystrong": new Set([
    "lab_card_click",
    "correctness_page_view",
  ]),
  "gutsense-web": new Set([
    "food_analysis_started",
    "food_analysis_completed",
    "barcode_scan_started",
    "barcode_scan_success",
    "history_viewed",
    "feedback_submitted",
    "provider_selected",
    "profile_updated",
  ]),
  "qrl-phoenix-web": new Set([
    "strategy_builder_opened",
    "strategy_saved",
    "rankings_viewed",
    "credential_validation_started",
    "credential_validation_success",
  ]),
  "dual-chain-ledger-lab": new Set([
    "demo_started",
    "demo_completed",
    "proof_viewed",
    "artifact_downloaded",
  ]),
};

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request),
        });
      }

      if (url.pathname === "/api/telemetry/health" && request.method === "GET") {
        return jsonResponse(
          {
            ok: true,
            service: "is-telemetry",
            timestamp: new Date().toISOString(),
          },
          200,
          request
        );
      }

      if (url.pathname === "/api/telemetry/summary" && request.method === "GET") {
        return await handleSummary(request, env);
      }

      if (url.pathname === "/api/telemetry" && request.method === "POST") {
        return await handleTelemetryPost(request, env);
      }

      return jsonResponse({ ok: false, error: "not_found" }, 404, request);
    } catch (err) {
      console.error("Unhandled worker error:", err);
      return jsonResponse(
        {
          ok: false,
          error: "internal_error",
          message: err?.message || "Unexpected error",
        },
        500,
        request
      );
    }
  },
};

async function handleTelemetryPost(request, env) {
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "payload_too_large" }, 400, request);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400, request);
  }

  const normalized = await normalizePayload(body, request);

  if (!normalized.ok) {
    return jsonResponse(
      { ok: false, error: "validation_error", details: normalized.details },
      400,
      request
    );
  }

  const event = normalized.event;

  if (BOT_UA.test(event.user_agent)) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  try {
    await upsertSession(env.DB, event);
    await insertPageView(env.DB, event);
  } catch (err) {
    console.error("D1 write failed:", err);
    return jsonResponse({ ok: false, error: "storage_error" }, 500, request);
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

async function handleSummary(request, env) {
  const url = new URL(request.url);
  const hours = clampInt(url.searchParams.get("hours"), 24, 1, 24 * 30);
  const app = safeString(url.searchParams.get("app"), 64);
  const sinceMs = Date.now() - hours * 60 * 60 * 1000;
  const sinceIso = new Date(sinceMs).toISOString();

  const useAppFilter = Boolean(app);
  const params = useAppFilter ? [sinceIso, app] : [sinceIso];

  const totalStmt = env.DB.prepare(
    `SELECT COUNT(*) AS count
     FROM page_views
     WHERE timestamp >= ?${useAppFilter ? " AND app = ?" : ""}`
  ).bind(...params);

  const uniqueStmt = env.DB.prepare(
    `SELECT COUNT(DISTINCT visitor_id) AS count
     FROM page_views
     WHERE timestamp >= ?${useAppFilter ? " AND app = ?" : ""}`
  ).bind(...params);

  const sourcesStmt = env.DB.prepare(
    `SELECT referrer_source, COUNT(*) AS count
     FROM page_views
     WHERE timestamp >= ?${useAppFilter ? " AND app = ?" : ""}
     GROUP BY referrer_source
     ORDER BY count DESC
     LIMIT 10`
  ).bind(...params);

  const appsStmt = env.DB.prepare(
    `SELECT app, COUNT(*) AS count
     FROM page_views
     WHERE timestamp >= ?
     GROUP BY app
     ORDER BY count DESC
     LIMIT 10`
  ).bind(sinceIso);

  const routesStmt = env.DB.prepare(
    `SELECT route, COUNT(*) AS count
     FROM page_views
     WHERE timestamp >= ?${useAppFilter ? " AND app = ?" : ""}
     GROUP BY route
     ORDER BY count DESC
     LIMIT 10`
  ).bind(...params);

  const returningStmt = env.DB.prepare(
    `SELECT COUNT(DISTINCT pv.visitor_id) AS count
     FROM page_views pv
     WHERE pv.timestamp >= ?${useAppFilter ? " AND pv.app = ?" : ""}
       AND EXISTS (
         SELECT 1
         FROM page_views older
         WHERE older.visitor_id = pv.visitor_id
           AND older.timestamp < ?
       )`
  ).bind(...(useAppFilter ? [sinceIso, app, sinceIso] : [sinceIso, sinceIso]));

  const [total, unique, sources, apps, routes, returning] = await Promise.all([
    totalStmt.first(),
    uniqueStmt.first(),
    sourcesStmt.all(),
    appsStmt.all(),
    routesStmt.all(),
    returningStmt.first(),
  ]);

  return jsonResponse(
    {
      ok: true,
      window_hours: hours,
      filter_app: app || null,
      summary: {
        total_events: total?.count || 0,
        unique_visitors: unique?.count || 0,
        returning_visitors: returning?.count || 0,
      },
      top_sources: sources?.results || [],
      top_apps: apps?.results || [],
      top_routes: routes?.results || [],
    },
    200,
    request
  );
}

async function normalizePayload(body, request) {
  const userAgent = safeString(body.ua || request.headers.get("user-agent") || "", 1024);
  const clientIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    "";

  const ipHash = await sha256Hex(clientIp || "");
  const country = safeString(request.cf?.country || "", 16);
  const colo = safeString(request.cf?.colo || "", 16);
  const city = safeString(request.cf?.city || "", 128);

  if (isLegacyPayload(body)) {
    const typeMap = {
      pageview: "page_view",
      event: "outbound_click",
      engagement: "engagement",
    };

    const eventType = typeMap[body.type] || "page_view";
    const route = normalizeRoute(body.path);
    const referrer = safeString(body.referrer, 2048);
    const referrerSource = normalizeReferrer(referrer);
    const metadata = typeof body.meta === "object" && body.meta !== null ? body.meta : {};
    const site = safeString(body.site, 128);

    const event = {
      timestamp: new Date(body.ts).toISOString(),
      ts: body.ts,
      app: mapLegacySiteToApp(site),
      lane: mapAppToLane(mapLegacySiteToApp(site)),
      route,
      title: safeString(body.title, 256),
      event_type: eventType,
      referrer,
      referrer_source: referrerSource,
      session_id: safeString(body.sessionId, 128),
      visitor_id: safeString(body.visitorId, 128),
      metadata_json: JSON.stringify({
        ...sanitizeMetadata(metadata),
        legacy_type: body.type,
        page_id: safeString(body.pageId || "", 128),
        viewport_w: Number.isFinite(body.viewport?.w) ? body.viewport.w : 0,
        viewport_h: Number.isFinite(body.viewport?.h) ? body.viewport.h : 0,
      }),
      utm_source: safeString(metadata?.utm_source, 128),
      utm_medium: safeString(metadata?.utm_medium, 128),
      utm_campaign: safeString(metadata?.utm_campaign, 256),
      utm_content: safeString(metadata?.utm_content, 256),
      user_agent: userAgent,
      ip_hash: ipHash,
      country,
      colo,
      city,
    };

    const details = validateNormalizedEvent(event, true);
    if (details.length) return { ok: false, details };
    return { ok: true, event };
  }

  const app = safeEnum(body.app, ALLOWED_APPS);
  const lane = safeEnum(body.lane, ALLOWED_LANES) || mapAppToLane(app);
  const route = normalizeRoute(body.route);
  const eventType = normalizeEventType(body.event_type, app);
  const referrer = safeString(body.referrer, 2048);
  const referrerSource = safeString(body.referrer_source, 128) || normalizeReferrer(referrer);
  const metadata = sanitizeMetadata(body.metadata);

  const event = {
    timestamp: new Date().toISOString(),
    ts: Date.now(),
    app,
    lane,
    route,
    title: safeString(body.title, 256),
    event_type: eventType,
    referrer,
    referrer_source: referrerSource,
    session_id: safeString(body.session_id, 128),
    visitor_id: safeString(body.visitor_id, 128),
    metadata_json: JSON.stringify(metadata),
    utm_source: safeString(body.utm_source || metadata?.utm_source, 128),
    utm_medium: safeString(body.utm_medium || metadata?.utm_medium, 128),
    utm_campaign: safeString(body.utm_campaign || metadata?.utm_campaign, 256),
    utm_content: safeString(body.utm_content || metadata?.utm_content, 256),
    user_agent: userAgent,
    ip_hash: ipHash,
    country,
    colo,
    city,
  };

  const details = validateNormalizedEvent(event, false);
  if (details.length) return { ok: false, details };
  return { ok: true, event };
}

function isLegacyPayload(body) {
  return Boolean(
    body &&
      typeof body === "object" &&
      "type" in body &&
      "site" in body &&
      "sessionId" in body &&
      "visitorId" in body &&
      "path" in body
  );
}

function validateNormalizedEvent(event, legacy) {
  const details = [];

  if (!event.app) details.push("Missing or invalid app");
  if (!event.route) details.push("Missing route");
  if (!event.session_id) details.push("Missing session_id");
  if (!event.visitor_id) details.push("Missing visitor_id");

  if (!legacy && !event.event_type) {
    details.push("Missing or invalid event_type");
  }

  if (legacy && !event.event_type) {
    details.push("Missing mapped event_type");
  }

  if (!Number.isFinite(event.ts) || event.ts < 1_600_000_000_000) {
    details.push("Invalid timestamp");
  }

  return details;
}

async function upsertSession(db, event) {
  await db.prepare(
    `INSERT INTO sessions (
      session_id,
      visitor_id,
      app,
      lane,
      first_seen_at,
      last_seen_at,
      referrer_source,
      referrer,
      landing_route,
      user_agent,
      ip_hash,
      country,
      colo,
      city
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      last_seen_at = excluded.last_seen_at,
      app = excluded.app,
      lane = excluded.lane,
      referrer_source = excluded.referrer_source,
      referrer = CASE
        WHEN sessions.referrer = '' THEN excluded.referrer
        ELSE sessions.referrer
      END,
      landing_route = CASE
        WHEN sessions.landing_route = '' THEN excluded.landing_route
        ELSE sessions.landing_route
      END,
      user_agent = excluded.user_agent,
      ip_hash = excluded.ip_hash,
      country = excluded.country,
      colo = excluded.colo,
      city = excluded.city`
  )
    .bind(
      event.session_id,
      event.visitor_id,
      event.app,
      event.lane,
      event.timestamp,
      event.timestamp,
      event.referrer_source,
      event.referrer,
      event.route,
      event.user_agent,
      event.ip_hash,
      event.country,
      event.colo,
      event.city
    )
    .run();
}

async function insertPageView(db, event) {
  await db.prepare(
    `INSERT INTO page_views (
      timestamp,
      ts,
      app,
      lane,
      route,
      title,
      event_type,
      referrer,
      referrer_source,
      session_id,
      visitor_id,
      metadata_json,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      user_agent,
      ip_hash,
      country,
      colo,
      city
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      event.timestamp,
      event.ts,
      event.app,
      event.lane,
      event.route,
      event.title,
      event.event_type,
      event.referrer,
      event.referrer_source,
      event.session_id,
      event.visitor_id,
      event.metadata_json,
      event.utm_source,
      event.utm_medium,
      event.utm_campaign,
      event.utm_content,
      event.user_agent,
      event.ip_hash,
      event.country,
      event.colo,
      event.city
    )
    .run();
}

function mapLegacySiteToApp(site) {
  const s = (site || "").toLowerCase();

  if (s.includes("gutsense")) return "gutsense-web";
  if (s.includes("phoenix") || s.includes("qrl")) return "qrl-phoenix-web";
  if (s.includes("dual-chain") || s.includes("ledger")) return "dual-chain-ledger-lab";
  return "industriallystrong";
}

function mapAppToLane(app) {
  switch (app) {
    case "gutsense-web":
      return "gut-health";
    case "qrl-phoenix-web":
      return "finance";
    case "dual-chain-ledger-lab":
      return "storage";
    case "industriallystrong":
    default:
      return "general";
  }
}

function normalizeEventType(eventType, app) {
  const value = safeString(eventType, 128);
  if (!value) return "";

  if (GLOBAL_EVENT_TYPES.has(value)) return value;
  if (APP_EVENT_TYPES[app]?.has(value)) return value;

  return "";
}

function normalizeReferrer(referrer) {
  if (!referrer) return "direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("google.")) return "google";
    if (host.includes("chatgpt.com")) return "chatgpt";
    if (host.includes("bing.com")) return "bing";
    if (host.includes("x.com") || host.includes("twitter.com")) return "x";
    if (host.includes("facebook.com")) return "facebook";
    if (host.includes("reddit.com")) return "reddit";
    if (host.includes("github.com")) return "github";

    return host || "unknown";
  } catch {
    return "unknown";
  }
}

function normalizeRoute(route) {
  const value = safeString(route, 512);
  if (!value) return "";

  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    return url.pathname || "/";
  } catch {
    return `/${value.replace(/^\/+/, "")}`;
  }
}

function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const result = {};
  for (const [key, value] of Object.entries(metadata)) {
    const k = safeString(key, 128);
    if (!k) continue;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      result[k] = typeof value === "string" ? safeString(value, 512) : value;
    } else if (Array.isArray(value)) {
      result[k] = value.slice(0, 50).map((item) => {
        if (
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean" ||
          item === null
        ) {
          return typeof item === "string" ? safeString(item, 256) : item;
        }
        return "[complex]";
      });
    } else {
      result[k] = "[object]";
    }
  }

  return result;
}

function safeString(value, maxLen = 256) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.slice(0, maxLen);
}

function safeEnum(value, allowedSet) {
  const s = safeString(value, 128);
  return allowedSet.has(s) ? s : "";
}

function clampInt(value, fallback, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input || "");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(payload, status, request) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request),
    },
  });
}
