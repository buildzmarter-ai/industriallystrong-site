import PageShell from "../components/PageShell";

export default function QRLPhoenix() {
  return (
    <PageShell>
      <section style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>QRLPhoenix</h1>
        <p style={{ fontSize: "20px", maxWidth: "850px", opacity: 0.9 }}>
          A multi-vertical trading intelligence platform spanning AI-assisted
          strategy discovery, seasonal spread analysis, institutional positioning
          data, and structured decision workflows — delivered as native iOS and
          web applications backed by a shared production API.
        </p>
      </section>

      <section
        style={{
          border: "1px solid #1e293b",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "32px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Platform verticals</h2>
        <p style={{ opacity: 0.88, maxWidth: "900px", marginBottom: "24px" }}>
          QRLPhoenix integrates multiple data-driven verticals into a single
          platform, each with dedicated UI surfaces, backend endpoints, and
          analytical workflows.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <VerticalCard
            title="AI Coach"
            description="Conversational strategy coaching with context-aware analysis and structured reasoning."
          />
          <VerticalCard
            title="Strategy Discovery"
            description="AI-driven discovery engine that matches trader profiles against candidate strategies."
          />
          <VerticalCard
            title="IASG CTA Rankings"
            description="Monthly CTA index rankings with pipeline-based analysis and batch evaluation."
          />
          <VerticalCard
            title="Seasonal Spreads"
            tag="New"
            description="MRCI calendar-window trade discovery with backtest statistics, year-by-year P&L, equity curves, and configurable filters."
          />
          <VerticalCard
            title="COT Positioning"
            tag="New"
            description="CFTC Commitments of Traders data across Legacy, Disaggregated, and TFF reports with signal gauges, positioning charts, and weekly data."
          />
          <VerticalCard
            title="Decision Ledger"
            description="Blockchain-anchored audit trail for strategy decisions, providing verifiable reasoning provenance."
          />
        </div>
      </section>

      <section
        style={{
          border: "1px solid #1e293b",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "32px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>System architecture</h2>
        <p style={{ opacity: 0.88, maxWidth: "900px" }}>
          The platform combines a SwiftUI client, a React web application, a
          Railway-hosted FastAPI backend with 20+ endpoints, and research
          infrastructure for deeper strategy exploration.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <ArchCard title="iOS client" text="SwiftUI application with 8-tab layout, Swift Charts, and injectable networking." />
          <ArchCard title="Web client" text="React SPA on Cloudflare Pages — full feature parity with the iOS surface." />
          <ArchCard title="Backend" text="FastAPI on Railway — spreads engine, COT fetcher, IASG proxy, coach, and discovery endpoints." />
          <ArchCard title="Data sources" text="MRCI seasonal database, CFTC SODA API, IASG rankings, DataBento market data." />
          <ArchCard title="AI analysis" text="Claude-powered coaching, strategy evaluation, and agentic discovery workflows." />
          <ArchCard title="Research layer" text="State resolution workflows and multi-hypothesis tracking for deeper exploration." />
        </div>
      </section>

      <section
        style={{
          border: "1px solid #1e293b",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "32px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Status</h2>
        <p style={{ opacity: 0.88, maxWidth: "900px" }}>
          QRLPhoenix is deployed and operational across iOS, web, and backend.
          The platform serves live data from production endpoints with 278+ tests,
          CI/CD via GitHub Actions, and continuous deployment to Railway and
          Cloudflare Pages.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
          <StatusBadge label="iOS" status="Live" />
          <StatusBadge label="Web" status="Live" />
          <StatusBadge label="Backend" status="Deployed" />
          <StatusBadge label="CI/CD" status="Green" />
          <StatusBadge label="Tests" status="278+" />
        </div>
      </section>

      <section
        style={{
          border: "1px solid #B3905C",
          borderRadius: "14px",
          padding: "28px",
          background: "rgba(179, 144, 92, 0.06)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#B3905C" }}>Launch Phoenix Web</h2>
        <p style={{ opacity: 0.88, maxWidth: "900px", marginBottom: "16px" }}>
          Access the full QRL Phoenix platform in your browser — AI coaching,
          strategy discovery, IASG CTA analysis, seasonal spreads, COT
          positioning, and blockchain-verified audit trails.
        </p>
        <a
          href="https://qrl-phoenix-web.pages.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#B3905C",
            color: "#001a36",
            padding: "12px 28px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "15px",
            textDecoration: "none",
          }}
        >
          Open Phoenix Web →
        </a>
      </section>
    </PageShell>
  );
}

function VerticalCard({ title, description, tag }) {
  return (
    <div style={{ border: "1px solid #243041", borderRadius: "12px", padding: "18px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <strong>{title}</strong>
        {tag && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
            background: "rgba(179, 144, 92, 0.15)", color: "#B3905C",
          }}>
            {tag}
          </span>
        )}
      </div>
      <p style={{ opacity: 0.8, marginBottom: 0, fontSize: "14px" }}>{description}</p>
    </div>
  );
}

function ArchCard({ title, text }) {
  return (
    <div style={{ border: "1px solid #243041", borderRadius: "12px", padding: "18px" }}>
      <strong>{title}</strong>
      <p style={{ opacity: 0.8, marginBottom: 0, fontSize: "14px" }}>{text}</p>
    </div>
  );
}

function StatusBadge({ label, status }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "6px 14px", borderRadius: "20px",
      background: "rgba(76, 175, 80, 0.1)", border: "1px solid rgba(76, 175, 80, 0.3)",
      fontSize: "13px",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF50" }} />
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ opacity: 0.7 }}>{status}</span>
    </div>
  );
}
