import { Link } from "react-router-dom";
import { sendTelemetry } from "../utils/telemetry";

export default function CardLink({ to, title, children }) {
  const handleClick = () => {
    sendTelemetry({
      app: "industriallystrong",
      lane: to === "/correctness" ? "storage" : "general",
      eventType: "lab_card_click",
      route: to,
      metadata: {
        label: title,
        href: to,
      },
    });
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          padding: "22px",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          background: "#0f172a",
          transition: "transform 0.18s ease, border-color 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "#334155";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "#1e293b";
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{title}</h3>
        <div style={{ opacity: 0.82 }}>{children}</div>
      </div>
    </Link>
  );
}
