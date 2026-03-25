// main.jsx – React/Vite entry with telemetry integration
// Drop this in as your app entry point.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTelemetry } from "./telemetry";

const telemetry = createTelemetry({
  endpoint: "/api/telemetry",
  site: "industriallystrong.com",
  debug: false,
  heartbeatEnabled: true,
  heartbeatIntervalMs: 30000,
  heartbeatMinVisibleMs: 15000,
});

telemetry.start();

// Expose for console diagnostics:  IS_TELEMETRY.getDiagnostics()
window.IS_TELEMETRY = telemetry;

// ── Event helpers ───────────────────────────────────────────────────
// Wire these into your onClick / onNavigate handlers as needed.
//
//   Navigation clicks:
//     telemetry.trackEvent("nav_click", { target: "architecture" });
//     telemetry.trackEvent("nav_click", { target: "lab" });
//     telemetry.trackEvent("nav_click", { target: "research" });
//
//   Artifact opens:
//     telemetry.trackEvent("artifact_open", { artifact: "finance_lab" });
//     telemetry.trackEvent("artifact_open", { artifact: "multihead" });
//     telemetry.trackEvent("artifact_open", { artifact: "writer_head" });
//
//   Outbound clicks:
//     telemetry.trackEvent("outbound_click", { target: "linkedin_profile" });
//     telemetry.trackEvent("outbound_click", { target: "featured_post" });
//     telemetry.trackEvent("outbound_click", { target: "contact_email" });
//
// Export telemetry so components can import it directly:
export { telemetry };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
