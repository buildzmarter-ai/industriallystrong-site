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
            <h1>Transparent, resilient architectures for serious AI systems.</h1>
            <p className="concepts-hero-copy">
              IndustriallyStrong develops concepts as technical theses: early
              architectural directions designed to be evaluated, strengthened,
              and pursued by organizations capable of meaningful execution.
            </p>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Core thesis</div>
            <h2>Useful AI systems are defined by architecture, not by a single model.</h2>
            <p className="concepts-copy">
              The platform’s concept work increasingly centers on a simple idea:
              reliability comes from structure. Different models, agents, and
              operating constraints can be useful, but they become far more
              valuable when their outputs are compared, checked, and made
              visible.
            </p>

            <div className="concepts-definition-grid">
              <div className="definition-block">
                <h3>Transparent</h3>
                <p>
                  Systems should expose sources, uncertainty, disagreement, and
                  reasoning structure rather than hide them.
                </p>
              </div>

              <div className="definition-block">
                <h3>Resilient</h3>
                <p>
                  Systems should remain useful under uncertainty, partial
                  failure, incomplete information, or model mismatch.
                </p>
              </div>

              <div className="definition-block">
                <h3>Architectural</h3>
                <p>
                  The emphasis is on how components interact, verify, and adapt
                  rather than on isolated model capability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Concept lane 01</div>
            <h2>Multi-agent intelligence needs structured disagreement and verification.</h2>
            <p className="concepts-copy">
              Multiple agents are useful because they can produce different
              answers, different interpretations, and different candidate paths.
              But diversity alone is not enough. Agent outputs should be checked
              against one another, checked against their sources, and checked by
              an additional verification layer.
            </p>

            <div className="concepts-two-column">
              <div className="concept-lane-card emphasis">
                <h3>Multi-agent comparison architecture</h3>
                <p>
                  The point of using multiple agents is not simply parallelism.
                  It is to surface disagreement, expose hidden assumptions, and
                  make it possible to verify competing outputs before action is
                  taken.
                </p>

                <div className="signals-grid">
                  <SignalItem>Different agents generate different answers</SignalItem>
                  <SignalItem>Outputs are compared against one another</SignalItem>
                  <SignalItem>Claims are checked against sources</SignalItem>
                  <SignalItem>A third agent or layer performs verification</SignalItem>
                </div>
              </div>

              <div className="concept-lane-side">
                <ConceptCard title="Structured disagreement">
                  Difference between agents is not noise to suppress. It is
                  signal to inspect.
                </ConceptCard>

                <ConceptCard title="Source-grounded checking">
                  Agent claims should be evaluated against evidence, not accepted
                  merely because they are fluent.
                </ConceptCard>

                <ConceptCard title="Independent verification">
                  A third agent or separate checking layer can validate,
                  challenge, or rank outputs before they are surfaced.
                </ConceptCard>
              </div>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Concept lane 02</div>
            <h2>On-device AI matters, but should be treated realistically.</h2>
            <p className="concepts-copy">
              On-device AI is valuable for privacy, responsiveness, and local
              assistance. But current comparisons often show that local
              foundation-model experiences remain weaker than stronger external
              systems. The architectural implication is not to reject local AI,
              but to place it correctly within a broader system.
            </p>

            <div className="concepts-card-grid">
              <ConceptCard title="Local intelligence">
                Useful for responsiveness, privacy-preserving interaction, and
                device-native assistance.
              </ConceptCard>

              <ConceptCard title="External intelligence">
                Often stronger for broader reasoning, deeper synthesis, and more
                capable multi-step tasks.
              </ConceptCard>

              <ConceptCard title="Hybrid orchestration">
                The strongest architecture may combine on-device and external
                intelligence rather than pretending they are equivalent.
              </ConceptCard>

              <ConceptCard title="Transparent tradeoffs">
                Systems should make the limits of local versus external
                intelligence visible to the user when it matters.
              </ConceptCard>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Concept lane 03</div>
            <h2>Agents should reason adjacent to the constraints they are given.</h2>
            <p className="concepts-copy">
              Agents should not only optimize within a narrow parameter box.
              They should also surface nearby possibilities: adjacent options,
              overlooked reframings, and strategically relevant variations just
              outside the current constraints.
            </p>

            <div className="adjacency-panel">
              <div className="adjacency-core">
                <h3>Constraint-aware adjacent reasoning</h3>
                <p>
                  A useful agent should understand the current parameters, but
                  also identify where adjacent choices may be more effective,
                  more resilient, or more informative.
                </p>
              </div>

              <div className="adjacency-grid">
                <div className="adjacency-item">Suggest nearby alternatives</div>
                <div className="adjacency-item">Surface overlooked options</div>
                <div className="adjacency-item">Reframe narrow problem definitions</div>
                <div className="adjacency-item">Identify strategic adjacencies</div>
              </div>
            </div>
          </div>
        </section>

        <section className="concepts-section">
          <div className="concepts-section-inner">
            <div className="concepts-eyebrow">Development model</div>
            <h2>Transparency and resilience are embodied in the architecture.</h2>

            <div className="concept-flow">
              <div className="concept-flow-node">
                <h3>Model diversity</h3>
                <p>Multiple agents or model types produce candidate outputs.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>Cross-checking</h3>
                <p>Outputs are compared against one another and against sources.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>Verification</h3>
                <p>An additional checking layer validates, challenges, or ranks results.</p>
              </div>

              <div className="concept-flow-arrow">→</div>

              <div className="concept-flow-node">
                <h3>Resilient output</h3>
                <p>Useful, transparent results are surfaced with uncertainty and adjacencies.</p>
              </div>
            </div>

            <p className="concepts-summary">
              In this view, transparency and resilience are not abstract values.
              They are concrete system properties produced by architecture:
              comparison, checking, verification, and structured exposure of
              uncertainty.
            </p>
          </div>
        </section>

        <section className="concepts-closing">
          <div className="concepts-closing-inner">
            <div className="concepts-eyebrow">Closing statement</div>
            <h2>
              IndustriallyStrong treats concepts as the front end of serious
              technical architecture work — especially systems designed to make
              disagreement visible, verification possible, and intelligence more
              resilient under real constraints.
            </h2>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
