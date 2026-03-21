import PageShell from "../components/PageShell";

/* ── SYSTEM NARRATIVE (ordered by argument flow) ─────────────────────── */
const systemCards = [
  {
    href: "/lab/multihead.html",
    tag: "SYSTEM THESIS",
    tagColor: "#f1f5f9",
    tagBg: "#2563eb",
    title: "Distributed Writer Array",
    desc: "Lithography does not scale with optics — it scales with control. Parallel writers introduce instability unless locally controlled. This is the entry point.",
    order: 1,
  },
  {
    href: "/lab/phoenix-state.html",
    tag: "CONTROL LAYER",
    tagColor: "#5be6a3",
    tagBg: "#1e5f3a",
    title: "Closed-Loop Control",
    desc: "Without local feedback, distributed writers diverge. The Phoenix engine maintains competing causal hypotheses and derives real-time correction factors to keep parallel writers converged.",
    order: 2,
  },
  {
    href: "/lab/writer-head.html",
    tag: "ACTUATION LAYER",
    tagColor: "#e65b8a",
    tagBg: "#5f1e3a",
    title: "11-DOF Actuation",
    desc: "Control requires actuation dimensionality. 11 DOF is the minimum basis to synthesize PSFs under dynamic constraints — each writer head is an independent control node.",
    order: 3,
  },
  {
    href: "/lab/psf-synthesis.html",
    tag: "PHYSICS CONSTRAINT",
    tagColor: "#5be6e6",
    tagBg: "#1e5f5f",
    title: "PSF Physics",
    desc: "You cannot beat native resolution in the incoherent regime. Therefore control operates through reshaping, not sharpening. Coupled spatial-temporal optimization proves this quantitatively.",
    order: 4,
  },
  {
    href: "/lab/fleet-economics.html",
    tag: "INEVITABILITY",
    tagColor: "#e6c45b",
    tagBg: "#5f4b1e",
    title: "Why This Architecture Wins",
    desc: "Cost, power, and footprint all follow semiconductor scaling — not laser physics. $0.6M vs $380M. 0.3 kW vs 1,500 kW. A desk vs a cleanroom.",
    order: 5,
  },
];

/* ── SUPPORTING PAGES (not part of the main argument) ────────────────── */
const supportCards = [
  {
    href: "/lab/3d-pipeline.html",
    tag: "DEEP DIVE",
    tagColor: "#a37be6",
    tagBg: "#2d1e5f",
    title: "3D Optical Pipeline",
    desc: "Implementation detail. Full beam path from VCSEL through HHG gas cell to wafer. Not required to understand the system.",
  },
  {
    href: "/lab/2d-process.html",
    tag: "VALIDATION",
    tagColor: "#5ba3e6",
    tagBg: "#1e3a5f",
    title: "2D Process Simulation",
    desc: "Validation and modeling. Interactive lithography pipeline with full stochastic EUV exposure model.",
  },
  {
    href: "/lab/cta-evaluation.html",
    tag: "MHT-FAISS",
    tagColor: "#e6c45b",
    tagBg: "#5f4b1e",
    title: "CTA Evaluation Engine",
    desc: "Allocator-grade CTA evaluation with MHT-FAISS decision architecture. Regime detection, ranked candidates, allocation weights, confidence scores.",
  },
];

function CardGrid({ cards }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "22px",
      }}
    >
      {cards.map((card) => (
        <a
          key={card.href}
          href={card.href}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              padding: "24px",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              background: "#0f172a",
              height: "100%",
              transition:
                "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(74,108,247,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#1e293b";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  color: card.tagColor,
                  background: card.tagBg,
                }}
              >
                {card.tag}
              </span>
              {card.order && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {card.order} of 5
                </span>
              )}
            </div>

            <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
              {card.title}
            </h3>

            <p
              style={{
                opacity: 0.82,
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {card.desc}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function Lab() {
  return (
    <PageShell>
      {/* ── Thesis Header ──────────────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: "12px",
          }}
        >
          System Architecture
        </div>

        <h1
          style={{
            fontSize: "36px",
            marginBottom: "14px",
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
          }}
        >
          Lithography does not scale with optics.
          <br />
          It scales with control.
        </h1>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "780px",
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          At high throughput, stochastic effects dominate. This forces a
          transition from monolithic exposure to distributed, feedback-controlled
          writing. The pages below present the complete system — from thesis to
          inevitability — in five steps.
        </p>
      </section>

      {/* ── System Narrative (5 pages, ordered) ────────────────────── */}
      <section>
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: "16px",
          }}
        >
          The Argument
        </div>
        <CardGrid cards={systemCards} />
      </section>

      {/* ── Supporting Pages ───────────────────────────────────────── */}
      <section style={{ marginTop: "48px" }}>
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.35,
            marginBottom: "16px",
          }}
        >
          Supporting Detail
        </div>
        <CardGrid cards={supportCards} />
      </section>

      {/* ── Bottom note ────────────────────────────────────────────── */}
      <section
        style={{
          marginTop: "56px",
          border: "1px solid #1e293b",
          borderRadius: "14px",
          padding: "28px",
          background: "#111827",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Reading Order</h2>

        <p style={{ opacity: 0.88, maxWidth: "920px", lineHeight: 1.7 }}>
          Start with the Distributed Writer Array — it frames the problem. Then
          follow the numbered sequence: control layer, actuation layer, physics
          constraint, inevitability. The supporting pages provide implementation
          depth and validation, but are not required to understand the system
          claim.
        </p>
      </section>
    </PageShell>
  );
}
