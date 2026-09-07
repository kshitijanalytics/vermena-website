# Vermena — website

Static site (new design: end-to-end product growth partner positioning —
Product Strategy, MVP Builds, Systems for Growth, CRM Implementation).
Plain HTML/CSS + a little vanilla JS, no build step, no framework.

## Structure

```
index.html          Home
services.html        Services
our-process.html      Our Process
about.html           About Us
contact.html          Contact (real HTML form, posts straight to Zoho CRM)
thank-you.html        Landing page Zoho redirects to after a successful submit
404.html             Custom not-found page
terms.html            Terms & Conditions
privacy.html          Privacy Policy
css/site.css          Shared stylesheet (design tokens, layout, components)
js/cookie-consent.js  Cookie banner logic (localStorage-based)
js/mobile-nav.js       Mobile hamburger menu toggle
js/contact-form.js    Progressive-enhancement form validation
assets/               Logos, partner photos, office photo, favicons, og-image.png
robots.txt            Allows indexing, points to sitemap.xml
sitemap.xml            Lists all public pages
site.webmanifest       Icons for "add to home screen"
favicon.ico            Legacy multi-size favicon (16/32/48)
CNAME                  Custom domain for GitHub Pages
```

There is no "Insights" page yet — the nav intentionally omits it until that
content is provided.

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
— that posts directly to your Zoho CRM's **Web-to-Lead** endpoint. The
hidden tokens (`xnQsjsdp`, `xmIwtLD`, `actionType`, `returnURL`) are the real
ones Zoho generated for this form — **this is live, not a placeholder.**
Don't edit or remove them; if the Zoho web form is ever recreated, swap in
the new generated block.

Fields: Name → `Last Name`, Company → `Company`, Work email → `Email`,
Mobile (optional) → `Phone`, Description → `Description`. Name, Company,
Email and Description are required; Mobile is optional. The honeypot field
(`aG9uZXlwb3Q` — Zoho's own bot trap) is kept exactly as generated, and the
Zoho Web Form analytics `<script>` tag (`wf_anal`) at the bottom of the form
is marked "do not remove" by Zoho — left in place untouched.

`js/contact-form.js` progressively enhances the form with inline red-border
validation and focuses the first invalid field. If JavaScript is
unavailable, native `required` validation still applies and the form posts
normally straight to Zoho, redirecting to `thank-you.html` on success.

**Lead Source** is hardcoded to `Web Research` (hidden field) — change its
value in `contact.html` if you'd prefer a different picklist option.

## Booking a consultation

"Book a Consultation" buttons (hero / CTA bands) link out to
`https://cal.com/kartikeyanegi/30min` in a new tab. The header/nav "Contact
Us" link goes to `contact.html` instead.

## SEO / social sharing

- Every page has a unique `<title>`, meta description, canonical URL, and
  `<meta name="robots" content="index, follow">` (except the utility pages
  `404.html` and `thank-you.html`, which are intentionally `noindex`).
- Open Graph + Twitter Card tags on the main marketing pages use
  `assets/og-image.png` (1200×630) so shared links render a full preview
  card instead of a blank box.
- `robots.txt` and `sitemap.xml` are at the site root — after deploying,
  resubmit the sitemap in Google Search Console (URL set changed with the
  redesign: `our-process.html` was added).
- Favicon set (`favicon.ico`, `assets/favicon/*.png`, `assets/favicon.svg`,
  `site.webmanifest`) was regenerated from the new logo mark/brand colors.

## Cookie consent

`js/cookie-consent.js` shows a bottom banner (Accept / Decline) on first
visit and remembers the choice in `localStorage`. Google Tag Manager
(`GTM-KXFGPZDN`) is consent-gated in every page's `<head>` — it only loads
after consent is accepted, and never loads at all for traffic flagged
`?internal=1` (stored in `localStorage` as `vermena_internal_traffic`).

## Legal pages

`terms.html` and `privacy.html` reproduce the same legal text as the
previous design verbatim (LLPIN: ADA-0990), restyled only — no wording
changes. No Grievance Officer section is included, by design.

## Rollback

The pre-redesign site (navy/teal, CRM-implementation-focused) is preserved
at git tag `pre-new-design-backup` if you ever need to revert:

```bash
git checkout pre-new-design-backup -- .
```
