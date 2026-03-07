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
    </PageShell>
  );
}
