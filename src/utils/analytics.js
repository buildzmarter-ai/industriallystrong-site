// Analytics event tracker.
// StatCounter integration removed; events now flow to first-party telemetry
// (src/utils/telemetry.js -> POST /api/telemetry), the same sink used for
// page views. Preserves the trackEvent(category, label) call signature used
// across the app so no call sites needed to change.
import { sendTelemetry } from "./telemetry";

export function trackEvent(category, label) {
  if (typeof window === "undefined") return;

  sendTelemetry({
    app: "industriallystrong",
    lane: window.location.pathname === "/correctness" ? "storage" : "general",
    eventType: category,
    metadata: { label },
  });
}
