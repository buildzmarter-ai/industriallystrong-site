import PageShell from "../components/PageShell";
import CardLink from "../components/CardLink";
import PrimaryButton from "../components/PrimaryButton";

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
          Building AI systems, research engines, and deployable technical platforms.
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
          <PrimaryButton to="/systems">View systems</PrimaryButton>
          <PrimaryButton to="/research" secondary>
            Explore research
          </PrimaryButton>
        </div>
      </section>

      <section style={{ marginTop: "72px" }}>
        <h2 style={{ marginBottom: "28px" }}>Core Systems</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
          }}
        >
          <CardLink to="/systems/qrlphoenix" title="QRLPhoenix">
            <p style={{ margin: 0 }}>
              AI-assisted iOS strategy discovery and evaluation platform.
            </p>
          </CardLink>

          <CardLink to="/systems/gutsense" title="GutSense">
            <p style={{ margin: 0 }}>
              Multi-agent dietary intelligence using Claude, Gemini, and Apple
              Foundation Models.
            </p>
          </CardLink>

          <CardLink to="/research" title="MHT-FAISS Engine">
            <p style={{ margin: 0 }}>
              Research infrastructure for exploring large candidate strategy
              populations.
            </p>
          </CardLink>
        </div>
      </section>

      <section style={{ marginTop: "72px" }}>
        <h2 style={{ marginBottom: "16px" }}>Platform Architecture</h2>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "860px",
            opacity: 0.85,
            marginBottom: "28px",
          }}
        >
          IndustriallyStrong links deployed applications, agent-driven analysis,
          and deeper research infrastructure into one connected technical stack.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "24px",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              background: "#0f172a",
            }}
          >
            <h3 style={{ marginTop: 0 }}>QRLPhoenix</h3>
            <p style={{ margin: 0, opacity: 0.82 }}>
              iOS strategy intelligence platform for AI-assisted discovery and
              evaluation of trading strategies.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              background: "#0f172a",
            }}
          >
            <h3 style={{ marginTop: 0 }}>GutSense</h3>
            <p style={{ margin: 0, opacity: 0.82 }}>
              Multi-agent dietary intelligence system combining model synthesis
              and mobile delivery.
            </p>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "28px",
            opacity: 0.45,
            margin: "6px 0 14px 0",
          }}
        >
          ↓
        </div>

        <div
          style={{
            padding: "24px",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            background: "#0f172a",
            maxWidth: "720px",
            margin: "0 auto 14px auto",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 0 }}>AI Agent Analysis Layer</h3>
          <p style={{ margin: 0, opacity: 0.82 }}>
            Model-driven workflows classify, synthesize, enrich, and evaluate
            candidate strategies and user-facing decisions.
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "28px",
            opacity: 0.45,
            margin: "6px 0 14px 0",
          }}
        >
          ↓
        </div>

        <div
          style={{
            padding: "24px",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            background: "#0f172a",
            maxWidth: "720px",
            margin: "0 auto 14px auto",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 0 }}>MHT-FAISS Research Engine</h3>
          <p style={{ margin: 0, opacity: 0.82 }}>
            Research infrastructure for ranking, tracking, pruning, and
            exploring large strategy populations in high-dimensional state
            spaces.
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "28px",
            opacity: 0.45,
            margin: "6px 0 14px 0",
          }}
        >
          ↓
        </div>

        <div
          style={{
            padding: "24px",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            background: "#0f172a",
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Research Infrastructure</h3>
          <p style={{ margin: 0, opacity: 0.82 }}>
            A shared technical foundation that connects live systems, deeper
            experimentation, and future program concepts.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
