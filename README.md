# RomanRoman — Cloudflare + D1 + Markdown poems

The existing Cloudflare Worker and D1 email collection remain unchanged. The site now generates the poem archive and individual poem pages from Markdown files.

## Adding a poem

Create a new file in `content/poems/`, for example `content/poems/doroga.md`:

```md
---
title: "Дорога"
year: "2026"
featured: false
order: 20
topics:
  - "дорога"
  - "пам’ять"
  - "час"
audio: ""
---

Перший рядок вірша.
Другий рядок вірша.
```

- `featured: true` = show on the landing page.
- `featured: false` = show only on **Усі вірші**.
- The homepage displays at most 8 featured poems.
- `audio: ""` = no audio player.
- To add audio, upload an MP3 to `public/audio/` and set e.g. `audio: "doroga.mp3"`.
- `order` controls ordering. Lower numbers appear first.

## Cloudflare build setting

Set **Build command** to:

`npm run build`

Keep **Deploy command** as:

`npx wrangler deploy`

## Existing backend

- Worker: `romanroman`
- D1 binding: `DB`
- D1 database: `romanroman-emails`
- `/subscribe` remains the email signup endpoint.
