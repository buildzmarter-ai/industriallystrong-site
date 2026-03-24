/**
 * Cloudflare Pages Function — /api/metrics
 *
 * Queries the D1 telemetry database for today's visitor and pageview data,
 * then returns it as JSON for the LiveMetricsCard component on the homepage.
 *
 * Required binding (set in Cloudflare Pages dashboard → Settings → Bindings):
 *   DB  –  D1 database "is-telemetry"
 */

const ALLOWED_ORIGINS = [
  "https://industriallystrong.com",
  "https://www.industriallystrong.com",
];

export async function onRequest(context) {
  const { env, request } = context;

  // --- guard: reject non-GET requests --------------------------------------
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const origin = request.headers.get("Origin") || "";
  const isBrowser = ALLOWED_ORIGINS.some((o) => origin.startsWith(o));

  // Allow same-origin requests (no Origin header) but block foreign origins
  if (origin && !isBrowser) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- guard: missing D1 binding -------------------------------------------
  if (!env.DB) {
    return Response.json(
      {
        visitors_today: "—",
        pageviews_today: "—",
        first_time_visits: "—",
        returning_visits: "—",
        note: "D1 database not bound.",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  // --- build start-of-day timestamp in ms (UTC) ----------------------------
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).getTime();

  try {
    // All three queries run against the same D1 database in one batch.
    const [visitorsResult, pageviewsResult, returningResult] =
      await env.DB.batch([
        // Unique visitors today
        env.DB.prepare(
          `SELECT COUNT(DISTINCT visitor_id) AS cnt
             FROM pageviews
            WHERE ts >= ?`
        ).bind(startOfDay),

        // Pageviews today (only type = 'pageview', not engagement/event)
        env.DB.prepare(
          `SELECT COUNT(*) AS cnt
             FROM pageviews
            WHERE ts >= ? AND type = 'pageview'`
        ).bind(startOfDay),

        // Returning visitors: seen today AND have at least one record before today
        env.DB.prepare(
          `SELECT COUNT(DISTINCT visitor_id) AS cnt
             FROM pageviews
            WHERE ts >= ?
              AND visitor_id IN (
                SELECT DISTINCT visitor_id
                  FROM pageviews
                 WHERE ts < ?
              )`
        ).bind(startOfDay, startOfDay),
      ]);

    const visitorsToday = visitorsResult.results[0]?.cnt ?? 0;
    const pageviewsToday = pageviewsResult.results[0]?.cnt ?? 0;
    const returningVisits = returningResult.results[0]?.cnt ?? 0;
    const firstTimeVisits = Math.max(0, visitorsToday - returningVisits);

    return Response.json(
      {
        visitors_today: visitorsToday,
        pageviews_today: pageviewsToday,
        first_time_visits: firstTimeVisits,
        returning_visits: returningVisits,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=120",
          "Access-Control-Allow-Origin": "https://industriallystrong.com",
        },
      }
    );
  } catch (err) {
    console.error("D1 metrics query failed:", err);

    return Response.json(
      {
        visitors_today: "—",
        pageviews_today: "—",
        first_time_visits: "—",
        returning_visits: "—",
        note: "Analytics temporarily unavailable.",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
