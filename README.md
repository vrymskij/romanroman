# Poetry website

Ready for GitHub Pages or another static host.

## Edit
- Main content: `index.html`
- Design: `style.css`
- Individual poems: `poems/`
- Put MP3 recordings in `audio/` as `01.mp3`, `02.mp3`, etc.

## Important: email forms
A purely static GitHub Pages site cannot receive/store email addresses itself.
The current forms intentionally work in demo mode only. Connect them to a form/newsletter backend such as Formspree, Buttondown, Mailchimp, or your own endpoint before publishing.

## GitHub Pages
Upload the contents to a GitHub repository, then enable Pages in repository Settings → Pages.


## August 2026 refinements
Hero illustration refined; section numbering removed; audio download/playback-rate options disabled in native controls; copyright notice added.


## Optional audio on individual poem pages
Each poem page contains `data-audio-src=""` on the `<main class="poem-page">` element.

- No audio: leave `data-audio-src=""`
- With audio: set e.g. `data-audio-src="../audio/01.mp3"`

The audio player appears automatically only when a path is supplied.

## Topics
Each poem currently has 2–3 placeholder topic tags on the landing page and on its individual page.
Replace them with the actual themes of the poem in both locations when you add the real text.
