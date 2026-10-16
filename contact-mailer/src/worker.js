// is-contact-mailer
//
// Emails contact-form submissions from industriallystrong.com to the
// verified Email Routing destination address.
//
// The site's Pages project lives in a different Cloudflare account, so it
// cannot use a service binding. It calls this Worker's workers.dev URL with
// the shared secret MAILER_KEY in the Authorization header; any request
// without the right key is refused.

import { EmailMessage } from "cloudflare:email";

// Constant-time comparison so the key cannot be guessed byte by byte.
function sameKey(given, expected) {
  if (typeof given !== "string" || typeof expected !== "string") return false;
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Strip anything that could break out of a header line.
const headerSafe = (v, max = 200) =>
  String(v ?? "").split("\u0000").join("").replace(/[\r\n]+/g, " ").trim().slice(0, max);

function buildMime({ from, to, replyTo, subject, body }) {
  const id = `${crypto.randomUUID()}@industriallystrong.com`;
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  return [
    `From: IndustriallyStrong contact form <${from}>`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodedSubject}`,
    `Message-ID: <${id}>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body.replace(/\r?\n/g, "\r\n"),
    "",
  ].join("\r\n");
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405 });
    }

    if (!env.TO || !env.FROM || !env.MAILER_KEY) {
      return new Response("mailer not configured: set the TO and MAILER_KEY secrets", { status: 500 });
    }

    const auth = request.headers.get("Authorization") || "";
    const given = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!sameKey(given, env.MAILER_KEY)) {
      return new Response("unauthorized", { status: 401 });
    }

    let p;
    try {
      p = await request.json();
    } catch {
      return new Response("invalid json", { status: 400 });
    }

    const name = headerSafe(p.name, 120);
    const email = headerSafe(p.email, 200);
    const company = headerSafe(p.company, 160);
    if (!name || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      return new Response("missing name or email", { status: 400 });
    }

    const subject = `Advisory enquiry: ${name}${company ? ` (${company})` : ""}`;
    const body = [
      `From: ${name} <${email}>`,
      company ? `Company: ${company}` : null,
      `Received: ${headerSafe(p.submitted_at, 40)}  (message #${headerSafe(p.id, 20)})`,
      "",
      String(p.message ?? "").slice(0, 5000),
      "",
      "--",
      "Sent from the contact form at industriallystrong.com/contact.",
      "Reply to this email to answer the sender directly.",
    ]
      .filter((l) => l !== null)
      .join("\n");

    const raw = buildMime({ from: env.FROM, to: env.TO, replyTo: email, subject, body });

    try {
      await env.CONTACT_EMAIL.send(new EmailMessage(env.FROM, env.TO, raw));
      return Response.json({ ok: true });
    } catch (err) {
      return new Response(`send failed: ${String(err?.message || err)}`, { status: 502 });
    }
  },
};
