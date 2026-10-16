import { sendTelemetry } from "../utils/telemetry";

export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e293b",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "28px 32px 40px 32px",
          opacity: 0.72,
          fontSize: "14px",
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: 600 }}>
          IndustriallyStrong
        </div>
        <div>
          Zahirudeen Premji. Governance AI, lithography and EUV, finance state
          resolution, and the apps I build myself.
        </div>
        <div style={{ marginTop: "8px" }}>
          One discipline across all of them: keep the record correct when the
          parts underneath it change.
        </div>
        <div
          style={{
            marginTop: "16px",
            fontSize: "11px",
            opacity: 0.35,
            letterSpacing: "0.04em",
          }}
        >
          <a
            href="https://z.industriallystrong.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              borderBottom: "1px dotted currentColor",
              paddingBottom: "1px",
              transition: "opacity 0.3s",
            }}
            onClick={() =>
              sendTelemetry({
                app: "industriallystrong",
                lane: window.location.pathname === "/correctness" ? "storage" : "general",
                eventType: "outbound_click",
                metadata: {
                  label: "leadership_stories",
                  href: "https://z.industriallystrong.com",
                  section: "site_footer",
                },
              })
            }
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "inherit")}
          >
            Leadership Stories
          </a>
        </div>
      </div>
    </footer>
  );
}
