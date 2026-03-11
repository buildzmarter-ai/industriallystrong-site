<section className="story-section">
        <div className="story-eyebrow">Program architecture</div>
        <h2>Enabling Stack for a Modular Exposure Program</h2>
        <p>
          Viewed as a research program, a modular exposure architecture decomposes into
          several enabling layers: semiconductor source generation, MEMS steering and
          local alignment, vacuum and thermal packaging, and system-level orchestration.
          Breaking the concept into these layers clarifies both feasibility questions and
          research directions.
        </p>
        <div className="lithography-diagram-frame">
          <img
            src={darpaModularSourceStackDiagram}
            alt="Research architecture for a modular semiconductor exposure source stack showing source layer, MEMS steering layer, vacuum and thermal packaging layer, and exposure orchestration layer."
            className="lithography-diagram-image"
          />
        </div>
      </section>

      <section className="story-section">
        <p>
          This decomposition separates the architectural claim from any single
          implementation path. Different source physics, steering mechanisms, and
          packaging strategies can be explored while preserving the broader modular
          scaling thesis.
        </p>
      </section>

      <section className="story-section">
        <p>
          The central thesis is architectural: if exposure capability can be replicated
          and distributed the way semiconductor devices themselves are, lithography
          systems may eventually scale through parallelism rather than monolithic
          optical complexity.
        </p>
      </section>
    </PageShell>
  );
}
