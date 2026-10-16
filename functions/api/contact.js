/**
 * Cloudflare Pages Function — /api/contact
 *
 * Receives the contact form on industriallystrong.com/contact.
 *
 * 1. Validates the submission and drops obvious bots (honeypot field,
 *    too-fast submission, per-IP hourly limit).
 * 2. Stores every accepted message in D1 first, so nothing is lost even if
 *    email delivery is not set up or fails.
 * 3. If the CONTACT_MAILER service binding is present, asks the
 *    is-contact-mailer Worker (contact-mailer/) to email it. Pages Functions
 *    cannot send email themselves; the Worker holds the send_email binding.
 *
 * Bindings (Cloudflare Pages → Settings → Bindings):
 *   DB              D1 database "is-telemetry" (already bound for telemetry)
 *   CONTACT_MAILER  Service binding → Worker "is-contact-mailer" (optional)
 *
 * Read stored messages:
 *   npx wrangler d1 execute is-telemetry --remote --command \
 *     "SELECT id, created_at, name, email, company, emailed FROM contact_messages ORDER BY id DESC LIMIT 20"
 */

const ALLOWED_ORIGINS = [
  "https://industriallystrong.com",
  "https://www.industriallystrong.com",
];

const LIMITS = { name: 120, email: 200, company: 160, message: 5000 };
const MIN_FILL_MS = 3000; // a human takes longer than this to fill the form
const MAX_FILL_MS = 24 * 3600_000; // a page left open longer than a day is stale
const MAX_PER_IP_PER_HOUR = 5;

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  ip_hash TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  emailed INTEGER NOT NULL DEFAULT 0,
  email_error TEXT NOT NULL DEFAULT ''
)`;

function json(body, status, origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": allow,
      Vary: "Origin",
    },
  });
}

function clean(v, max) {
  return String(v ?? "")
    .split("\u0000")
    .join("")
    .trim()
    .slice(0, max);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get("Origin") || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allow,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    },
  });
}

// Accept the live domains, and any request from the same origin that served
// the page (Cloudflare preview deployments, local wrangler dev).
function originAllowed(origin, request) {
  if (!origin) return true; // non-browser or same-origin without Origin header
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") || "";
  if (!originAllowed(origin, request)) {
    return json({ ok: false, error: "origin not allowed" }, 403, origin);
  }
  if (!env.DB) {
    return json({ ok: false, error: "storage unavailable" }, 503, origin);
  }

  let raw;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid request" }, 400, origin);
  }

  // Bots: honeypot filled, or no believable time-on-page (missing, faster
  // than a person could type, or implausibly old). Answer "ok" so they get
  // no signal, but store nothing.
  const startedAt = Number(raw?.started_at);
  const elapsed = Date.now() - startedAt;
  const believable =
    Number.isFinite(startedAt) && startedAt > 0 && elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS;
  if (clean(raw?.website, 200) || !believable) {
    return json({ ok: true }, 200, origin);
  }

  const name = clean(raw?.name, LIMITS.name);
  const email = clean(raw?.email, LIMITS.email);
  const company = clean(raw?.company, LIMITS.company);
  const message = clean(raw?.message, LIMITS.message);

  if (!name || !message) {
    return json({ ok: false, error: "Please add your name and a message." }, 400, origin);
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return json({ ok: false, error: "Please check your email address." }, 400, origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ipHash = ip ? (await sha256(`contact:${ip}`)).slice(0, 32) : "";
  const now = new Date();

  try {
    await env.DB.prepare(CREATE_TABLE).run();

    if (ipHash) {
      const since = new Date(now.getTime() - 3600_000).toISOString();
      const row = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM contact_messages WHERE ip_hash = ? AND created_at >= ?"
      )
        .bind(ipHash, since)
        .first();
      if ((row?.n || 0) >= MAX_PER_IP_PER_HOUR) {
        return json(
          { ok: false, error: "Too many messages from this connection. Please try again later." },
          429,
          origin
        );
      }
    }

    const inserted = await env.DB.prepare(
      `INSERT INTO contact_messages (created_at, name, email, company, message, ip_hash, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        now.toISOString(),
        name,
        email,
        company,
        message,
        ipHash,
        clean(request.headers.get("User-Agent"), 300)
      )
      .run();
    const id = inserted?.meta?.last_row_id;

    // Email it, if the mailer Worker is bound. Storage already succeeded,
    // so a mail failure is recorded but does not fail the visitor's submit.
    if (env.CONTACT_MAILER) {
      let emailed = 0;
      let emailError = "";
      try {
        const res = await env.CONTACT_MAILER.fetch("https://contact-mailer/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name, email, company, message, submitted_at: now.toISOString() }),
        });
        if (res.ok) emailed = 1;
        else emailError = `mailer ${res.status}: ${(await res.text()).slice(0, 300)}`;
      } catch (err) {
        emailError = String(err?.message || err).slice(0, 300);
      }
      if (id) {
        await env.DB.prepare("UPDATE contact_messages SET emailed = ?, email_error = ? WHERE id = ?")
          .bind(emailed, emailError, id)
          .run();
      }
    }

    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error("contact submit failed:", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500, origin);
  }
}

export async function onRequest({ request }) {
  const origin = request.headers.get("Origin") || "";
  return json({ ok: false, error: "method not allowed" }, 405, origin);
}
