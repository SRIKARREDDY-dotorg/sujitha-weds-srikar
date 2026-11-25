# public/media

Served assets. Filenames must match exactly; the extension is flexible —
`.avif` → `.webp` → `.jpg` → `.png` for stills (first match wins),
`.webm` → `.mp4` for video, `.mp3` → `.m4a` → `.ogg` for the music.

Nothing here is required: every slot falls back to animated CSS/SVG art, and
sections with no art hide themselves entirely rather than show placeholders.

## In place — all 8 scenes

| File | Ratio | Where it appears |
|---|---|---|
| `hero-muhurtham.mp4` | 16:9 | Hero background film, looping at half speed |
| `hero-muhurtham-poster` | 16:9 | Hero poster — shows until the film plays, and instead of it under reduced motion |
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

Still unused, and the site is complete without it: **`diya-loop`** — a real
flame in the countdown band, via `scripts/prepare-media.sh`.

## The hero film

Slow motion is applied in the browser, not baked into the file: `HeroFilm`
sets `playbackRate` (and `defaultPlaybackRate`, so it survives looping). The
clip is 5s and plays at **0.5x**, so a 10s loop. To change the speed, edit the
`rate` prop on `<HeroFilm>` in `src/main.jsx` — no re-encoding needed.

Two things baked into the CSS for this particular clip:

- The source has a **generator watermark in its top-right corner**.
  `.hero-film-video` is bottom-aligned and scaled 1.06 to push it out of
  frame, with a separate `object-position` under 800px where `cover` crops
  horizontally instead. If you swap in a clean clip, both can go.
- The loop has a visible cut, because image-to-video models do not produce
  matching first and last frames. `scripts/prepare-media.sh --loop` builds a
  seamless palindrome, but it needs `ffmpeg` (`brew install ffmpeg`), which is
  not installed here. Worth doing if the seam bothers you.

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
