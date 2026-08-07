# Vermena Website — Release Notes

## v1.0 — 2026-08-07 — Initial launch

`https://vermena.in` is live, on GitHub Pages, DNS pointed via GoDaddy.

### What shipped

- **Four content pages** — Home, Services, About, Contact — built from the
  approved Option 4 design (editorial layout, warm-teal palette).
- **Contact form → Zoho CRM.** Real HTML form posts directly to Zoho's
  Web-to-Lead endpoint; every submission creates a Lead. Styled and
  validated to match the site rather than Zoho's default form appearance.
- **SEO basics**: unique titles/descriptions per page, canonical URLs,
  explicit `index, follow` (nothing accidentally noindexed), sitemap.xml +
  robots.txt.
- **Social sharing**: Open Graph + Twitter Card tags with a custom branded
  1200×630 preview image, so links posted to LinkedIn/etc. render a proper
  card.
- **Favicon set**: SVG + PNG/ICO variants, browser tab + "add to home
  screen" icons.
- **Cookie consent banner**: Accept/Decline, remembered per visitor,
  ready to gate future analytics behind consent.
- **404 page** in the site's own design system.
- **Terms & Conditions and Privacy Policy** pages, using the LLP's reviewed
  legal text.
- **LinkedIn** footer/contact links point to the real company page.

### Decisions made during the build (worth knowing)

- **Web3Forms → Zoho CRM.** Originally built on Web3Forms; switched because
  its auto-responder is a paid feature. Posting straight to Zoho instead
  means one integration handles both lead capture *and* (once the Workflow
  Rule is set up — see below) the acknowledgement email, with no separate
  service or cost.
- **Company is a required field** on the contact form, not optional as in
  the original design — Zoho's Leads module requires it by default in this
  account, and leaving it optional in the UI would have let visitors submit
  leads Zoho silently rejected.
- **Lead Source is set to "Web Research"** — the closest existing option in
  the account's picklist; a literal "Website" value wasn't available.
- Stat bar on the homepage ("30+ yrs", "9+ yrs", "100%", "Platform: Zoho")
  now uses identical formatting/padding across all four cells — the last
  cell originally used a different, smaller layout than the other three.
- Removed a broken internal cross-reference ("see section 11") from the
  Privacy Policy — the source text didn't include a section 11. No
  Grievance Officer section was added, per direction.
- LLPIN on the legal pages (`ADA-0990`) was confirmed correct.

### Known open items

- [ ] **Zoho Auto-Response Rule** — the form creates Leads now, but the
      "we'll reply within one business day" acknowledgement email needs a
      Workflow Rule set up in Zoho CRM (Setup → Automation → Workflow
      Rules). Not yet confirmed as done.
- [ ] **Google Search Console** — domain property + sitemap submission not
      yet completed. Steps are in the deployment conversation / can be
      re-shared on request.
- [ ] No analytics installed yet (deliberately — cookie banner is ready,
      nothing to gate yet).

### Launch hiccup, for the record

DNS took a couple of rounds to get right — GoDaddy's domain shipped with a
default "WebsiteBuilder" A record pointing at their own parking page, which
had to be deleted and replaced with GitHub Pages' IPs before the site would
resolve correctly. Full detail in `docs/ENGINEERING.md` §7, in case it comes
up again on a future domain.

---

*Full technical detail lives in `docs/ENGINEERING.md` — this file is the
"what shipped and why," that one's the "how it works."*
