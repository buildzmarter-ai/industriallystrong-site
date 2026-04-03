import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendTelemetry } from "../utils/telemetry";

export default function TelemetryPageView() {
  const location = useLocation();

  useEffect(() => {
    const isCorrectness = location.pathname === "/correctness";

    sendTelemetry({
      app: "industriallystrong",
      lane: isCorrectness ? "storage" : "general",
      eventType: isCorrectness ? "correctness_page_view" : "page_view",
      route: location.pathname,
      title: document.title,
    });
  }, [location.pathname]);

  return null;
}
