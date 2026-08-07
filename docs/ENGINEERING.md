# Vermena Website — Engineering Reference

Last updated: 2026-08-07 · Covers v1.0 (initial launch)

This is the living technical reference for vermena.in. Read this before making
changes — it explains what exists, why it's built this way, and how to extend
it safely.

## 1. Stack & philosophy

Plain HTML + CSS + a little vanilla JavaScript. No build step, no framework,
no package.json. Each page is a self-contained `.html` file with its own
`<head>`, sharing one stylesheet (`css/style.css`) and two small scripts
(`js/cookie-consent.js`, `js/contact-form.js`).

This was a deliberate choice, not a shortcut: the site is four content pages
plus a handful of utility pages, hosted on GitHub Pages (static hosting
only — no server, no functions). A build pipeline would add maintenance
surface without buying anything a static site needs. If the site grows past
~10–15 pages, or needs a CMS, revisit this — a static-site generator (Astro,
11ty) would remove the copy-pasted header/footer markup without changing the
hosting model.

## 2. Repository structure

```
index.html         Home
services.html       Services
about.html          About
contact.html        Contact — real HTML form, posts to Zoho CRM
thank-you.html      Landing page Zoho redirects to after a successful submit
404.html            Custom not-found page
terms.html          Terms & Conditions
privacy.html        Privacy Policy
css/style.css        Shared design tokens, layout, components (single file)
js/cookie-consent.js Cookie banner logic (localStorage-based)
js/contact-form.js   Contact form validation + Zoho field mapping
assets/              Logos (SVG), partner photos, favicons, og-image.png
robots.txt           Allows indexing, points to sitemap.xml
sitemap.xml          Lists all public pages
site.webmanifest      Icons for "add to home screen"
CNAME                vermena.in — GitHub Pages custom domain
docs/                 This file + release notes
```

Every page repeats the same `<header class="site-header">` and
`<footer class="site-footer">` markup by hand — there's no templating layer.
**When you change the nav or footer, you're changing it in eight files.**
Grep for the block you're editing and repeat it; don't let one page drift.

## 3. Design system

Defined as CSS custom properties at the top of `css/style.css`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f7f9fa` | Page background |
| `--text` | `#13232e` | Body text |
| `--muted` / `--muted-2` / `--muted-3` | `#43555f` / `#5d707b` / `#7e909b` | Secondary text, in decreasing emphasis |
| `--teal` | `#0d6e8c` | Primary accent — links, buttons, eyebrows |
| `--navy` | `#0d3547` | Dark panels, footer |
| `--navy-accent` | `#7fc2d8` | Accent text/icons on navy panels |
| `--border` | `#e2e9ed` | Hairline rules, card borders |

Type: **Source Serif 4** for headings (loaded via Google Fonts `<link>` —
fine for the live site, but see §7 for why artifacts/exports can't do this),
**Libre Franklin** for body text, **IBM Plex Mono** for eyebrow labels,
stat numbers, and anything data-like.

Components (all in `style.css`, no per-page CSS): `.btn` / `.btn-primary` /
`.btn-outline`, `.card`, `.pill`, `.eyebrow`, `.hero`, `.stat-bar`,
`.service-row`, `.partner-card`, `.contact-form-card`, `.cookie-banner`,
`.legal-doc`, `.error-page`. Responsive breakpoints at 900px and 600px
collapse multi-column grids to one column — see the `@media` blocks at the
bottom of the file.

## 4. Contact form → Zoho CRM

This is the most operationally important part of the site — read carefully
before touching it.

### How it works

`contact.html` has a real, static `<form>` (no JavaScript builds the fields)
that POSTs directly to Zoho CRM's **Web-to-Lead** endpoint
(`https://crm.zoho.in/crm/WebToLeadForm`). No backend, no third-party form
service — Zoho receives the POST, creates a Lead, and (once configured — see
§4.4) sends an acknowledgement email.

### Field mapping

| Form field (visible) | `name` attribute | Zoho Lead field | Required? |
|---|---|---|---|
| Name | `Last Name` | Last Name | Yes — Zoho mandatory |
| Company | `Company` | Company | Yes — Zoho mandatory |
| Work email | `Email` | Email | Yes — enforced by us (not by Zoho) |
| What are you using today? | `Current_Tools` | *(not a real field — see below)* | No |
| What's not working? | `Description` | Description | Yes — enforced by us |

`Current_Tools` isn't a real Zoho field name — nothing was created for it.
`js/contact-form.js` folds its value into the `Description` textarea's value
right before submit (prefixed as "Currently using: X"), so the answer is
never lost even without a matching Zoho field. If you want it as a separate,
filterable field in Zoho, create a custom field there and rename this input
to match its exact API name.

### Hidden fields — do not edit

```html
<input type="text" style="display:none" name="xnQsjsdp" value="...">
<input type="hidden" name="zc_gad" id="zc_gad" value="">
<input type="text" style="display:none" name="xmIwtLD" value="...">
<input type="text" style="display:none" name="actionType" value="TGVhZHM=">
<input type="text" style="display:none" name="returnURL" value="https://vermena.in/thank-you.html">
```

These are account-specific tokens Zoho generated for this exact Web Form
(Setup → Web Forms → "Vermena Thank You Page"). They're safe to have in
public HTML — that's how Web-to-Lead is designed to work, anyone visiting
the site already sees them in "View Source." If the Zoho web form is ever
deleted and recreated, Zoho will issue new tokens and this whole block must
be replaced.

`Lead Source` is hardcoded to `Web Research` — the closest existing picklist
option in this Zoho account at build time (a literal "Website" value didn't
exist). Change the hidden field's value if you add a better-matching option
under Setup → Customization → Modules → Leads → Fields → Lead Source.

### Validation & spam protection

`js/contact-form.js` progressively enhances the form: on submit, it checks
Name/Company/Email/Description are filled (matching Zoho's own required
fields plus our own product requirement that Email be present), shows inline
red-border errors, and focuses the first invalid field. If JavaScript is
unavailable, native HTML5 `required` attributes still apply and the form
posts straight to Zoho.

There's also a honeypot field, `name="aG9uZXlwb3Q"` (Zoho's own base64-obscured
name for it, kept as generated) — invisible to real visitors via
`.honeypot-field` CSS, checked client-side before allowing submit. This is
basic bot filtering only, not a substitute for server-side spam controls.

We deliberately **removed** Zoho's own generated `<script>` block
(`checkMandatory...`, `validateEmail...`, `alert()`-based validation) and its
default CSS (blue gradient button, Arial labels) — replaced with the site's
own styling and validation so the form matches the rest of the site. Field
names and hidden tokens are unchanged, so this doesn't affect what Zoho
receives.

The `<script id="wf_anal" src="...WebFormAnalyticsServeServlet...">` tag near
the bottom of the form is Zoho's own form-view analytics — left in place
exactly as generated, per Zoho's "do not remove" comment.

### 4.4 — Acknowledgement email (open item)

The form creates a Lead on submit. The "we'll reply within one business day"
email is a **separate Zoho CRM Workflow Rule**, not part of the form itself:

Setup → Automation → Workflow Rules → new rule on **Leads**, trigger "when a
record is created," action = send email to `${Lead.Email}` with the
acknowledgement text. **Confirm this rule exists and is active** — without
it, leads are captured but no auto-reply goes out.

## 5. SEO & sharing

- Every real page: unique `<title>`, meta description, `<link rel="canonical">`,
  and `<meta name="robots" content="index, follow">`. `404.html` and
  `thank-you.html` are intentionally `noindex` — utility pages, not content.
- Open Graph + Twitter Card tags on every page point to `assets/og-image.png`
  (1200×630, generated once via a headless-rendered PNG — see git history if
  it needs regenerating with different copy).
- `favicon.svg` is the source of truth for the brand mark icon (same
  navy/teal checkmark motif as the logo); the PNG/ICO variants in
  `assets/favicon/` were rendered from it for browser/OS compatibility.
- `robots.txt` + `sitemap.xml` live at the root. If you add a page, add it to
  `sitemap.xml` too — nothing does this automatically.
- All canonical/OG URLs are hardcoded to `https://vermena.in/...`. If the
  domain ever changes, that's a find-and-replace across every `.html` file.

## 6. Cookie consent

`js/cookie-consent.js` is a from-scratch ~40-line script, no library. Shows a
bottom banner on first visit, stores the choice (`accepted`/`declined`) in
`localStorage` under `vermena_cookie_consent`, and fires a
`vermena:cookie-consent` custom event other scripts can listen for.

**No analytics is wired up yet.** When adding GA4/Plausible/etc., gate the
script tag behind that event firing with `accepted` — there's a commented
example at the bottom of the file. Don't load analytics unconditionally; that
defeats the point of the banner.

## 7. Deployment

**Hosting**: GitHub Pages, serving from the `main` branch root, repo
`kshitijanalytics/vermena-website` (public — GitHub Pages on private repos
needs a paid GitHub plan).

**Domain**: `vermena.in`, registered at GoDaddy. DNS is four `A` records on
`@` pointing at GitHub Pages' fixed IPs (185.199.108/109/110/111.153) and one
`CNAME` on `www` → `kshitijanalytics.github.io`. The `CNAME` file at the repo
root tells GitHub Pages which custom domain to serve.

**Gotcha hit during launch**: GoDaddy domains often ship with a default
`A @ → WebsiteBuilder Site` record (or an active "Forwarding" rule, which is
separate from DNS records entirely) pointing at GoDaddy's own parking page.
Both must be removed/disabled or they silently override the GitHub Pages
records. If the live site ever reverts to showing a GoDaddy placeholder page,
check DNS records *and* the Forwarding tab in GoDaddy first.

**Propagation note**: after a DNS change, different resolvers catch up at
different speeds — sometimes hours apart between e.g. Google's 8.8.8.8 and a
local ISP resolver. `nslookup domain 8.8.8.8` is the fastest way to check the
"real," already-propagated answer without waiting on local cache.

**To deploy a change**: commit and push to `main` — GitHub Pages redeploys
automatically, typically within a minute or two. There's no staging
environment; test locally first (see README's "Local preview" section — use
a local server, not `file://`, since the contact form's `fetch`-adjacent
validation logic behaves differently under the `file://` origin).

## 8. Common changes — how to

**Add a new page**: copy an existing page closest in structure (e.g.
`about.html` for another content page), keep the header/footer markup
identical to the others, update the SEO block (title/description/canonical/
OG/Twitter), add it to `sitemap.xml`, and add a nav link to it on *every*
page's `<nav class="site-nav">` (there's no shared partial — see §2).

**Change a color or font**: edit the custom property in `css/style.css`
§"design tokens" — it cascades everywhere that token is used. Don't
hardcode a new color inline in a page; add or reuse a token instead.

**Add a contact form field**: add the visible `<div class="field">` markup,
give the input a `name` matching either an existing Zoho field or a new
custom field you've created in Zoho, and if it should be required, add it to
the `validate()` function in `js/contact-form.js`.

**Regenerate the OG image or favicon**: both were produced by
programmatically rendering the SVG logo + brand type in a headless browser
(Archivo font from Google Fonts) and exporting a PNG — there's no source
Figma file for these; re-run the same approach (render the SVG at target
size on a canvas, export) if the copy or branding changes.

**Update Terms/Privacy**: edit `terms.html` / `privacy.html` directly — the
`.legal-doc` CSS class handles the typography, just keep the `<h2>`/`<p>`
structure consistent so numbering and spacing stay even.

## 9. Known open items / technical debt

- Zoho Auto-Response Rule — confirm it's live (§4.4).
- Google Search Console — domain verification + sitemap submission (see
  release notes for the exact steps taken/pending).
- No analytics wired up (cookie banner is ready for it — see §6).
- Company is required on the contact form because Zoho's Leads module
  requires it by default in this account. If that should be optional
  instead (matching the original design), the Zoho-side field needs to be
  set to non-mandatory first — see contact.html's inline comments.
- No automated tests, no CI, no build step — intentional for now (§1), but
  worth revisiting if the site's scope grows.
- Images (partner photos) aren't served in multiple sizes/formats — fine at
  current traffic levels, would want `srcset`/WebP if the site gets heavier.

## 10. Who to ask

Per the About page: **Kartikeya** (product/content, positioning, copy
decisions) and **Kshitij** (engineering, implementation, this document).
