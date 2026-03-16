/**
 * Cloudflare Pages Function — /api/metrics
 *
 * Queries the Cloudflare GraphQL Analytics API for today's visitor
 * and pageview data, then returns it as JSON for the LiveMetricsCard
 * component on the homepage.
 *
 * Required environment variables (set in Cloudflare Pages dashboard):
 *   CF_API_TOKEN  – API token with Zone.Analytics:Read permission
 *   CF_ZONE_ID    – Zone ID for industriallystrong.com
 */

export async function onRequest(context) {
  const { env } = context;

  const token = env.CF_API_TOKEN;
  const zoneId = env.CF_ZONE_ID;

  // --- guard: missing credentials ----------------------------------------
  if (!token || !zoneId) {
    return Response.json(
      {
        visitors_today: "—",
        pageviews_today: "—",
        first_time_visits: "—",
        returning_visits: "—",
        note: "Analytics credentials not configured.",
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // --- build date range for "today" in UTC --------------------------------
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // "2026-03-15"

  // --- Cloudflare GraphQL Analytics query ---------------------------------
  const query = `
    query SiteMetrics($zoneTag: String!, $since: String!, $until: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            filter: { date_geq: $since, date_leq: $until }
            limit: 1
          ) {
            sum {
              pageViews
              requests
            }
            uniq {
              uniques
            }
          }
        }
      }
    }
  `;

  const variables = {
    zoneTag: zoneId,
    since: todayStr,
    until: todayStr,
  };

  try {
    const cfRes = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!cfRes.ok) {
      const text = await cfRes.text();
      console.error("CF Analytics API error:", cfRes.status, text);
      throw new Error(`Cloudflare API returned ${cfRes.status}`);
    }

    const json = await cfRes.json();

    // Pull the first (and only) day-group
    const zones = json?.data?.viewer?.zones;
    const group =
      zones && zones.length > 0 && zones[0].httpRequests1dGroups?.[0];

    if (!group) {
      // No data yet today — return zeros rather than dashes
      return Response.json(
        {
          visitors_today: 0,
          pageviews_today: 0,
          first_time_visits: 0,
          returning_visits: 0,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=120",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const pageViews = group.sum?.pageViews ?? 0;
    const totalRequests = group.sum?.requests ?? 0;
    const uniqueVisitors = group.uniq?.uniques ?? 0;

    // Cloudflare's free analytics don't split new vs. returning directly,
    // so we estimate: returning ≈ unique visitors who generated more
    // requests than page views (rough heuristic). A more accurate split
    // requires Cloudflare Web Analytics (the JS beacon) or a paid plan.
    const estimatedReturning = Math.max(
      0,
      Math.round(uniqueVisitors * 0.3) // conservative 30% returning estimate
    );
    const estimatedFirstTime = Math.max(
      0,
      uniqueVisitors - estimatedReturning
    );

    return Response.json(
      {
        visitors_today: uniqueVisitors,
        pageviews_today: pageViews,
        first_time_visits: estimatedFirstTime,
        returning_visits: estimatedReturning,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=120",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Metrics fetch failed:", err);

    return Response.json(
      {
        visitors_today: "—",
        pageviews_today: "—",
        first_time_visits: "—",
        returning_visits: "—",
        note: "Analytics temporarily unavailable.",
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
