# HOM Construction Ltd. — Launch Checklist

Static site, no build step. Upload the whole `hom-construction/` folder to your host (root = `index.html`).

## Before go-live (replace placeholders)
1. **Phone & email** — add to `index.html` (JSON-LD `telephone`), footer, and contact section.
2. **Lead form** — in `js/main.js`, replace the TODO with a real handler:
   - Email: Formspree / Basin / your form endpoint, OR
   - Landing page: point `form.action` to your lead-filter page.
   Form already captures: name, address, phone, email, ADU type, timeline, ownership, budget, notes.
3. **Google Reviews widget** — paste embed into `#reviews .google-reviews-placeholder` (replace the placeholder badge).
4. **Financeit widget** — paste embed into `.financeit-placeholder` (Financing section).
5. **Matterport** — set the two `.matterport-link` `href`s to your tour URLs (Gallery section).
6. **Project photos** — swap the CSS-pattern `.gallery-item` / `.media-block` blocks for real `<img>` tags.
7. **Logo** — swap text `.brand-mark` for your logo image if desired.
8. **og-image.jpg** — add a 1200x630 share image at root.
9. **Keywords** — fold in the list from Michael Miceli / Page Pros across titles, H1s, and meta.

## SEO already in place
- Per-page titles, meta descriptions, canonical tags
- LocalBusiness / GeneralContractor JSON-LD (home + each area page)
- Dedicated area pages: London, Strathroy, St. Thomas, Woodstock
- sitemap.xml + robots.txt

## Brand colours (css/style.css :root) — now set from your logo
- Primary blue `--brand-blue:#104090` (buttons, links, structure)
- Orange accent `--orange:#F08030` (eyebrows, "We build.", review names, highlights)
Kept restrained so it reads powerful, not flashy.

## Logo
Your logo (`assets/hom-logo.avif` + `.png` fallback) is in the header, footer, and favicon.

## Reviews
Six real Google reviews are built into the Reviews section, each marked "Verified Google Review." The badge links to your Google profile (share.google/WOeoYm1ViX1rlSRPR). Replace with the live Google Reviews widget on launch.

## Social
Instagram (@homconstructionltd) and Google links are in the footer.
