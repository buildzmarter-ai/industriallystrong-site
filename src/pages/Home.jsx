import PageShell from "../components/PageShell";
import CardLink from "../components/CardLink";
import PrimaryButton from "../components/PrimaryButton";

export default function Home() {
  return (
    <PageShell>
      <div>
        {/* HERO */}
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
              marginBottom: "32px",
            }}
          >
            IndustriallyStrong connects program concepts, deployed systems,
            and research architecture across fintech, multi-agent AI,
            and advanced technical infrastructure.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <PrimaryButton href="/systems">
              View systems
            </PrimaryButton>

            <PrimaryButton href="/research">
              Explore research
            </PrimaryButton>
          </div>
        </section>

        {/* PROGRAM STRUCTURE */}
        <section className="program-structure">
          <div className="container">
            <h2 className="section-title">Program Structure</h2>
            <p className="section-subtitle">
              From foundational research to deployed systems and live demonstrations.
            </p>

            <div className="structure-grid">
              <div className="structure-card">
                <h3>Research</h3>
                <p>
                  Fundamental work on high-dimensional signal processing,
                  hypothesis tracking, and associative retrieval methods.
                </p>
                <a href="/research" className="structure-link">
                  View Research →
                </a>
              </div>

              <div className="structure-card">
                <h3>Systems</h3>
                <p>
                  Production architectures that operationalize research results,
                  including QRLPhoenix and FAISS-based inference pipelines.
                </p>
                <a href="/systems" className="structure-link">
                  View Systems →
                </a>
              </div>

              <div className="structure-card">
                <h3>Live Demonstrations</h3>
                <p>
                  Interactive deployments illustrating system behavior
                  and architectural performance in real environments.
                </p>
                <a href="https://demomhtfaiss.industriallystrong.com" className="structure-link">
                  Launch Demo →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE SYSTEMS */}
        <section style={{ padding: "72px 0" }}>
          <h2 style={{ fontSize: "34px", marginBottom: "24px" }}>
