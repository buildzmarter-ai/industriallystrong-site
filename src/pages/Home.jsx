import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <section
        style={{
          padding: "96px 0 72px 0",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: "18px",
          }}
        >
          IndustriallyStrong
        </div>

        <h1
          style={{
            fontSize: "56px",
            lineHeight: 1.05,
            margin: "0 0 20px 0",
            maxWidth: "980px",
          }}
        >
          Building AI systems, research engines, and technical platforms.
        </h1>

        <p
          style={{
            fontSize: "22px",
            lineHeight: 1.6,
            maxWidth: "900px",
            opacity: 0.9,
            marginBottom: "28px",
          }}
        >
          IndustriallyStrong connects program concepts, deployed systems, and
          research architecture across fintech, multi-agent AI, and advanced
          technical infrastructure.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link
            to="/systems"
            style={{
              padding: "12px 18px",
              border: "1px solid #334155",
              borderRadius: "10px",
              textDecoration: "none",
              color: "white",
              background: "#111827",
            }}
          >
            View systems
          </Link>

          <Link
            to="/research"
            style={{
              padding: "12px 18px",
              border: "1px solid #334155",
              borderRadius: "10px",
              textDecoration: "none",
              color: "white",
            }}
          >
            Explore research
          </Link>
        </div>
      </section>

      {/* SYSTEM CARDS */}

      <section style={{ marginTop: "72px" }}>
        <h2 style={{ marginBottom: "28px" }}>Core Systems</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
          }}
        >
          <Link
            to="/systems/qrlphoenix"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "22px",
                border: "1px solid #1e293b",
                borderRadius: "12px",
              }}
            >
              <h3>QRLPhoenix</h3>
              <p style={{ opacity: 0.8 }}>
                AI-assisted iOS strategy discovery and evaluation platform.
              </p>
            </div>
          </Link>

          <Link
            to="/systems/gutsense"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "22px",
                border: "1px solid #1e293b",
                borderRadius: "12px",
              }}
            >
              <h3>GutSense</h3>
              <p style={{ opacity: 0.8 }}>
                Multi-agent dietary intelligence using Claude, Gemini, and
                Apple Foundation Models.
              </p>
            </div>
          </Link>

          <Link
            to="/research"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "22px",
                border: "1px solid #1e293b",
                borderRadius: "12px",
              }}
            >
              <h3>MHT-FAISS Engine</h3>
              <p style={{ opacity: 0.8 }}>
                Research infrastructure for exploring large candidate strategy
                populations.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
