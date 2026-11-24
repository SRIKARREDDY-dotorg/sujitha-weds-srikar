# AI Asset Prompt Pack — Traditional Telugu Wedding

Every slot below is **optional**. Drop a file into `public/media/` with the exact
base name and the site picks it up on reload — no code changes. If a file is
absent the animated CSS/SVG fallback shows instead, so nothing ever breaks.

**Accepted extensions**, best first: images `.avif` → `.webp` → `.jpg` → `.png`;
video `.webm` → `.mp4`. The loader tries them in that order and uses the first hit.

---

## 1. Shared style suffix

Append this to **every** still prompt so the whole set grades as one film and
sits inside the site's blush-and-gold palette:

> shot on 85mm f/1.8, shallow depth of field, warm golden-hour key light, soft
> blush and ivory palette with marigold orange and temple-gold accents, gentle
> film grain, Kodak Portra 400 colour science, photorealistic, hyper-detailed
> fabric texture, natural skin tones, no text, no watermark, no logo

Add a negative prompt where your tool supports it:

> plastic skin, waxy faces, extra fingers, deformed hands, text, watermark,
> logo, oversaturated, HDR halo, cartoon, illustration, 3d render, cgi

**Consistency tip:** generate the couple portrait first, then feed it back as an
image reference (Midjourney `--cref` / Flux Redux / Nano Banana multi-image) so
the same two faces appear in every ritual frame.

---

## 2. Slots

### `hero-muhurtham` — hero background video · 16:9 · 8–12 s seamless loop
Model: Veo 3 / Sora / Kling 2.x / Runway Gen-4. Keep camera motion tiny — text
sits on top of this.

> Cinematic slow push-in on a South Indian Telugu wedding muhurtham at dawn
> inside a kalyana mandapam. Bride in a deep maroon Kanjeevaram silk saree with
> a broad gold temple-border zari pallu, nose ring, jasmine gajra in her braid.
> Groom beside her in a cream pancha-kattu dhoti and angavastram with a gold
> border. Hands blurred in the foreground showering talambralu — rice mixed with
> pearls and turmeric — the grains catching the light mid-air. Marigold and mango
> leaf toranam strung overhead, brass diyas flickering, soft smoke from the
> homam fire drifting through shafts of 6 AM golden light between carved stone
> pillars. Shallow depth of field, almost imperceptible camera drift, loopable.

Also export frame 1 as **`hero-muhurtham-poster`** (16:9 still) — it shows while
the video buffers and is the only hero media on reduced-motion devices.

---

### `couple-portrait` — 4:5 portrait
> Photorealistic portrait of a young South Indian Telugu couple on their wedding
> day, standing close, looking at the camera with a quiet joyful smile. Bride in
> a deep red Kanjeevaram silk saree with gold temple border, traditional
> Andhra bridal jewellery — vaddanam waist belt, nethi chutti on the parting,
> kasula peru long coin necklace, jasmine garland. Groom in a cream silk
> pancha-kattu with a gold-bordered angavastram over one shoulder and a
> basinga headpiece. Soft bokeh of marigold garlands behind them.

---

### `talambralu` — 3:2
> Close shot of talambralu at a Telugu wedding: rice mixed with pearls, turmeric
> and tiny flower petals pouring from the bride's cupped hands onto the groom's
> head, grains frozen mid-air and backlit so each one glows. Her mehendi-covered
> hands and red-and-gold silk sleeve fill the frame edge. Joyful blurred faces
> of family behind.

---

### `mangalsutra` — 4:5
> Intimate close-up of the Mangalya Dharana at a Telugu wedding — the groom's
> hands tying the gold mangalsutra with its black thread and two gold discs
> around the bride's neck. Her head is bowed, maroon silk and gold temple
> jewellery visible, the three sacred knots being drawn tight. Warm lamplight,
> sacred and tender, faces softly out of frame.

---

### `jeelakarra-bellam` — 3:2
> Jeelakarra Bellam ritual at a Telugu wedding: bride and groom seated facing
> each other, each pressing a paste of cumin seeds and jaggery onto the other's
> head with both hands, laughing. A white cotton curtain (tera) has just been
> lowered beside them. Brass plates of turmeric, kumkum and flowers in the
> foreground, mandapam pillars behind.

---

### `mehendi-hands` — 1:1
> Macro photograph of a Telugu bride's hands and forearms covered in intricate
> fresh dark-red gorintaku mehendi — paisley, lotus and peacock motifs — resting
> on a maroon silk saree with gold zari. Gold bangles and a kada stacked at the
> wrist. Soft window light, fine henna texture visible.

---

### `mandapam-wide` — 16:9
> Wide establishing shot of a South Indian kalyana mandapam decorated for a
> Telugu wedding at golden hour. Carved stone pillars wrapped in marigold and
> jasmine garlands, mango-leaf toranam across the entrance, a muggu (rice-flour
> kolam) drawn on the floor in white with marigold petals pressed into it,
> rows of lit brass diyas, draped maroon and gold silk, empty decorated stage
> with two seats. Warm, inviting, nobody in frame.

---

### `toranam-closeup` — 3:2
> Close-up of a mango-leaf and marigold toranam strung across a doorway at a
> Telugu wedding, with jasmine strings hanging down beside it, shallow focus,
> warm morning backlight glowing through the leaves.

---

### `reception-night` — 3:2
> Telugu wedding reception stage at night: the couple's decorated stage framed by
> an arch of white and blush roses with marigold accents, warm fairy lights and
> hanging brass lanterns, deep evening blue sky behind, soft haze, rich
> cinematic colour, nobody in frame.

---

### `pellikuthuru` — 4:5
> Pelli Kuthuru ceremony: a young Telugu bride seated on a low wooden peeta,
> turmeric paste on her face and arms, wearing a simple yellow cotton saree with
> a red border, eyes lowered and smiling shyly, while older women's hands place
> rice and turmeric on her head in blessing. Soft morning courtyard light.

---

### `diya-loop` — 1:1 · 4–6 s seamless loop video
Rendered with `mix-blend-mode: screen`, so **shoot it on near-black**.

> Macro video loop of a single brass diya oil lamp flame flickering gently
> against a black background, warm amber glow, a few embers drifting upward,
> seamless loop, no camera movement.

---

## 2b. Which model to use

Two separate jobs. Nothing generates a good wedding video straight from text —
make the still first, then animate that exact still.

### Step 1 — the still

| Model | Where | Why for this |
|---|---|---|
| **Nano Banana Pro** (Gemini image) | Gemini app, Vertex AI | **Best for consistency.** Feed it a reference face and it holds the same two people across all 11 slots. Start here. |
| **Midjourney v7** | midjourney.com, Discord | Most beautiful light and fabric. Use omni-reference / `--cref` for faces. |
| **Flux.1 Kontext / Flux 2** | BFL API, Replicate, fal.ai | Best photoreal skin and silk texture; Kontext edits one detail without redrawing the frame. |
| **Seedream 4** | Dreamina / BytePlus | Very strong on South Asian faces and jewellery specifically. |

### Step 2 — animate the still (image-to-video)

| Model | Where | Why for this |
|---|---|---|
| **Kling 2.x** | klingai.com | **Best pick overall.** Strongest at human motion and flowing fabric — saree pallu, falling talambralu. Daily free credits, cheap top-ups. |
| **Google Veo 3.x** | Gemini app (AI Pro/Ultra), Flow, Vertex AI | Highest fidelity and best camera control. Priciest; generates audio you don't need (the site mutes it). |
| **Minimax Hailuo 02** | hailuoai.video | Near-Kling quality for less. Good fallback when credits run out. |
| **Luma Ray** (Dream Machine) | lumalabs.ai | Has a **native loop option** — the easiest route for `diya-loop`. |
| **Runway Gen-4** | runwayml.com | First/last-frame keyframing when you want an exact end state. |
| **Wan 2.2** | open weights, ComfyUI | Free and unlimited if you have a GPU. Slower, needs setup. |

Only two slots are video (`hero-muhurtham`, `diya-loop`), so you need very few
generations — budget accordingly rather than buying a big plan.

### Do this instead, for the hero

For *your own wedding*, don't generate strangers' faces. Take a real
engagement or pre-wedding **photo of Sujitha and Srikar**, feed it to Kling or
Veo as the image input, and prompt only the motion:

> Slow cinematic push-in. Keep faces and clothing exactly as in the photo.
> Gentle fabric movement, rice grains and petals drifting down through warm
> morning light. No change to identity, no head turn, subtle camera drift only.

That gets you genuinely life-like *and* actually them — which no prompt can
fake. Use the text prompts in this file for the ritual close-ups where no face
is recognisable (hands, mehendi, mangalsutra, mandapam, toranam).

**Caveat:** every hosted model filters uploads of real identifiable people.
Kling and Runway accept your own photos; Veo and Sora are stricter. If an
upload is refused, the ritual close-ups above are all faceless by design and
will pass.

### Seamless loops

Image-to-video models do not loop — the last frame never matches the first, so
the hero would visibly jump every 8 seconds. Fix it with a palindrome: play
forward, then reversed. On a slow push-in this is invisible. `scripts/prepare-media.sh`
does it for you (see below).

---

## 3. Export settings

| | Max width | Target size | Notes |
|---|---|---|---|
| Hero poster / `mandapam-wide` | 2400 px | ≤ 400 KB | AVIF or WebP q≈62 |
| 3:2 and 4:5 stills | 1600 px | ≤ 250 KB | AVIF or WebP q≈62 |
| `mehendi-hands` (1:1) | 1200 px | ≤ 180 KB | |
| `hero-muhurtham` video | 1920×1080 | **≤ 4 MB** | VP9 WebM, no audio, 24–30 fps |
| `diya-loop` video | 720×720 | ≤ 600 KB | VP9 WebM, no audio |

Quick conversions:

```bash
# stills → AVIF + WebP
npx @squoosh/cli --avif '{"cqLevel":32}' --resize '{"width":1600}' -d public/media talambralu.png

# videos → seamless loop, both formats, poster frame
brew install ffmpeg      # once
scripts/prepare-media.sh hero-muhurtham ~/Downloads/kling-out.mp4 --loop --poster
scripts/prepare-media.sh diya-loop ~/Downloads/flame.mp4 --loop --width 720
```

---

## 4. Checklist

- [ ] Generate `couple-portrait` first; reuse it as a face reference everywhere else.
- [ ] Verify hands — six fingers is the giveaway that kills "life-like".
- [ ] Keep the hero video's left third visually calm; the invitation text sits there.
- [ ] Compress before committing; a 40 MB hero kills mobile load.
- [ ] Reload — slots light up automatically as files appear.
