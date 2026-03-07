export default function Home() {
  return (
    <div>
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
          <a
            href="/systems"
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
          </a>

          <a
            href="/research"
            style={{
              padding: "12px 18px",
              border: "1px solid #334155",
              borderRadius: "10px",
              textDecoration: "none",
              color: "white",
            }}
          >
            Explore research
          </a>
        </div>
      </section>
    </div>
  );
}
