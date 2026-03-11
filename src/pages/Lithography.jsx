import PageShell from "../components/PageShell";
import "../assets/lithographyStory.css";
import lithographyArchitectureDiagram from "../assets/lithography-architecture-diagram.svg";

export default function Lithography() {
  return (
    <PageShell>
      <section className="story-hero">
        <div className="story-eyebrow">Concept Exploration</div>
        <h1>
          Modular Lithography: Scaling Exposure Systems Like Semiconductors
        </h1>
        <p className="story-lead">
          An architectural alternative to monolithic optical scaling through
          parallel exposure modules, distributed alignment, and multi-wafer
          throughput.
        </p>
      </section>

      <section className="story-section">
        <p>
          Lithography has historically scaled through larger and more precise
          optical systems. That path has produced extraordinary machines, but
          also extremely large and complex architectures.
        </p>
        <p>
          Semiconductor manufacturing itself scales differently: through
          replication, modularity, and parallelism.
        </p>
        <p>
          This raises an architectural question: what if exposure systems could
          scale more like semiconductors do — by increasing the number of
          programmable exposure modules rather than increasing the size and
          complexity of a single optical machine?
        </p>
      </section>

      <section className="story-section">
        <h2>Architectural Comparison</h2>
        <div className="lithography-comparison">
          <div className="comparison-card">
            <h3>Traditional Optical Scanner</h3>
            <p>Reticle → Projection optics → Wafer stage</p>
            <p>
              Scaling occurs through increased optical precision and machine
              complexity.
            </p>
            <p>Exposure path remains fundamentally sequential.</p>
          </div>

          <div className="comparison-card proposed">
            <h3>Modular Exposure Architecture</h3>
            <p>
              Exposure module array → Distributed alignment → Multi-wafer
              scanning platform
            </p>
            <p>Scaling occurs by increasing the number of exposure modules.</p>
            <p>Exposure becomes parallel rather than sequential.</p>
          </div>
        </div>
      </section>

      <section className="story-section">
        <h2>Expanding Like a Semiconductor</h2>
        <p>Transistors scale by increasing the number of devices on a chip.</p>
        <p>
          Traditional lithography systems scale by increasing optical precision
          in one integrated machine.
        </p>
        <p>
          A modular lithography architecture could scale by increasing the
          number of exposure elements in the system.
        </p>
      </section>

      <section className="story-section">
        <h2>Open Research Questions</h2>
        <ul>
          <li>What emitter technologies could support modular exposure arrays?</li>
          <li>How should distributed beam alignment be implemented?</li>
          <li>Can MEMS structures support beam steering and focus control?</li>
          <li>How would cooling and vacuum architecture scale with module density?</li>
          <li>How should software coordinate many semi-independent writing elements?</li>
        </ul>
      </section>

      <section className="story-section">
        <div className="lithography-diagram-frame">
          <img
            src={lithographyArchitectureDiagram}
            alt="Traditional optical scanner versus modular lithography architecture"
            className="lithography-diagram-image"
          />
        </div>
      </section>
    </PageShell>
  );
}
