import PageShell from "../components/PageShell";
import "../assets/aboutPage.css";

function FocusCard({ title, children }) {
  return (
    <div className="about-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function SystemCard({ title, children }) {
  return (
    <div className="about-system-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function About() {
  return (
    <PageShell>
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-inner">
            <div className="about-eyebrow">About IndustriallyStrong</div>
            <h1>The working surface of an engineering leader.</h1>
            <p className="about-hero-copy">
              IndustriallyStrong is the working surface of Z’s engineering
              leadership — where complex systems are designed, executed, and
              validated across real-world constraints.
            </p>
            <p className="about-hero-copy secondary">
              This platform shows how leadership decisions, architecture, and
              execution discipline translate into deployed systems.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-eyebrow">How I operate</div>
            <h2>Engineering leadership across architecture, execution, and scale.</h2>

            <div className="about-pillars">
              <div className="about-pillar">
                <div className="pillar-icon">01</div>
                <h3>Engineering Leadership</h3>
                <p>
                  Leading teams, programs, and systems under real-world
                  constraints.
                </p>
              </div>

              <div className="about-pillar">
                <div className="pillar-icon">02</div>
                <h3>System Architecture</h3>
                <p>
                  Designing systems that hold under scale, ambiguity, and
                  failure modes.
                </p>
              </div>

              <div className="about-pillar">
                <div className="pillar-icon">03</div>
                <h3>Execution Discipline</h3>
                <p>
                  Turning complex initiatives into shipped, working systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-eyebrow">Where the leadership shows up</div>
            <h2>Architecture decisions, portfolio calls, and the systems they produce.</h2>

            <div className="about-card-grid">
              <FocusCard title="Architecture Decisions">
                System-level structure: where boundaries belong, what must be
                deterministic, where to absorb risk, and where to push it back
                on the organization.
              </FocusCard>

              <FocusCard title="Portfolio &amp; Program Calls">
                Invest, pause, redirect, or kill. Aligning roadmaps, risks,
                dependencies, and decisions across engineering, product, and
                executive stakeholders.
              </FocusCard>

              <FocusCard title="AI Decision Systems">
                Leading the design of decision systems built from coordinated
                agents, structured reasoning, and real-world data pipelines —
                with correctness owned at the architectural level.
              </FocusCard>

              <FocusCard title="Supporting Research Layer">
                Research lives here too — high-dimensional signal processing,
                multi-state resolution, associative retrieval — but as a
                supporting layer to leadership and execution, not the primary
                identity.
              </FocusCard>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-eyebrow">Operating model</div>
            <h2>How leadership decisions become deployed systems.</h2>

            <div className="about-flow">
              <div className="about-flow-node">
                <h3>Leadership Decisions</h3>
                <p>
                  Architecture, portfolio, and execution calls made under real
                  constraints.
                </p>
              </div>

              <div className="about-flow-arrow">→</div>

              <div className="about-flow-node">
                <h3>Engineering Execution</h3>
                <p>
                  Programs, teams, and operating cadence translating those
                  decisions into working systems.
                </p>
              </div>

              <div className="about-flow-arrow">→</div>

              <div className="about-flow-node">
                <h3>Deployed Systems</h3>
                <p>
                  Operational platforms and live surfaces validating the
                  approach in real environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-eyebrow">Active systems</div>
            <h2>Working systems that show the leadership approach in execution.</h2>

            <div className="about-systems-grid">
              <SystemCard title="QRLPhoenix">
                AI-assisted strategy discovery and evaluation platform —
                architecture and execution led end-to-end.
              </SystemCard>

              <SystemCard title="GutSense">
                Multi-agent dietary intelligence system; integrated execution
                across Claude, Gemini, and Apple Foundation Models.
              </SystemCard>

              <SystemCard title="State Resolution Engine">
                Supporting research surface for strategy tracking using
                multi-state resolution and vector retrieval.
              </SystemCard>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-eyebrow">Approach</div>
            <h2>Leadership first. Architecture next. Research as supporting layer.</h2>

            <div className="about-approach-grid">
              <div className="approach-block">
                <h3>Leadership &amp; execution</h3>
                <p>Programs, teams, portfolio decisions, delivery discipline.</p>
              </div>

              <div className="approach-block">
                <h3>System architecture</h3>
                <p>Boundaries, correctness, observability, and accountability.</p>
              </div>

              <div className="approach-block">
                <h3>Supporting research</h3>
                <p>Signal processing, state resolution, associative retrieval.</p>
              </div>
            </div>

            <p className="about-approach-summary">
              The goal is to show how engineering leadership decisions —
              backed by architecture and supported by research — translate
              into deployed systems that hold under real-world constraints.
            </p>
          </div>
        </section>

        <section className="about-closing">
          <div className="about-closing-inner">
            <div className="about-eyebrow">Closing statement</div>
            <h2>
              IndustriallyStrong is the working surface of an engineering
              leader: programs, architecture, and execution discipline made
              visible through the systems they produce.
            </h2>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
