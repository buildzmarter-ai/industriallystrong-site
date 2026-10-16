# is-contact-mailer

Emails submissions from the contact form at industriallystrong.com/contact.

## How it fits together

1. The form posts to the Pages Function `functions/api/contact.js`.
2. That function filters bots, then stores every accepted message in the
   `contact_messages` table of the existing D1 database (`is-telemetry`).
   Messages are kept even if email is not set up or fails.
3. It then calls this Worker over HTTPS with a shared key, and the Worker
   emails the message to the destination address with Reply-To set to the
   sender.

Pages Functions cannot send email themselves, which is why sending happens
in this separate Worker. The Worker must live in the Cloudflare account that
owns the industriallystrong.com zone (Headydiscy), because Email Routing is
enabled there. The site's Pages project is in a different account
(Build.zmarter), so a service binding is impossible; hence the HTTPS call
with `MAILER_KEY`. Requests without the key get 401.

Secrets, never committed: `TO` (destination address) and `MAILER_KEY` on the
Worker; `CONTACT_MAILER_URL` and `CONTACT_MAILER_KEY` on the Pages project.

## One-time setup

All commands run from this folder. `wrangler` is logged into several
accounts, so each command pins the right one.

1. Email Routing enabled on industriallystrong.com, destination address
   verified (done 2026-10-16).
2. Worker (Headydiscy account, f9ccfe25…):

       CLOUDFLARE_ACCOUNT_ID=f9ccfe25cec35412e8d1f5a8f0080ccd npx wrangler deploy
       CLOUDFLARE_ACCOUNT_ID=f9ccfe25cec35412e8d1f5a8f0080ccd npx wrangler secret put TO
       CLOUDFLARE_ACCOUNT_ID=f9ccfe25cec35412e8d1f5a8f0080ccd npx wrangler secret put MAILER_KEY

3. Pages project `industriallystrong-site-pages` (Build.zmarter account,
   82224a76…), with the Worker's workers.dev URL and the same key:

       CLOUDFLARE_ACCOUNT_ID=82224a76c26a2dafa186afd17712fa08 npx wrangler pages secret put CONTACT_MAILER_URL --project-name industriallystrong-site-pages
       CLOUDFLARE_ACCOUNT_ID=82224a76c26a2dafa186afd17712fa08 npx wrangler pages secret put CONTACT_MAILER_KEY --project-name industriallystrong-site-pages

   Then redeploy the site (a push to main does it).

## Reading stored messages

    CLOUDFLARE_ACCOUNT_ID=82224a76c26a2dafa186afd17712fa08 npx wrangler d1 execute is-telemetry --remote --command \
      "SELECT id, created_at, name, email, company, emailed, email_error FROM contact_messages ORDER BY id DESC LIMIT 20"

`emailed = 1` means the mailer accepted it. A non-empty `email_error` says
why a send failed; the message itself is still in the table.

## Local testing

    # terminal 1, in this folder (TO is a test value, not committed)
    printf 'TO=test@example.com\nMAILER_KEY=local-key\n' > .dev.vars
    npx wrangler dev --port 8788

    # terminal 2, at the repo root, after npm run build
    npx wrangler pages dev dist --d1 DB=local-test-db \
      --binding CONTACT_MAILER_URL=http://localhost:8788/ --binding CONTACT_MAILER_KEY=local-key

Local sends are written to `.wrangler/tmp/email/` instead of being delivered.
