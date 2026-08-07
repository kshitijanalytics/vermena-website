# Vermena Consulting — website

Static site (Option 4 design). Plain HTML/CSS + a little vanilla JS, no build step, no framework.

## Structure

```
index.html         Home
services.html       Services
about.html          About
contact.html        Contact (real HTML form, posts straight to Zoho CRM)
thank-you.html      Landing page Zoho redirects to after a successful submit
404.html            Custom not-found page
terms.html          Terms & Conditions
privacy.html        Privacy Policy
css/style.css        Shared stylesheet (design tokens, layout, components)
js/cookie-consent.js Cookie banner logic (localStorage-based)
js/contact-form.js   Progressive-enhancement form validation
assets/              Logos, partner photos, favicons, og-image.png
robots.txt           Allows indexing, points to sitemap.xml
sitemap.xml          Lists all public pages
site.webmanifest      Icons for "add to home screen"
CNAME                Custom domain for GitHub Pages (added during deployment)
```

## Local preview

Run a tiny local server from this folder rather than opening files directly
via `file://` — some browsers restrict `fetch()`/script loading on the
`file://` origin, which affects the contact form's JS validation:

```bash
python -m http.server 8080
```

Then visit http://localhost:8080. Everything works normally once served over
http/https, including on GitHub Pages.

## Contact form → Zoho CRM

`contact.html` has a real, static `<form>` — no JavaScript builds the fields
— that posts directly to your Zoho CRM's **Web-to-Lead** endpoint (the
"Vermena Thank You Page" form under Setup → Web Forms). The hidden tokens
(`xnQsjsdp`, `xmIwtLD`, `actionType`, `returnURL`) are already the real ones
Zoho generated for this form — **this is live, not a placeholder.** Don't
edit or remove them; if the Zoho web form is ever recreated, swap in the new
generated block.

We kept Zoho's field names (`Last Name`, `Company`, `Email`, `Description`)
and its honeypot field (`aG9uZXlwb3Q` — the odd name is intentional, Zoho's
own bot trap) exactly as generated, but **dropped Zoho's default styling and
its `alert()`-popup validation script**, replacing them with the site's own
inline red-border validation (`js/contact-form.js`) so the form matches the
rest of the site instead of Zoho's default blue-gradient button and Arial
labels. Submission behaviour is unchanged — same fields, same endpoint.

A few things worth knowing:

- **Company is now a required field** on the form (not optional as in the
  original design) because Zoho's generated code marks it mandatory for
  Leads in your account. If you'd rather it be optional, go to **Setup →
  Customization → Modules → Leads → Fields → Company** in Zoho and uncheck
  "Mandatory," then remove `required` from the Company input in
  `contact.html` and the matching check in `js/contact-form.js`.
- **Lead Source** is hardcoded to `Web Research` — the closest existing
  option in your account's picklist, since a literal "Website" value isn't
  one of the choices Zoho generated. Change the hidden field's value (and,
  if you want an exact "Website" label, add that as a new picklist option
  under Setup → Customization → Modules → Leads → Fields → Lead Source)
  if you'd prefer a different one.
- The **Zoho Web Form analytics `<script>` tag** (`wf_anal`) at the bottom
  of the form is marked "do not remove" by Zoho — it reports form views back
  to your CRM's web form analytics, left in place untouched.
- "What are you using today?" isn't a real Zoho field — `js/contact-form.js`
  folds its value into Description before submit so nothing is lost.

**Still to do — turn on the auto-reply**: Setup → Automation → **Workflow
Rules** (or search "Auto-Response Rules" in Setup search) → create a rule on
the **Leads** module, trigger "when a record is created" (optionally
filtered to Lead Source = Web Research), action = send email to
`${Lead.Email}` with your acknowledgement text (e.g. "Thanks for reaching
out — a partner will get back to you within one business day."). This is
the one manual step left in Zoho; everything on the website side is done.

`js/contact-form.js` also progressively enhances the form with inline
red-border validation (required: Name, Company, Work email, What's not
working). If JavaScript is unavailable, native `required` validation still
applies and the form posts normally straight to Zoho.

## SEO / social sharing

- Every page has a unique `<title>`, meta description, canonical URL, and
  `<meta name="robots" content="index, follow">` (nothing is set to noindex,
  except the utility pages `404.html` and `thank-you.html`, which
  intentionally are).
- Open Graph + Twitter Card tags use `assets/og-image.png` (1200×630) so
  shared links render a full preview card instead of a blank box.
- `robots.txt` and `sitemap.xml` are at the site root — after deploying,
  submit the sitemap in Google Search Console.
- All URLs in meta tags currently point to `https://vermena.in/` — update
  these if the final domain differs.

## Cookie consent

`js/cookie-consent.js` shows a bottom banner (Accept / Decline) on first
visit and remembers the choice in `localStorage`. No analytics script is
wired up yet — when you add one (GA4, Plausible, etc.), only load it after
`vermena:cookie-consent` fires with `accepted` (see the commented example at
the bottom of `js/cookie-consent.js`).

## Legal pages

`terms.html` and `privacy.html` reproduce the text you provided, LLPIN
confirmed. No Grievance Officer section is included, by design.

## Deployment

See the deployment steps provided separately (GitHub + GitHub Pages + GoDaddy
domain DNS + Zoho CRM Web-to-Lead + Search Console).
