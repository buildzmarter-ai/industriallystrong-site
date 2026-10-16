# is-contact-mailer

Emails submissions from the contact form at industriallystrong.com/contact.

## How it fits together

1. The form posts to the Pages Function `functions/api/contact.js`.
2. That function filters bots, then stores every accepted message in the
   `contact_messages` table of the existing D1 database (`is-telemetry`).
   Messages are kept even if email is not set up or fails.
3. If the Pages project has a service binding `CONTACT_MAILER`, the function
   calls this Worker, which emails the message to the destination address
   with Reply-To set to the sender.

Pages Functions cannot send email themselves, which is why the sending
happens in this separate Worker. It has no public URL (`workers_dev = false`,
no routes); only the Pages project can call it.

The destination address is the Worker secret `TO`. It is not in this repo.

## One-time setup

1. Cloudflare dashboard → industriallystrong.com → Email → Email Routing:
   enable it, then add the destination address and click the verification
   link Cloudflare emails to it.
2. From this folder:

       npx wrangler secret put TO
       npx wrangler deploy

3. Cloudflare dashboard → Workers & Pages → the site's Pages project →
   Settings → Bindings → Add → Service binding:
   name `CONTACT_MAILER`, service `is-contact-mailer`. Then redeploy the site.

## Reading stored messages

    npx wrangler d1 execute is-telemetry --remote --command \
      "SELECT id, created_at, name, email, company, emailed, email_error FROM contact_messages ORDER BY id DESC LIMIT 20"

`emailed = 1` means the mailer accepted it. A non-empty `email_error` says
why a send failed; the message itself is still in the table.

## Local testing

    # terminal 1, in this folder (TO is a test value, not committed)
    printf 'TO=test@example.com\n' > .dev.vars
    npx wrangler dev --port 8788

    # terminal 2, at the repo root, after npm run build
    npx wrangler pages dev dist --d1 DB=local-test-db --service CONTACT_MAILER=is-contact-mailer

Local sends are written to `.wrangler/tmp/email/` instead of being delivered.
