// is-contact-mailer
//
// Emails contact-form submissions from industriallystrong.com to the
// verified Email Routing destination address. Called only by the Pages
// Function /api/contact through a service binding; workers_dev is off and
// there is no route, so it has no public URL.

import { EmailMessage } from "cloudflare:email";

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

    if (!env.TO || !env.FROM) {
      return new Response("mailer not configured: set the TO secret", { status: 500 });
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
