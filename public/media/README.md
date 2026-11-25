# public/media

Served assets. Filenames must match exactly; the extension is flexible —
`.avif` → `.webp` → `.jpg` → `.png` for stills (first match wins),
`.webm` → `.mp4` for video, `.mp3` → `.m4a` → `.ogg` for the music.

Nothing here is required: every slot falls back to animated CSS/SVG art, and
sections with no art hide themselves entirely rather than show placeholders.

## In place — all 8 scenes

| File | Ratio | Where it appears |
|---|---|---|
| `hero-muhurtham-poster` | 16:9 | Hero background (couple under the mandapam) |
| `couple-portrait` | 3:4 | Arch frame in "The Invitation" (walking the paddy path) |
| `mangalsutra` | 4:3 | The Wedding card (muhurtham at sunrise) |
| `reception-night` | 4:3 | The Reception card (evening stage) |
| `mandapam-wide` | 16:9 | Venue panel (the decorated mandapam) |
| `countdown-band` | ~2.6:1 | Texture behind the countdown, under a maroon scrim |
| `rsvp-band` | 16:9 | Texture behind the RSVP (oonjal swing), bottom-aligned |
| `tradition-1` … `tradition-4` | 1:1 | Round icon row in The Rituals |
| `kalyanam-vybhogam.m4a` | — | Background music; starts when the tera opens |

The tradition icons are labelled for what they depict —
కలశం (kalash) · తలంబ్రాలు (rice & pearls) · పసుపు (turmeric) ·
మల్లెపూలు (jasmine garland). If you swap a file, update `TRADITIONS` in
`src/media.jsx` to match, or the caption will describe the wrong thing.

### Known issue: `countdown-band`

The source (`assets-src/Countdown.png`) has a calendar as its focal point, and
the AI rendered it with garbled text and the wrong dates circled — 6, 11, 12,
14 and 19 as well as 13. On a wedding invitation that is a real risk of
misleading a guest, so the served crop deliberately excludes it, keeping only
the diyas, petals and muggu. To use the full composition, regenerate the scene
with `no calendar, no text, no numbers, no writing` in the prompt.

### Band tuning

Bands sit behind body text. Tune the `scrim` prop (a wash of the section's own
colour) before touching `opacity` — lowering opacity alone fades the art toward
white, which on the dark countdown section makes contrast worse, not better.

## Optional extras

Still unused, and the site is complete without them:
**`hero-muhurtham`** (video, replaces the hero still) and **`diya-loop`**
(a real flame in the countdown band) — both via `scripts/prepare-media.sh`.

## Swapping the music

The served file is a 96kbps AAC re-encode; the 320kbps master is in
`assets-src/`. Background audio does not need studio bitrate, and the track is
fetched for everyone who opens the invitation, so the smaller file matters.

```bash
afconvert -f m4af -d aac -b 96000 -s 3 ~/Downloads/new-track.mp3 \
  public/media/kalyanam-vybhogam.m4a
```

`afconvert` ships with macOS. To use a different filename, change `AUDIO.file`
in `src/media.jsx`. With no audio file present the SOUND toggle hides itself,
so nothing looks broken.

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
