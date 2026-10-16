import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { trackEvent } from "../utils/analytics";

const LINKEDIN = "https://www.linkedin.com/in/zahirudeen-premji-5a7a553b1/";

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

const card = {
  background: "#ffffff",
  border: `1px solid ${RULE}`,
  borderRadius: "18px",
  padding: "26px clamp(18px, 3vw, 30px)",
  marginTop: "22px",
};

const label = {
  display: "block",
  fontSize: "15px",
  fontWeight: 600,
  marginBottom: "6px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  fontSize: "16px",
  fontFamily: "inherit",
  color: INK,
  background: "#ffffff",
  border: `1px solid #b9b7ae`,
  borderRadius: "10px",
  padding: "11px 13px",
};

const MESSAGE_HINT =
  "What you are building and what stage the company is at.\n" +
  "Where it is stuck, or what decision is in front of you.\n" +
  "What you would want an advisor to actually do.";

export default function Contact() {
  // When the visitor arrived; the server rejects instant (bot) submissions.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", website: "" });
  const [status, setStatus] = useState({ state: "idle", error: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: "sending", error: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, started_at: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ state: "sent", error: "" });
        trackEvent("contact_v2", "form_sent");
      } else {
        setStatus({ state: "error", error: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ state: "error", error: "Could not reach the server. Please try again." });
    }
  }

  return (
    <PageShell>
      <div style={page}>
        <section>
          <div style={eyebrow}>Contact</div>
          <h1
            style={{
              fontSize: "clamp(32px, 4.6vw, 48px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              margin: "0 0 18px 0",
              maxWidth: "860px",
            }}
          >
            Start a conversation
          </h1>
          <p style={{ fontSize: "19px", lineHeight: 1.7, maxWidth: "820px", margin: 0 }}>
            I work with a small number of founders as a hands-on advisor, and I
            am glad to hear from collaborators working on governance AI,
            lithography and EUV, or distributed state correctness.
          </p>
        </section>

        <section style={card}>
          {status.state === "sent" ? (
            <div role="status">
              <h2 style={{ fontSize: "22px", margin: "0 0 10px 0" }}>Thank you, it is on its way.</h2>
              <p style={{ fontSize: "17px", lineHeight: 1.7, margin: 0 }}>
                I read every message myself and will reply to the address you
                gave. If it is a fit, we will both know quickly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate={false}>
              <h2 style={{ fontSize: "22px", margin: "0 0 6px 0" }}>Tell me about it</h2>
              <p style={{ fontSize: "16px", lineHeight: 1.65, color: INK2, margin: "0 0 20px 0" }}>
                I take on engagements where I can be in the work and where it
                produces results you can point to, so the first conversation is
                mostly about whether it is a fit, for both of us.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <label htmlFor="c-name" style={label}>Name</label>
                  <input id="c-name" required maxLength={120} autoComplete="name" value={form.name} onChange={set("name")} style={input} />
                </div>
                <div>
                  <label htmlFor="c-email" style={label}>Email</label>
                  <input id="c-email" type="email" required maxLength={200} autoComplete="email" value={form.email} onChange={set("email")} style={input} />
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label htmlFor="c-company" style={label}>
                  Company <span style={{ fontWeight: 400, color: INK2 }}>(optional)</span>
                </label>
                <input id="c-company" maxLength={160} autoComplete="organization" value={form.company} onChange={set("company")} style={input} />
              </div>

              <div style={{ marginTop: "16px" }}>
                <label htmlFor="c-message" style={label}>Message</label>
                <textarea
                  id="c-message"
                  required
                  maxLength={5000}
                  rows={7}
                  placeholder={MESSAGE_HINT}
                  value={form.message}
                  onChange={set("message")}
                  style={{ ...input, resize: "vertical", lineHeight: 1.6 }}
                />
              </div>

              {/* Honeypot: hidden from people, tempting to bots. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
                <label htmlFor="c-website">Website</label>
                <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
              </div>

              {status.state === "error" && (
                <p role="alert" style={{ color: "#b91c1c", fontSize: "16px", margin: "16px 0 0 0" }}>
                  {status.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status.state === "sending"}
                style={{
                  marginTop: "20px",
                  background: INK,
                  color: "#fbfaf7",
                  padding: "13px 24px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: status.state === "sending" ? "wait" : "pointer",
                  opacity: status.state === "sending" ? 0.7 : 1,
                }}
              >
                {status.state === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </section>

        <p style={{ fontSize: "16px", color: INK2, marginTop: "24px", lineHeight: 1.7 }}>
          Prefer LinkedIn?{" "}
          <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>
            Message me there ↗
          </a>
          <br />
          <Link to="/" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>
            ← Back to the work
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
