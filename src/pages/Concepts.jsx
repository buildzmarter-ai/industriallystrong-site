import PageShell from "../components/PageShell";

export default function Concepts() {
  return (
    <PageShell>
      <div>
        <h1>Concepts</h1>
        <p>
          IndustriallyStrong develops technical concepts intended for
          institutions capable of executing at meaningful scale.
        </p>

        <section style={{ marginTop: "40px" }}>
          <h2>DARPA-style program framing</h2>
          <p>
            Some concepts are best framed as high-risk, high-payoff technical
            programs. These require mission-first articulation, clear problem
            definition, and an explanation of why conventional approaches are
            insufficient.
          </p>
          <p>
            The emphasis is not on incremental improvement. It is on identifying
            technical discontinuities, new architectural possibilities, and the
            kinds of organizations required to pursue them.
          </p>
          <ul>
            <li>Problem-first, mission-oriented framing</li>
            <li>High-risk / high-payoff technical direction</li>
            <li>Institutional execution rather than individual-scale delivery</li>
            <li>Selective disclosure with credible technical substance</li>
          </ul>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Fintech infrastructure framing</h2>
          <p>
            Other concepts are oriented toward financial intelligence,
            decision-support, and strategy evaluation systems. These ideas focus
            on resilient architectures, transparent AI workflows, and the use of
            advanced modeling to support practical execution.
          </p>
          <p>
            The goal is not novelty for its own sake. It is better signal
            extraction, clearer operating surfaces, and systems that can support
            serious financial workflows.
          </p>
          <ul>
            <li>Resilient intelligence systems</li>
            <li>Strategy discovery and evaluation</li>
            <li>Transparent AI operating surfaces</li>
            <li>Bridging research architectures to usable systems</li>
          </ul>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Concept development model</h2>
          <p>
            The site is intended to connect concept formation with real
            evidence: deployed systems, research engines, and architectural
            experiments that show the direction is grounded in actual
            implementation capability.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
