import PageShell from "../components/PageShell";
import "../assets/conceptsPage.css";

function ConceptCard({ title, children }) {
  return (
    <div className="concept-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function SignalItem({ children }) {
  return <div className="signal-item">{children}</div>;
}

export default function Concepts() {
  return (
    <PageShell>
      <main className="concepts-page">
        <section className="concepts-hero">
          <div className="concepts-hero-inner">
            <div className="concepts-eyebrow">Concepts</div>
            <h1>Technical concepts for institutions capable of executing at scale.</h1>
            <p className="concepts-hero-copy">
              IndustriallyStrong develops concepts as serious technical theses:
              early architectural directions designed to be evaluated,
              strengthened, and pursued by organizations with real execution
              capability.
            </p>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">What a concept means here</div>
            <h2>Not lightweight ideas. Structured technical directions.</h2>
            <p className="concepts-copy">
              Concepts on this platform are framed as architecture-level
              positions. They are intended to clarify where conventional
              approaches break down, where discontinuities may exist, and what
              kinds of systems or programs might follow.
            </p>

            <div className="concepts-definition-grid">
              <div className="definition-block">
                <h3>Architectural</h3>
                <p>
                  Focused on system structure, scaling path, and technical
                  direction rather than isolated features.
                </p>
              </div>

              <div className="definition-block">
                <h3>Institutional</h3>
                <p>
                  Designed for organizations capable of engineering, funding,
                  and executing at meaningful scale.
                </p>
              </div>

              <div className="definition-block">
                <h3>Credible</h3>
                <p>
                  Selectively disclosed, but grounded in enough technical
                  substance to demonstrate seriousness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Concept lane 01</div>
            <h2>Program-scale technical directions.</h2>
            <p className="concepts-copy">
              Some concepts are best framed as mission-oriented technical
              programs: high-risk, high-payoff directions where the challenge is
              not incremental optimization, but architectural discontinuity.
            </p>

            <div className="concepts-two-column">
              <div className="concept-lane-card emphasis">
                <h3>DARPA-style program framing</h3>
                <p>
                  These concepts emphasize mission-first articulation, clear
                  problem definition, and a strong case for why conventional
                  approaches are insufficient.
                </p>

                <div className="signals-grid">
                  <SignalItem>Problem-first framing</SignalItem>
                  <SignalItem>High-risk / high-payoff direction</SignalItem>
                  <SignalItem>Institutional execution model</SignalItem>
                  <SignalItem>Selective disclosure with technical substance</SignalItem>
                </div>
              </div>

              <div className="concept-lane-side">
                <ConceptCard title="Mission definition">
                  The concept begins with the strategic or technical objective,
                  not with a product feature list.
                </ConceptCard>

                <ConceptCard title="Architectural discontinuity">
                  The emphasis is on new technical paths that may matter because
                  they change the structure of the problem.
                </ConceptCard>

                <ConceptCard title="Execution relevance">
                  The concept should be legible to institutions that could
                  realistically pursue it.
                </ConceptCard>
              </div>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Concept lane 02</div>
            <h2>Infrastructure and systems concepts.</h2>
            <p className="concepts-copy">
              Other concepts are oriented toward practical systems: financial
              intelligence, decision support, transparent AI workflows, and
              research architectures that can evolve into usable platforms.
            </p>

            <div className="concepts-card-grid">
              <ConceptCard title="Resilient intelligence systems">
                Architectures designed to preserve usefulness under uncertainty,
                incomplete information, and real operating constraints.
              </ConceptCard>

              <ConceptCard title="Strategy discovery and evaluation">
                Concepts aimed at extracting better signal, generating clearer
                hypotheses, and supporting serious financial workflows.
              </ConceptCard>

              <ConceptCard title="Transparent AI operating surfaces">
                Systems where reasoning, uncertainty, and technical structure
                are exposed rather than hidden behind black-box behavior.
              </ConceptCard>

              <ConceptCard title="Bridging research to usable systems">
                Architectural directions that connect experimental ideas to
                deployable software and operational tooling.
              </ConceptCard>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Development model</div>
            <h2>How concepts are strengthened.</h2>

            <div className="concept-flow">
              <div className="concept-flow-node">
                <h3>Concept</h3>
                <p>Initial technical thesis and problem framing.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>Architecture</h3>
                <p>System structure, scaling logic, and technical narrative.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>Prototype</h3>
                <p>Experimental implementation or evidence-generating system.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>System</h3>
                <p>Operational platform, tool, or deployable capability.</p>
              </div>
            </div>

            <p className="concepts-summary">
              The goal is to connect concept formation with real evidence:
              research engines, prototypes, and deployed systems that show the
              direction is grounded in actual implementation capability.
            </p>
          </div>
        </section>

        <section className="concepts-closing">
          <div className="concepts-closing-inner">
            <div className="concepts-eyebrow">Closing statement</div>
            <h2>
              IndustriallyStrong treats concepts as the front end of serious
              technical architecture work — not as isolated ideas, but as
              starting points for systems that can be built.
            </h2>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
