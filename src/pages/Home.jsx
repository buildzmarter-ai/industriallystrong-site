import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "../components/PageShell";
import { trackEvent } from "../utils/analytics";

// Older nav paths still land here and scroll to the matching section.
const PATH_TO_SECTION = {
  "/leadership": "track-record",
  "/operating-model": "how-i-work",
  "/evidence": "work",
  "/advisory": "advisory",
};

const Z_BASE = "https://z.industriallystrong.com";
const LINKEDIN = "https://www.linkedin.com/in/zahirudeen-premji-5a7a553b1/";

// Light reading surface: dark ink on warm paper, full contrast.
const INK = "#1a1a19";
const INK2 = "#45453f";
const RULE = "#dcdad3";
const ACCENT = "#1d4ed8";

const page = {
  background: "#fbfaf7",
  color: INK,
  borderRadius: "24px",
  padding: "56px clamp(20px, 5vw, 64px) 40px",
};

const eyebrow = {
  fontSize: "13px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: INK2,
  fontWeight: 600,
  marginBottom: "12px",
};

const h2 = {
  fontSize: "clamp(26px, 3.4vw, 34px)",
  lineHeight: 1.2,
  margin: "0 0 14px 0",
  letterSpacing: "-0.01em",
};

const lead = {
  fontSize: "18px",
  lineHeight: 1.7,
  maxWidth: "820px",
  margin: "0 0 28px 0",
};

const section = { marginTop: "80px" };

const DOMAINS = [
  {
    id: "governance",
    label: "Governance AI",
    title: "Agents that draft, and a record that never forgets",
    body: [
      "Small institutions such as HOA boards run on volunteers, a managing agent and a memory that walks out the door at the end of every term. TriveraAgent is the governance agent I am building for them. It runs on the real working record of the board I serve as President: it reads, reconciles and drafts, and it never writes to canonical state. A person holds that boundary, and an append-only ledger keeps the history.",
      "Underneath it is CLAW, a cross-model arbitration workflow in which no single model is load-bearing, because models change without notice.",
    ],
    links: [
      { label: "Correctness arbitration", to: "/correctness" },
      { label: "Read the Trivera series on LinkedIn", href: LINKEDIN },
    ],
  },
  {
    id: "lithography",
    label: "Lithography & EUV",
    title: "Back to the physics I started in",
    body: [
      "My lithography roots are at Nikon. The current work asks whether exposure systems could scale the way chips do, through many replicated writers rather than one ever-larger optical machine, and what compact EUV sources that would need.",
      "Alongside the architecture I write short process notes, most recently on how High-NA depth of focus, quadrupole illumination and underlayer electrons interact in the resist.",
    ],
    links: [
      { label: "Modular lithography", to: "/lithography" },
      { label: "Field note: underlayer electrons", to: "/lithography/notes/underlayer-electrons" },
      { label: "EUV lab simulations", to: "/lab" },
    ],
  },
  {
    id: "finance",
    label: "Finance state resolution",
    title: "When replicas disagree about what happened",
    body: [
      "Distributed financial systems can converge on a state that is internally consistent and still wrong, because updates arrived in a different order on different replicas. The Replica Race Resolution Lab shows where early collapse to one answer fails and where keeping competing hypotheses alive, then arbitrating, holds.",
      "It grows out of my storage work at StorageTek and StorAge.",
    ],
    links: [
      { label: "Replica Race Resolution Lab", href: "https://replica-race-lab.industriallystrong.com/" },
      { label: "Correctness comparator", href: "https://compare.industriallystrong.com/" },
    ],
  },
  {
    id: "apps",
    label: "Apps",
    title: "Building the products myself",
    body: [
      "I still write the code. GutSense compares dietary analysis from Claude, Gemini and Apple's on-device models side by side, for people managing food sensitivities. QRLPhoenix is an iOS platform for discovering and evaluating trading strategies.",
      "Both are in development. They keep my judgment honest at the level where systems actually break.",
    ],
    links: [
      { label: "GutSense", to: "/systems/gutsense" },
      { label: "QRLPhoenix", to: "/systems/qrlphoenix" },
    ],
  },
];

const ADVISORY = [
  {
    title: "Operating structure",
    body: "Leadership roles, decision rights, operating cadence and compensation design, so the company runs on structure rather than on the founder's memory.",
  },
  {
    title: "Engineering and program execution",
    body: "Turning ambiguity into executable programs, and making the hard portfolio calls: invest, pause, redirect or kill.",
  },
  {
    title: "Architecture where correctness matters",
    body: "AI agent systems and their governance, semiconductor and lithography technology, and distributed state that has to stay right.",
  },
];

const PRINCIPLES = [
  {
    title: "Build the artifact, not the argument",
    body: "A proposal is a simulation. People engage with something they can use, break and correct, so I build the working version first.",
  },
  {
    title: "Check the work where errors get expensive",
    body: "Not everywhere, which is exhausting, but at every boundary where a mistake becomes costly or irreversible. That applies to people, agents and machines alike.",
  },
  {
    title: "The record outlives whoever wrote it",
    body: "Agents drift, volunteers rotate and teams change. An append-only record is the permanent part, and I design around that.",
  },
];

const PROOF = [
  { n: "30+", l: "Years in semiconductor R&D" },
  { n: "$150M+", l: "R&D managed" },
  { n: "65+", l: "Global team led" },
  { n: "7", l: "US patents" },
];

const STORIES = [
  { label: "PMP culture transformation: 26 reports, 40 concurrent projects", path: "pmp-story.html" },
  { label: "Killed a failing acquired program in seven days", path: "kill-story.html" },
  { label: "Integrated 30+ engineers across two partners in India", path: "india-story.html" },
  { label: "StorAge acquisition and integration", path: "storeage-story.html" },
  { label: "Multi-year advisory to Ozo Coffee", path: "ozo-story.html" },
];

function TextLink({ link, context }) {
  const style = {
    color: ACCENT,
    textDecoration: "none",
    fontWeight: 600,
    borderBottom: `1px solid ${ACCENT}55`,
    paddingBottom: "1px",
  };
  const onClick = () => trackEvent("home_v2", `${context}:${link.label}`);
  if (link.to) {
    return (
      <Link to={link.to} style={style} onClick={onClick}>
        {link.label} →
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={style} onClick={onClick}>
      {link.label} ↗
    </a>
  );
}

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = PATH_TO_SECTION[location.pathname];
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const t = window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return (
    <PageShell>
      <div style={page}>
        {/* HERO */}
        <section>
          <div style={eyebrow}>Zahirudeen Premji · Colorado</div>
          <h1
            style={{
              fontSize: "clamp(34px, 5.4vw, 58px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 22px 0",
              maxWidth: "900px",
            }}
          >
            Systems that have to be right: in silicon, in ledgers, and in the
            institutions people run.
          </h1>
          <p style={{ ...lead, fontSize: "20px" }}>
            Thirty years of semiconductor R&amp;D and engineering leadership at
            StorageTek, Nikon, IBM, LSI and Microsoft. Now I build
            independently across four domains, and the thread through all of
            them is the same: keep the record correct when the parts underneath
            it change. I bring that to a small number of founders as a
            hands-on advisor.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a
              href="#advisory"
              onClick={() => trackEvent("home_v2", "hero_advisory")}
              style={{
                background: INK,
                color: "#fbfaf7",
                padding: "13px 22px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Advisory
            </a>
            <a
              href="#work"
              onClick={() => trackEvent("home_v2", "hero_see_work")}
              style={{
                border: `1px solid ${INK}`,
                color: INK,
                padding: "12px 22px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              See the work
            </a>
          </div>
        </section>


        {/* ADVISORY */}
        <section id="advisory" style={section}>
          <div style={eyebrow}>Advisory</div>
          <h2 style={h2}>A hands-on advisor for founders</h2>
          <p style={lead}>
            I take on a small number of founder-level engagements where I am in
            the work, not on a slide, and where the work produces results you
            can point to. The bar is high on both sides, so most conversations
            start with whether it is a fit.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {ADVISORY.map((a) => (
              <div
                key={a.title}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${RULE}`,
                  borderRadius: "18px",
                  padding: "24px",
                }}
              >
                <h3 style={{ fontSize: "19px", lineHeight: 1.35, margin: "0 0 10px 0" }}>{a.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: 1.65, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "22px",
              padding: "20px 24px",
              borderLeft: `4px solid ${ACCENT}`,
              background: "#ffffff",
              borderRadius: "0 14px 14px 0",
              fontSize: "17px",
              lineHeight: 1.65,
            }}
          >
            <strong>In practice:</strong> a multi-year advisory with Ozo Coffee
            in Boulder, working with the founders on leadership structure,
            operating cadence, compensation design and execution practices.{" "}
            <TextLink link={{ label: "Read the Ozo story", href: `${Z_BASE}/ozo-story.html` }} context="advisory" />
          </div>
          <div style={{ marginTop: "24px" }}>
            <Link
              to="/contact"
              onClick={() => trackEvent("home_v2", "advisory_contact")}
              style={{
                background: INK,
                color: "#fbfaf7",
                padding: "13px 22px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              Start a conversation
            </Link>
          </div>
        </section>

        {/* CURRENT WORK */}
        <section id="work" style={section}>
          <div style={eyebrow}>Current work</div>
          <h2 style={h2}>Four domains, one discipline</h2>
          <p style={lead}>
            What I bring to an engagement is current, because I am still doing
            the work. Each domain links to something you can open: a working
            lab, a demo or a write-up.
          </p>

          <div style={{ display: "grid", gap: "20px" }}>
            {DOMAINS.map((d) => (
              <article
                key={d.id}
                id={d.id}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${RULE}`,
                  borderRadius: "18px",
                  padding: "28px clamp(18px, 3vw, 32px)",
                }}
              >
                <div style={{ ...eyebrow, color: ACCENT, marginBottom: "8px" }}>
                  {d.label}
                </div>
                <h3 style={{ fontSize: "23px", lineHeight: 1.3, margin: "0 0 12px 0" }}>
                  {d.title}
                </h3>
                {d.body.map((p) => (
                  <p key={p.slice(0, 24)} style={{ fontSize: "17px", lineHeight: 1.7, margin: "0 0 12px 0", maxWidth: "860px" }}>
                    {p}
                  </p>
                ))}
                <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", marginTop: "16px" }}>
                  {d.links.map((l) => (
                    <TextLink key={l.label} link={l} context={d.id} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW I WORK */}
        <section id="how-i-work" style={section}>
          <div style={eyebrow}>How I work</div>
          <h2 style={h2}>The same three rules in every domain</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginTop: "8px",
            }}
          >
            {PRINCIPLES.map((p) => (
              <div key={p.title} style={{ borderTop: `3px solid ${INK}`, paddingTop: "16px" }}>
                <h3 style={{ fontSize: "19px", margin: "0 0 8px 0" }}>{p.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRACK RECORD */}
        <section id="track-record" style={section}>
          <div style={eyebrow}>Foundation</div>
          <h2 style={h2}>Where the judgment comes from</h2>
          <p style={lead}>
            Before working independently I led engineering organizations,
            programs and acquisitions. The stories behind these numbers are
            written up in full.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
              padding: "22px 0",
              borderTop: `1px solid ${RULE}`,
              borderBottom: `1px solid ${RULE}`,
            }}
          >
            {PROOF.map((p) => (
              <div key={p.l}>
                <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.01em" }}>{p.n}</div>
                <div style={{ fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: INK2, marginTop: "4px" }}>
                  {p.l}
                </div>
              </div>
            ))}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0 0", display: "grid", gap: "10px" }}>
            {STORIES.map((s) => (
              <li key={s.path} style={{ fontSize: "17px" }}>
                <TextLink link={{ label: s.label, href: `${Z_BASE}/${s.path}` }} context="story" />
              </li>
            ))}
          </ul>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ ...section, marginBottom: "8px" }}>
          <div style={eyebrow}>Next step</div>
          <h2 style={h2}>If you are a founder who wants a hands-on partner</h2>
          <p style={lead}>
            Tell me what you are building and where it is stuck. If it is a
            fit, we will both know quickly. Collaborators and readers working
            in any of these domains are welcome too.
          </p>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <TextLink link={{ label: "Start a conversation", to: "/contact" }} context="contact" />
            <TextLink link={{ label: "LinkedIn", href: LINKEDIN }} context="contact" />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
