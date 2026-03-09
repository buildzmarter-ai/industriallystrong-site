import { useEffect, useRef } from "react";

export default function MHTDeck() {
  const deckRef = useRef(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const slides = [...deck.querySelectorAll(".mht-slide")];
    const navButtons = [...deck.querySelectorAll(".mht-nav-btn")];

    const setActive = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      navButtons.forEach((btn, i) => {
        btn.classList.toggle("is-active", i === index);
        btn.setAttribute("aria-pressed", i === index ? "true" : "false");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const idx = slides.indexOf(visible.target);
        if (idx >= 0) setActive(idx);
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-10% 0px -20% 0px",
      }
    );

    slides.forEach((slide) => observer.observe(slide));

    navButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        slides[index].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setActive(index);
      });
    });

    const hero = deck.querySelector(".mht-deck__hero");
    const stats = [...deck.querySelectorAll(".mht-stat")];

    const updateParallax = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.max(
        -1,
        Math.min(1, (rect.top + rect.height * 0.5 - vh * 0.5) / vh)
      );

      stats.forEach((card, i) => {
        const offset = progress * (i + 1) * -8;
        card.style.transform = `translateY(${offset}px)`;
      });
    };

    setActive(0);
    updateParallax();

    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section
      id="mht-cta-deck"
      className="mht-deck section-shell"
      aria-labelledby="mht-deck-title"
      ref={deckRef}
    >
      <div className="mht-deck__bg" aria-hidden="true"></div>

      <div className="mht-deck__hero">
        <div className="mht-deck__eyebrow">
          Radar-Inspired Market Regime Tracking
        </div>
        <h2 id="mht-deck-title" className="mht-deck__title">
          Scaling Multiple Hypothesis Tracking
          <span>for Systematic Macro</span>
        </h2>
        <p className="mht-deck__lede">
          A web-native presentation of the architecture: single-hypothesis CTA
          failure, radar-derived regime tracking, and FAISS-based hypothesis
          reduction for live markets.
        </p>

        <div className="mht-deck__hero-grid">
          <div className="mht-stat">
            <div className="mht-stat__value">0.1 ms</div>
            <div className="mht-stat__label">FAISS merge detection</div>
          </div>
          <div className="mht-stat">
            <div className="mht-stat__value">O(log n)</div>
            <div className="mht-stat__label">Indexed merge search path</div>
          </div>
          <div className="mht-stat">
            <div className="mht-stat__value">&lt; 15%</div>
            <div className="mht-stat__label">
              Observed CPU utilization target
            </div>
          </div>
        </div>
      </div>

      <div className="mht-deck__rail" aria-hidden="true">
        <div className="mht-rail__line"></div>
        <div className="mht-rail__pulse"></div>
      </div>

      <div className="mht-slides">
        <article className="mht-slide is-active" data-step="1">
          <div className="mht-slide__meta">01 / The Structural Problem</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>CTA systems are still single-hypothesis machines.</h3>
              <p>
                Trend, carry, and mean-reversion stacks usually commit to one
                dominant interpretation of market state. During a regime break,
                they hold exposure too long and react only after lagging
                evidence accumulates.
              </p>
              <ul className="mht-list">
                <li>Momentum lock-in during state transition</li>
                <li>
                  Trailing-stop logic reacts after explanatory power has already
                  decayed
                </li>
                <li>The result is the classic whipsaw gap</li>
              </ul>
            </div>

            <div
              className="mht-visual mht-visual--whipsaw"
              aria-label="Whipsaw comparison diagram"
            >
              <div className="mht-track mht-track--legacy">
                <span className="mht-track__label">Legacy CTA</span>
                <div className="mht-track__path"></div>
                <div className="mht-track__state mht-track__state--trend">
                  Trend
                </div>
                <div className="mht-track__state mht-track__state--break">
                  Break
                </div>
                <div className="mht-track__state mht-track__state--loss">
                  Whipsaw
                </div>
              </div>
              <div className="mht-track mht-track--mht">
                <span className="mht-track__label">MHT system</span>
                <div className="mht-track__path"></div>
                <div className="mht-track__state mht-track__state--trend">
                  Trend ↓
                </div>
                <div className="mht-track__state mht-track__state--pivot">
                  Pivot ↑
                </div>
                <div className="mht-track__state mht-track__state--selective">
                  Selective Macro
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="2">
          <div className="mht-slide__meta">02 / The Radar Analogy</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>Treat markets like maneuvering targets in clutter.</h3>
              <p>
                Instead of directly forecasting price, the engine tracks regime
                trajectories. Each regime hypothesis occupies a path through a
                multidimensional financial state space.
              </p>
              <div className="mht-formula">
                FSV = [p, dp/dt, σ, liquidity, correlation, regime_memory]
              </div>
            </div>

            <div
              className="mht-visual mht-visual--radar"
              aria-label="Radar styled market tracking animation"
            >
              <div className="mht-radar">
                <div className="mht-radar__ring ring-1"></div>
                <div className="mht-radar__ring ring-2"></div>
                <div className="mht-radar__ring ring-3"></div>
                <div className="mht-radar__sweep"></div>
                <div className="mht-radar__target target-1"></div>
                <div className="mht-radar__target target-2"></div>
                <div className="mht-radar__target target-3"></div>
                <div className="mht-radar__center"></div>
              </div>
              <div className="mht-radar-legend">
                <span>
                  <i></i> Trend
                </span>
                <span>
                  <i></i> Mean reversion
                </span>
                <span>
                  <i></i> Shock / transition
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="3">
          <div className="mht-slide__meta">03 / Multi-Model Tracking</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>
                Maintain a branching tree of competing regime interpretations.
              </h3>
              <p>
                The engine does not select one style up front. It carries
                multiple paths forward and updates their likelihood continuously
                as observations arrive.
              </p>
              <ul className="mht-list">
                <li>Trend continuation vs exhaustion</li>
                <li>Mean reversion vs volatility spike</li>
                <li>Macro transition vs false break</li>
              </ul>
            </div>

            <div
              className="mht-visual mht-visual--tree"
              aria-label="Hypothesis tree animation"
            >
              <div className="mht-tree">
                <div className="mht-node root">Market State</div>
                <div className="mht-branch branch-a"></div>
                <div className="mht-branch branch-b"></div>
                <div className="mht-branch branch-c"></div>

                <div className="mht-node node-a">Trend</div>
                <div className="mht-node node-b">Mean Reversion</div>
                <div className="mht-node node-c">Macro Transition</div>

                <div className="mht-subbranch sub-a1"></div>
                <div className="mht-subbranch sub-a2"></div>
                <div className="mht-subbranch sub-b1"></div>
                <div className="mht-subbranch sub-b2"></div>

                <div className="mht-node leaf-a1">Continuation</div>
                <div className="mht-node leaf-a2">Exhaustion</div>
                <div className="mht-node leaf-b1">Oscillation</div>
                <div className="mht-node leaf-b2">Vol Spike</div>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="4">
          <div className="mht-slide__meta">04 / Adaptive Gating</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>
                Reject noise in calm regimes. Expand sensitivity during shocks.
              </h3>
              <p>
                Mahalanobis-distance gating adapts to covariance structure. The
                gate narrows during stable conditions and widens when volatility
                expands, preserving track continuity without admitting noise.
              </p>
              <div className="mht-formula">
                D<sub>M</sub> = √((x − μ)<sup>T</sup> Σ<sup>−1</sup> (x − μ))
              </div>
            </div>

            <div
              className="mht-visual mht-visual--gating"
              aria-label="Adaptive gating diagram"
            >
              <div className="mht-gating">
                <div className="mht-ellipse mht-ellipse--tight"></div>
                <div className="mht-ellipse mht-ellipse--wide"></div>
                <div className="mht-point p1"></div>
                <div className="mht-point p2"></div>
                <div className="mht-point p3"></div>
                <div className="mht-point p4"></div>
                <div className="mht-point p5"></div>
                <div className="mht-caption left">Stable regime</div>
                <div className="mht-caption right">Shock regime</div>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="5">
          <div className="mht-slide__meta">
            05 / The Computational Breakthrough
          </div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>
                FAISS collapses the redundancy problem before it becomes a
                scaling failure.
              </h3>
              <p>
                The real bottleneck is not generating hypotheses. It is
                repeatedly comparing active branches to detect convergence.
                Brute-force pairwise checks become intractable as the tree
                grows.
              </p>
              <div className="mht-compare">
                <div>
                  <span className="label">Legacy merge search</span>
                  <strong>O(n²)</strong>
                </div>
                <div>
                  <span className="label">Indexed ANN merge search</span>
                  <strong>≈ O(log n)</strong>
                </div>
              </div>
            </div>

            <div
              className="mht-visual mht-visual--merge"
              aria-label="Hypothesis merge animation"
            >
              <div className="mht-cluster-stage mht-cluster-stage--scatter">
                <span className="mht-dot d1"></span>
                <span className="mht-dot d2"></span>
                <span className="mht-dot d3"></span>
                <span className="mht-dot d4"></span>
                <span className="mht-dot d5"></span>
                <span className="mht-dot d6"></span>
                <span className="mht-dot d7"></span>
                <span className="mht-dot d8"></span>
              </div>
              <div className="mht-cluster-arrow">ANN search</div>
              <div className="mht-cluster-stage mht-cluster-stage--merged">
                <span className="mht-merge-cluster c1"></span>
                <span className="mht-merge-cluster c2"></span>
                <span className="mht-merge-cluster c3"></span>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="6">
          <div className="mht-slide__meta">06 / Performance Impact</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>From multi-second hypothesis maintenance to live operation.</h3>
              <p>
                Approximate nearest-neighbor indexing turns merge detection into
                an operationally feasible component for streaming financial
                systems.
              </p>
              <div className="mht-bars" aria-label="Latency bars">
                <div className="mht-bar">
                  <span className="mht-bar__label">Brute force</span>
                  <span className="mht-bar__track">
                    <span className="mht-bar__fill is-long"></span>
                  </span>
                  <span className="mht-bar__value">1–9,000 ms</span>
                </div>
                <div className="mht-bar">
                  <span className="mht-bar__label">FAISS merge</span>
                  <span className="mht-bar__track">
                    <span className="mht-bar__fill is-short"></span>
                  </span>
                  <span className="mht-bar__value">~0.1 ms</span>
                </div>
              </div>
            </div>

            <div className="mht-visual mht-visual--metrics">
              <div className="mht-metric-card">
                <span>Latency compression</span>
                <strong>90,000×</strong>
              </div>
              <div className="mht-metric-card">
                <span>Detected trend decay</span>
                <strong>34% faster</strong>
              </div>
              <div className="mht-metric-card">
                <span>CPU target</span>
                <strong>&lt; 15%</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="7">
          <div className="mht-slide__meta">07 / Why CTA Architecture Fits</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>
                CTA diversification already looks like crude
                multiple-hypothesis tracking.
              </h3>
              <p>
                Large CTAs run trend, carry, breakout, mean reversion, and
                cross-asset sleeves in parallel. Those sleeves behave like
                implicit priors on market state, but they are not dynamically
                coordinated.
              </p>
              <p className="mht-callout">
                MHT converts static diversification into Bayesian regime
                inference.
              </p>
            </div>

            <div
              className="mht-visual mht-visual--cta-map"
              aria-label="CTA to MHT mapping"
            >
              <div className="mht-columns">
                <div className="mht-column">
                  <div className="mht-column__title">Traditional CTA</div>
                  <div className="mht-pill">Trend</div>
                  <div className="mht-pill">Carry</div>
                  <div className="mht-pill">Breakout</div>
                  <div className="mht-pill">Mean Reversion</div>
                </div>
                <div className="mht-columns__arrow">→</div>
                <div className="mht-column">
                  <div className="mht-column__title">MHT Engine</div>
                  <div className="mht-pill mht-pill--accent">P(Trend)</div>
                  <div className="mht-pill mht-pill--accent">P(Shock)</div>
                  <div className="mht-pill mht-pill--accent">
                    P(Selective Macro)
                  </div>
                  <div className="mht-pill mht-pill--accent">P(Decay)</div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="mht-slide" data-step="8">
          <div className="mht-slide__meta">08 / Closing Frame</div>
          <div className="mht-slide__body">
            <div className="mht-slide__copy">
              <h3>A new architecture for systematic macro.</h3>
              <p>
                Radar-derived probabilistic tracking, high-dimensional market
                state vectors, and FAISS-accelerated hypothesis reduction
                combine into a scalable real-time regime engine.
              </p>
              <p className="mht-callout">
                Static diversification → dynamic probabilistic regime inference.
              </p>
            </div>

            <div className="mht-visual mht-visual--closing">
              <div className="mht-stack">
                <div className="mht-stack__item">Radar MHT</div>
                <div className="mht-stack__item">Financial State Vectors</div>
                <div className="mht-stack__item">Adaptive Gating</div>
                <div className="mht-stack__item">FAISS Merge Reduction</div>
                <div className="mht-stack__result">
                  Live CTA Regime Tracking
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mht-deck__nav" aria-label="Deck navigation">
        <button
          className="mht-nav-btn is-active"
          data-target="1"
          aria-label="Go to slide 1"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="2"
          aria-label="Go to slide 2"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="3"
          aria-label="Go to slide 3"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="4"
          aria-label="Go to slide 4"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="5"
          aria-label="Go to slide 5"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="6"
          aria-label="Go to slide 6"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="7"
          aria-label="Go to slide 7"
        ></button>
        <button
          className="mht-nav-btn"
          data-target="8"
          aria-label="Go to slide 8"
        ></button>
      </div>
    </section>
  );
}
