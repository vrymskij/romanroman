# RomanRoman — Cloudflare + D1

This version uses a Cloudflare Worker to serve the static site and handle `/subscribe`.

## Cloudflare resources already configured
- Worker: `romanroman`
- D1 binding: `DB`
- D1 database: `romanroman-emails`

## Repository structure
- `worker.js` — `/subscribe` API and static-asset routing
- `wrangler.jsonc` — Worker/assets/D1 configuration
- `public/` — website files only

The `public/` directory prevents `.git` and Wrangler temporary files from being uploaded as public assets.

## D1 table expected
`subscribers(email, interest, created_at)` with a unique constraint on `(email, interest)`.

Interests:
- `updates`
- `paper_book`
