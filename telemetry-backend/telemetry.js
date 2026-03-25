// telemetry.js
// Drop-in client telemetry for human-focused page analytics.
// Designed for static/SPA sites (Vite/React friendly), with bot filtering,
// self-session exclusion, route-based pageview tracking, and safe transport.
//
// Expected backend endpoint: POST /api/telemetry
// Payload example:
// {
//   type: "pageview",
//   site: "industriallystrong.com",
//   ts: 1711200000000,
//   sessionId: "...",
//   visitorId: "...",
//   pageId: "...",
//   path: "/lab",
//   title: "Lab",
//   referrer: "https://www.linkedin.com/...",
//   viewport: { w: 1440, h: 900 },
//   ua: "...",
//   meta: { ... }
// }

const DEFAULT_CONFIG = {
  endpoint: "/api/telemetry",
  site:
    typeof window !== "undefined" ? window.location.hostname : "unknown-site",
  debug: false,

  // Prevent counting internal development work and local testing.
  ignoreLocalhost: true,
  ignoreCookieName: "ignoreMetrics",
  ignoreLocalStorageKey: "ignoreMetrics",

  // Respect browser privacy signals
  respectDNT: true,
  respectGPC: true,

  // Session / visitor persistence
  sessionStorageKey: "is_telemetry_session_id",
  visitorStorageKey: "is_telemetry_visitor_id",

  // Page dedupe
  lastTrackedPathKey: "is_telemetry_last_path",
  lastTrackedAtKey: "is_telemetry_last_at",
  dedupeWindowMs: 1500,

  // Optional engagement heartbeat
  heartbeatEnabled: false,
  heartbeatIntervalMs: 30000,
  heartbeatMinVisibleMs: 15000,

  // Basic bot filtering
  botUserAgentRegex:
    /bot|crawl|crawler|spider|slurp|bingpreview|headless|preview|facebookexternalhit|linkedinbot|embedly|quora link preview|pinterest|slackbot|discordbot|whatsapp|telegrambot|applebot|googlebot|adsbot|ahrefsbot|semrushbot|mj12bot|petalbot|claudebot|gptbot|chatgpt-user|perplexitybot|bytespider/i,
};

function now() {
  return Date.now();
}

function randomId(prefix = "") {
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  return prefix ? `${prefix}_${rand}` : rand;
}

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value, days = 3650) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function removeCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function storageGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // ignore quota/privacy issues
  }
}

function isLocalhost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function isBotUserAgent(regex) {
  if (typeof navigator === "undefined") return false;
  return regex.test(navigator.userAgent || "");
}

function currentPath() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function browserRequestsPrivacy(config) {
  if (typeof navigator === "undefined") return false;
  if (config.respectGPC && navigator.globalPrivacyControl) return true;
  if (config.respectDNT && navigator.doNotTrack === "1") return true;
  return false;
}

function buildBasePayload(config) {
  return {
    site: config.site,
    ts: now(),
    path: currentPath(),
    title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    ua: typeof navigator !== "undefined" ? navigator.userAgent || "" : "",
    viewport:
      typeof window !== "undefined"
        ? { w: window.innerWidth || 0, h: window.innerHeight || 0 }
        : { w: 0, h: 0 },
  };
}

export function createTelemetry(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  let started = false;
  let heartbeatTimer = null;
  // SSR-safe: guard document access
  let visibleSince =
    typeof document !== "undefined" && document.visibilityState === "visible"
      ? now()
      : null;

  // Stable pageId: set once per tracked route, reused by engagement events.
  let currentPageId = null;

  function log(...args) {
    if (config.debug) console.log("[telemetry]", ...args);
  }

  function isIgnored() {
    if (config.ignoreLocalhost && isLocalhost()) return true;
    if (readCookie(config.ignoreCookieName) === "true") return true;
    if (
      typeof localStorage !== "undefined" &&
      storageGet(localStorage, config.ignoreLocalStorageKey) === "true"
    ) {
      return true;
    }
    return false;
  }

  function isEligibleHuman() {
    if (typeof window === "undefined") return false;
    if (isIgnored()) return false;
    if (isBotUserAgent(config.botUserAgentRegex)) return false;
    if (browserRequestsPrivacy(config)) return false;
    return true;
  }

  function getVisitorId() {
    if (typeof localStorage === "undefined") return randomId("v");
    let id = storageGet(localStorage, config.visitorStorageKey);
    if (!id) {
      id = randomId("v");
      storageSet(localStorage, config.visitorStorageKey, id);
    }
    return id;
  }

  function getSessionId() {
    if (typeof sessionStorage === "undefined") return randomId("s");
    let id = storageGet(sessionStorage, config.sessionStorageKey);
    if (!id) {
      id = randomId("s");
      storageSet(sessionStorage, config.sessionStorageKey, id);
    }
    return id;
  }

  function shouldTrackPath(path) {
    const lastPath =
      typeof sessionStorage !== "undefined"
        ? storageGet(sessionStorage, config.lastTrackedPathKey)
        : null;
    const lastAtRaw =
      typeof sessionStorage !== "undefined"
        ? storageGet(sessionStorage, config.lastTrackedAtKey)
        : null;
    const lastAt = lastAtRaw ? Number(lastAtRaw) : 0;

    if (lastPath !== path) return true;
    if (!lastAt) return true;
    return now() - lastAt > config.dedupeWindowMs;
  }

  function markTrackedPath(path) {
    if (typeof sessionStorage === "undefined") return;
    storageSet(sessionStorage, config.lastTrackedPathKey, path);
    storageSet(sessionStorage, config.lastTrackedAtKey, String(now()));
  }

  function transport(payload) {
    const body = JSON.stringify(payload);

    // Prefer sendBeacon for unload/navigation safety.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: "application/json" });
        const ok = navigator.sendBeacon(config.endpoint, blob);
        if (ok) {
          log("sent via beacon", payload);
          return;
        }
      } catch {
        // fall through to fetch
      }
    }

    fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch((err) => {
      log("transport failed", err);
    });
  }

  function emit(type, meta = {}) {
    if (!isEligibleHuman()) {
      log("ignored:", {
        ignored: isIgnored(),
        bot: isBotUserAgent(config.botUserAgentRegex),
        privacy: browserRequestsPrivacy(config),
      });
      return false;
    }

    const payload = {
      type,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      pageId: currentPageId || randomId("p"),
      ...buildBasePayload(config),
      meta,
    };

    transport(payload);
    return true;
  }

  function trackPageview(meta = {}) {
    if (typeof document === "undefined" || typeof window === "undefined")
      return false;

    if (document.visibilityState !== "visible") {
      log("pageview skipped: document not visible");
      return false;
    }

    const path = currentPath();
    if (!shouldTrackPath(path)) {
      log("pageview deduped:", path);
      return false;
    }

    // Mint a new stable pageId for this route.
    currentPageId = randomId("p");

    markTrackedPath(path);
    return emit("pageview", meta);
  }

  function trackEvent(name, meta = {}) {
    return emit("event", { name, ...meta });
  }

  function trackEngagement(meta = {}) {
    return emit("engagement", meta);
  }

  // ── Visibility handling ───────────────────────────────────────────

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      visibleSince = now();
      return;
    }
    // On hide, optionally record an engagement event if enough visible time elapsed.
    if (
      config.heartbeatEnabled &&
      visibleSince &&
      now() - visibleSince >= config.heartbeatMinVisibleMs
    ) {
      trackEngagement({
        kind: "visible_segment",
        visibleMs: now() - visibleSince,
      });
    }
    visibleSince = null;
  }

  // Named reference so stop() can remove it.
  function handlePageHide() {
    if (
      config.heartbeatEnabled &&
      visibleSince &&
      document.visibilityState === "hidden"
    ) {
      trackEngagement({
        kind: "pagehide",
        visibleMs: now() - visibleSince,
      });
    }
  }

  // ── SPA history patching ──────────────────────────────────────────

  function patchHistoryForSpa() {
    if (typeof window === "undefined") return () => {};

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    function wrapped(methodName, original) {
      return function patchedHistoryMethod(...args) {
        const prevPath = currentPath();
        const result = original.apply(this, args);

        // Delay slightly so title/location updates settle.
        // Only fire if the path actually changed (avoids replaceState noise).
        setTimeout(() => {
          if (currentPath() !== prevPath) {
            trackPageview({ source: methodName });
          }
        }, 0);

        return result;
      };
    }

    window.history.pushState = wrapped("pushState", originalPushState);
    window.history.replaceState = wrapped("replaceState", originalReplaceState);

    const onPopState = () => trackPageview({ source: "popstate" });
    window.addEventListener("popstate", onPopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", onPopState);
    };
  }

  // ── Heartbeat ─────────────────────────────────────────────────────

  function startHeartbeat() {
    if (!config.heartbeatEnabled || heartbeatTimer) return;
    heartbeatTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (!visibleSince) visibleSince = now();
      const visibleMs = now() - visibleSince;
      if (visibleMs >= config.heartbeatMinVisibleMs) {
        trackEngagement({
          kind: "heartbeat",
          visibleMs,
        });
        visibleSince = now();
      }
    }, config.heartbeatIntervalMs);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  let unpatchHistory = null;

  function start() {
    if (started || typeof window === "undefined") return;
    started = true;

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });
    window.addEventListener("pagehide", handlePageHide, { passive: true });

    unpatchHistory = patchHistoryForSpa();
    startHeartbeat();

    // Initial route only once.
    trackPageview({ source: "initial" });
    log("started");
  }

  function stop() {
    if (!started || typeof window === "undefined") return;
    started = false;

    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
    stopHeartbeat();

    if (unpatchHistory) {
      unpatchHistory();
      unpatchHistory = null;
    }
    log("stopped");
  }

  function ignoreThisBrowser(enable = true) {
    if (enable) {
      writeCookie(config.ignoreCookieName, "true");
      if (typeof localStorage !== "undefined") {
        storageSet(localStorage, config.ignoreLocalStorageKey, "true");
      }
    } else {
      removeCookie(config.ignoreCookieName);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(config.ignoreLocalStorageKey);
      }
    }
  }

  function getDiagnostics() {
    return {
      eligibleHuman: isEligibleHuman(),
      ignored: isIgnored(),
      botUa: isBotUserAgent(config.botUserAgentRegex),
      privacySignal: browserRequestsPrivacy(config),
      visitorId: isEligibleHuman() ? getVisitorId() : null,
      sessionId: isEligibleHuman() ? getSessionId() : null,
      currentPageId,
      path: currentPath(),
      visibility:
        typeof document !== "undefined" ? document.visibilityState : "unknown",
    };
  }

  return {
    start,
    stop,
    trackPageview,
    trackEvent,
    trackEngagement,
    ignoreThisBrowser,
    getDiagnostics,
  };
}
