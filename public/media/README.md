# public/media

Served assets. Filenames must match exactly; the extension is flexible —
`.avif` → `.webp` → `.jpg` → `.png` for stills (first match wins),
`.webm` → `.mp4` for video, `.mp3` → `.m4a` → `.ogg` for the music.

Nothing here is required: every slot falls back to animated CSS/SVG art, and
sections with no art hide themselves entirely rather than show placeholders.

## In place

| File | Ratio | Where it appears |
|---|---|---|
| `hero-muhurtham-poster` | 16:9 | Hero background (couple under the mandapam) |
| `couple-portrait` | 3:4 | Arch frame in "The Invitation" (walking the paddy path) |
| `mangalsutra` | 4:3 | The Wedding card (muhurtham at sunrise) |
| `reception-night` | 4:3 | The Reception card (evening stage) |
| `nurella-thodu.mp3` | — | Background music; starts when the tera opens |

## Still to come

| Scene | File | Ratio | Where it will appear |
|---|---|---|---|
| 5. Venue and map | `mandapam-wide` | 16:9 | Fills the venue panel beside "A place to gather" |
| 6. Countdown | `countdown-band` | 16:9 | Soft band behind the countdown (renders at 26% opacity) |
| 7. RSVP and footer | `rsvp-band` | 16:9 | Soft band behind the RSVP form (30% opacity) |
| 8. Tradition icons | `tradition-1` … `tradition-4` | 1:1 | Round icon row; **unlocks the whole Rituals section**, which is hidden until at least one exists |

The four tradition icons are labelled, in order:
జీలకర్ర బెల్లం (cumin & jaggery) · తలంబ్రాలు (rice & pearls) ·
మాంగళ్య ధారణ (the sacred knots) · గోరింటాకు (mehendi).
Fewer than four is fine — only the ones present are shown.

Scenes 6 and 7 sit behind text at low opacity, so prefer calm, wide,
low-contrast compositions with no faces near the centre.

## Adding one

Raw model output is 2–3 MB per PNG, which is far too heavy to ship. Convert it:

```bash
brew install webp libavif          # once
scripts/prepare-image.sh mandapam-wide ~/Downloads/Venue_And_Map.png
scripts/prepare-image.sh tradition-1   ~/Downloads/Jeelakarra.png --width 600
```

That writes `.avif` + `.webp` here and keeps the full-resolution original in
`assets-src/` (not served). Then reload — the slot activates on its own.

Video slots (`hero-muhurtham`, `diya-loop`) use `scripts/prepare-media.sh`
instead. Prompts and model notes: `../../PROMPTS.md`.
