// Cloudflare Worker – telemetry ingestion for industriallystrong.com
// Bindings required:  D1 database bound as "DB"
//
// Accepts:  POST /api/telemetry   (JSON body, or sendBeacon blob)
// Returns:  204 on success, 400 on bad payload, 405 on wrong method

const ALLOWED_TYPES = new Set(["pageview", "event", "engagement"]);

// Lightweight bot check on the server side as a second layer.
const BOT_UA = /bot|crawl|spider|slurp|headless|preview|externalhit|linkedinbot|facebookexternalhit|discordbot|whatsapp|telegrambot|gptbot|claudebot|bytespider/i;

// Max payload size (8 KB) to reject garbage.
const MAX_BODY_BYTES = 8192;

export default {
  async fetch(request, env) {
    // ── CORS preflight ──────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    // ── Only accept POST to /api/telemetry ──────────────────────────
    const url = new URL(request.url);
    if (url.pathname !== "/api/telemetry") {
      return new Response("Not found", { status: 404 });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(request),
      });
    }

    // ── Parse body ──────────────────────────────────────────────────
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return respond(400, "Payload too large", request);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return respond(400, "Invalid JSON", request);
    }

    // ── Validate required fields ────────────────────────────────────
    const { type, site, ts, sessionId, visitorId, path } = body;

    if (!type || !ALLOWED_TYPES.has(type)) {
      return respond(400, "Invalid or missing type", request);
    }
    if (!site || typeof site !== "string") {
      return respond(400, "Missing site", request);
    }
    if (!Number.isFinite(ts) || ts < 1_600_000_000_000) {
      return respond(400, "Invalid timestamp", request);
    }
    if (!sessionId || !visitorId || !path) {
      return respond(400, "Missing required identifiers", request);
    }

    // ── Server-side bot filter ──────────────────────────────────────
    const ua = body.ua || request.headers.get("user-agent") || "";
    if (BOT_UA.test(ua)) {
      // Silently discard – return 204 so bots don't retry.
      return respond(204, null, request);
    }

    // ── Persist to D1 ───────────────────────────────────────────────
    const title    = sanitize(body.title, 512);
    const referrer = sanitize(body.referrer, 2048);
    const meta     = typeof body.meta === "object" ? JSON.stringify(body.meta) : "{}";

    const vw = body.viewport?.w ?? 0;
    const vh = body.viewport?.h ?? 0;

    try {
      await env.DB.prepare(
        `INSERT INTO pageviews
           (type, site, ts, session_id, visitor_id, page_id, path, title, referrer, viewport_w, viewport_h, ua, meta)
         VALUES
           (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          type,
          sanitize(site, 128),
          ts,
          sanitize(sessionId, 128),
          sanitize(visitorId, 128),
          sanitize(body.pageId || "", 128),
          sanitize(path, 2048),
          title,
          referrer,
          vw,
          vh,
          sanitize(ua, 512),
          meta
        )
        .run();
    } catch (err) {
      console.error("D1 insert failed:", err);
      return respond(500, "Storage error", request);
    }

    return respond(204, null, request);
  },
};

// ── Helpers ───────────────────────────────────────────────────────────

function sanitize(value, maxLen = 256) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function respond(status, body, request) {
  return new Response(body, {
    status,
    headers: corsHeaders(request),
  });
}
