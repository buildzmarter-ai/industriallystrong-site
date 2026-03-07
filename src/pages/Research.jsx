import PageShell from "../components/PageShell";

export default function Research() {
  return (
    <PageShell>
      <div>
        <section style={{ marginBottom: "60px" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>Research</h1>

          <p style={{ fontSize: "20px", maxWidth: "860px", opacity: 0.9 }}>
            Research systems and technical architectures that support deployed
            applications, strategy intelligence, and future program concepts.
          </p>
        </section>

        <section
          style={{
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "28px",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>MHT-FAISS Strategy Engine</h2>

          <p style={{ opacity: 0.88, maxWidth: "900px" }}>
            A real-time research engine for exploring large candidate
            populations of financial strategies using Multiple Hypothesis
            Tracking and FAISS-based vector search. The system supports
            interactive analysis of strategies that have already been filtered
            or evaluated by AI agents.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                border: "1px solid #243041",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Strategy inputs</strong>
              <p style={{ opacity: 0.8, marginBottom: 0 }}>
                Public and generated strategies enter the evaluation pipeline.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #243041",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Agent analysis</strong>
              <p style={{ opacity: 0.8, marginBottom: 0 }}>
                AI agents review, classify, and enrich candidate strategies.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #243041",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Vector search</strong>
              <p style={{ opacity: 0.8, marginBottom: 0 }}>
                FAISS supports similarity search across high-dimensional
                strategy states.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #243041",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Hypothesis tracking</strong>
              <p style={{ opacity: 0.8, marginBottom: 0 }}>
                MHT maintains and evolves competing strategy hypotheses over
                time.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #243041",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <strong>Interactive review</strong>
              <p style={{ opacity: 0.8, marginBottom: 0 }}>
                Users explore rankings, branches, pruning, and candidate paths.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "28px" }}>
            <a
              href="https://web-production-06a1.up.railway.app"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                border: "1px solid #334155",
                borderRadius: "10px",
                textDecoration: "none",
                color: "white",
                background: "#111827",
              }}
            >
              View live MHT-FAISS demo
            </a>
          </div>
        </section>

        <section
          style={{
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "28px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Why it matters</h2>

          <p style={{ opacity: 0.88, maxWidth: "900px" }}>
            This work connects research architecture directly to product
            systems. The engine is not an isolated demo: it informs strategy
            intelligence workflows, supports QRLPhoenix, and shows how advanced
            search and tracking methods can become usable system components.
          </p>

          <ul style={{ opacity: 0.82 }}>
            <li>Bridges research and deployable product architecture</li>
            <li>Supports fintech strategy discovery workflows</li>
            <li>Demonstrates technical depth behind broader system concepts</li>
            <li>Provides visible evidence of implementation capability</li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
