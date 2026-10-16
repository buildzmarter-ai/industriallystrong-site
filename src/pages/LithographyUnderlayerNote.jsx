import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import "../assets/lithographyStory.css";

import underlayerAbsorptionChart from "../assets/underlayer-absorption-chart.png";

const INK = "#1a1a19";
const INK2 = "#45453f";
const LINK = "#1d4ed8";

const panel = {
  background: "#fbfaf7",
  color: INK,
  borderRadius: "24px",
  padding: "48px clamp(20px, 5vw, 56px) 32px",
};

const card = {
  border: "1px solid #dcdad3",
  borderRadius: "18px",
  padding: "22px",
  background: "#ffffff",
};

const cardText = { fontSize: "17px", color: INK };

const verdict = (color) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: "10px",
  color,
  border: `1px solid ${color}55`,
  background: `${color}14`,
});

const sources = [
  {
    title: "High-NA Hard Sell: EUV Multipatterning Practices Revealed, Depth of Focus Not Mentioned",
    url: "https://frederickchen.substack.com/p/high-na-hard-sell-euv-multipatterning",
  },
  {
    title: "Cautions In Using High-NA EUV",
    url: "https://frederickchen.substack.com/p/cautions-in-using-high-na-euv",
  },
  {
    title: "Bit Line Contacts in 10nm-class DRAM: EUV Stochastics from Low NILS",
    url: "https://frederickchen.substack.com/p/bit-line-contacts-in-10nm-class-dram",
  },
  {
    title: "EUV Resists are Getting Exposed by More than EUV Light",
    url: "https://frederickchen.substack.com/p/euv-resists-are-getting-exposed-by",
  },
  {
    title: "Underlayer Electrons Enhance EUV Stochastic Defectivity",
    url: "https://frederickchen.substack.com/p/underlayer-electrons-enhance-euv",
  },
  {
    title:
      "Bae et al., Contrast improvement and dose reduction for high-NA EUV DRAM patterning with pupil-mask-wavefront co-optimization, Proc. SPIE 13979 (2026)",
    url: "https://doi.org/10.1117/12.3090659",
  },
];

export default function LithographyUnderlayerNote() {
  return (
    <PageShell>
      <div style={panel}>
      {/* HERO */}
      <section className="story-hero">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>
          <Link to="/lithography" style={{ color: "inherit" }}>
            Lithography
          </Link>{" "}
          · Field note
        </div>

        <h1>
          Depth of Focus, Quadrupole Illumination and Underlayer Electrons
          <br />
          Working Together, or Against Each Other?
        </h1>

        <p className="story-lead" style={{ opacity: 1, color: INK }}>
          High-NA EUV buys contrast, quadrupole illumination buys depth of
          focus, and both look like wins on their own. Put them on the same
          wafer and the resist has to get thinner, which hands more of the
          exposure to the layer underneath it. This note works through how the
          three effects interact.
        </p>

        <p style={{ fontSize: "15px", color: INK2, marginTop: "18px" }}>
          Zahirudeen Premji · 16 October 2026 · Prompted by Frederick Chen's
          writing on High-NA depth of focus and underlayer electrons
        </p>
      </section>

      {/* THE THREE EFFECTS */}
      <section className="story-section">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>The three effects</div>
        <h2>What each one does on its own</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "24px",
          }}
        >
          <div style={card}>
            <h3 style={{ marginTop: 0 }}>Depth of focus at High NA</h3>
            <p style={cardText}>
              Depth of focus falls roughly with the square of NA. Going from
              0.33 to 0.55 NA cuts it to about a third. The resist should be no
              thicker than the depth of focus, so High-NA films end up under
              about 30 nm.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ marginTop: 0 }}>Quadrupole illumination</h3>
            <p style={cardText}>
              For dense two-dimensional hole arrays such as DRAM storage nodes,
              four symmetric poles send the diffraction orders through the
              pupil so that defocus largely cancels. It is the main lever for
              depth of focus on these layers. At Low NA the poles must be small
              and pushed to the pupil edge, which throws away illuminator light
              and costs throughput.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ marginTop: 0 }}>Electrons from the underlayer</h3>
            <p style={cardText}>
              EUV barely reflects at the resist interfaces, because the
              refractive index is close to 1. What comes back is not light. Most
              of the EUV passes through the thin resist, is absorbed in the
              underlayer, and the underlayer emits electrons back up into the
              resist. Those electrons expose it too.
            </p>
          </div>
        </div>
      </section>

      {/* THE CHART */}
      <section className="story-section">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>The arithmetic</div>
        <h2>Thinner resist hands more of the exposure to the underlayer</h2>

        <p>
          The fraction of EUV a resist absorbs is 1 − exp(−α·t). For a
          chemically amplified resist at about 5 per µm, a 50 nm film absorbs
          about 22% and passes 78% on to the underlayer. Thin it to 25 nm for
          High NA and the film absorbs about 12%, passing 88% on. The resist's
          own absorbed photon count drops by roughly a third, while the
          underlayer's share of the exposure grows.
        </p>

        <div className="lithography-diagram-frame" style={{ borderColor: "#dcdad3" }}>
          <img
            className="lithography-diagram-image"
            src={underlayerAbsorptionChart}
            alt="Share of incident EUV absorbed in the resist versus resist thickness, for a chemically amplified resist (about 5 per micron) and a metal-oxide resist (about 20 per micron, assumed). At 50 nm the chemically amplified resist absorbs 22% and passes 78% to the underlayer; at 25 nm it absorbs 12% and passes 88%."
          />
        </div>

        <h3 style={{ marginTop: "32px" }}>Assumptions</h3>
        <ol style={{ fontSize: "17px", color: INK }}>
          <li>
            Absorbed fraction is 1 − exp(−α·t). No EUV is reflected back from
            the resist surface or the underlayer.
          </li>
          <li>
            Chemically amplified resist absorbs about 5 per µm, the value
            Frederick Chen uses in his models.
          </li>
          <li>
            Metal-oxide resist absorbing about 20 per µm is my assumed typical
            value, not one taken from Chen.
          </li>
          <li>
            The High-NA band caps resist at about 30 nm, from the depth of
            focus. Thickness lost during exposure is ignored, though in
            practice it makes the film thinner still.
          </li>
          <li>
            The Low-NA band of 40–60 nm is illustrative, consistent with the
            40–50 nm films in Chen's examples.
          </li>
          <li>
            Only photons are counted. How many electrons the underlayer sends
            back depends on the underlayer material, and is not modelled here.
          </li>
        </ol>
      </section>

      {/* HOW THEY INTERACT */}
      <section className="story-section">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>How they interact</div>
        <h2>Three pairs, three different answers</h2>

        <div style={{ ...card, marginTop: "24px" }}>
          <div style={verdict("#15803d")}>Working together</div>
          <h3 style={{ marginTop: 0 }}>Quadrupole and depth of focus</h3>
          <p style={cardText}>
            Quadrupole is how you get the depth of focus back for dense holes.
            High NA helps here too: at the same pitch the design sits at a more
            relaxed k1, so the poles can be larger and the pupil fill better
            than at Low NA.
          </p>
        </div>

        <div style={{ ...card, marginTop: "18px" }}>
          <div style={verdict("#b91c1c")}>Working against</div>
          <h3 style={{ marginTop: 0 }}>Depth of focus and underlayer electrons</h3>
          <p style={cardText}>
            This is the core of it. The thing High NA forces you to do, thin
            the resist, is the thing that makes the underlayer a larger share of
            the exposure. The chart above is that trade in numbers.
          </p>
        </div>

        <div style={{ ...card, marginTop: "18px" }}>
          <div style={verdict("#a16207")}>Partly together, mostly cancelled</div>
          <h3 style={{ marginTop: 0 }}>Quadrupole and underlayer electrons</h3>
          <p style={cardText}>
            The underlayer is exposed by the image at the bottom of the resist,
            and quadrupole's depth of focus keeps that image sharp. But the
            returning electrons add their own spread, a few nanometres that do
            not shrink with NA. As pitch shrinks, that fixed blur takes a larger
            share of the contrast High NA bought.
          </p>
          <p style={cardText}>
            There is a second trap. Underlayer electrons lower the dose needed
            to print, which looks like free throughput. But the electrons from
            one absorbed photon arrive together, so the noise is still set by
            the photon count, and the photon count went down. The dose saving
            and the stochastic penalty are the same effect.
          </p>
        </div>
      </section>

      {/* THE NET */}
      <section className="story-section">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>The net</div>
        <h2>Two routes to the same stochastic floor</h2>
        <p>
          Low NA keeps a thick resist, but the tight quadrupole needed for
          depth of focus kills pupil fill, which pushes dose down. High NA gets
          the pupil fill and the contrast back, but its depth of focus thins the
          resist, and the underlayer's electron image takes a larger share.
          Quadrupole gives each NA its best optical depth of focus. The
          underlayer then degrades the image in a way no illumination setting
          can reach.
        </p>
        <p>
          That reading is consistent with the observation that printed holes
          look about as stochastic at High NA as at Low NA, even though High NA
          has the better aerial image.
        </p>
      </section>

      {/* OPEN QUESTIONS */}
      <section className="story-section">
        <h2>Open questions</h2>
        <ul>
          <li>
            Is there a resist thickness, or an underlayer choice, at which the
            underlayer's electron contribution stops being a net loss?
          </li>
          <li>
            How much of the contrast gain from pupil-mask-wavefront
            co-optimization survives once the underlayer's blur is included?
          </li>
          <li>
            Should the underlayer be specified as part of the imaging system,
            with its own electron yield and blur, rather than as a process
            layer?
          </li>
        </ul>
      </section>

      {/* SOURCES */}
      <section className="story-section">
        <div className="story-eyebrow" style={{ opacity: 1, color: INK2 }}>Sources</div>
        <ul style={{ fontSize: "16px", color: INK }}>
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: LINK }}>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: "15px", color: INK2 }}>
          The interpretation and any errors are mine.{" "}
          <Link to="/lithography" style={{ color: LINK }}>
            ← Back to Lithography
          </Link>
        </p>
      </section>
      </div>
    </PageShell>
  );
}
