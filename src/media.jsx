/* ==========================================================================
   Photoreal media layer.

   Every slot below is OPTIONAL. If the file is missing from public/media/,
   the component silently renders its CSS/SVG fallback instead — so the site
   works today and upgrades to life-like AI art the moment you drop files in.

   Generate the assets with the prompts in PROMPTS.md, name them exactly as
   `file` below, put them in public/media/, and reload. No code changes.
   ========================================================================== */
import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useParallax } from './animations.jsx'

export const MEDIA_BASE = '/media'

/** The asset manifest — filenames here match PROMPTS.md one-to-one. */
export const SLOTS = {
  heroFilm:      { file: 'hero-muhurtham',   kind: 'video', ratio: '16/9', poster: 'hero-muhurtham-poster' },
  couplePortrait:{ file: 'couple-portrait',  kind: 'image', ratio: '3/4' },
  talambralu:    { file: 'talambralu',       kind: 'image', ratio: '3/2' },
  mangalsutra:   { file: 'mangalsutra',      kind: 'image', ratio: '4/3' },
  jeelakarra:    { file: 'jeelakarra-bellam', kind: 'image', ratio: '3/2' },
  mehendi:       { file: 'mehendi-hands',    kind: 'image', ratio: '1/1' },
  mandapam:      { file: 'mandapam-wide',    kind: 'image', ratio: '16/9' },
  toranamClose:  { file: 'toranam-closeup',  kind: 'image', ratio: '3/2' },
  receptionNight:{ file: 'reception-night',  kind: 'image', ratio: '4/3' },
  kalashLoop:    { file: 'diya-loop',        kind: 'video', ratio: '1/1' },
  pellikuthuru:  { file: 'pellikuthuru',     kind: 'image', ratio: '4/5' },
  // section-wide background bands (scenes 6 and 7)
  countdownBand: { file: 'countdown-band',   kind: 'image', ratio: '16/9' },
  rsvpBand:      { file: 'rsvp-band',        kind: 'image', ratio: '16/9' },
  // square tradition icons (scene 8)
  tradition1:    { file: 'tradition-1',      kind: 'image', ratio: '1/1' },
  tradition2:    { file: 'tradition-2',      kind: 'image', ratio: '1/1' },
  tradition3:    { file: 'tradition-3',      kind: 'image', ratio: '1/1' },
  tradition4:    { file: 'tradition-4',      kind: 'image', ratio: '1/1' },
}

/** Background music. Optional, like everything else here.
 *  m4a first: the served file is a 96kbps AAC re-encode of the 320kbps
 *  source, which is a third of the bytes for background audio nobody is
 *  listening to critically. The master mp3 lives in assets-src/. */
export const AUDIO = { file: 'kalyanam-vybhogam', exts: ['m4a', 'mp3', 'ogg'] }

/* Extension candidates, best format first. */
const IMG_EXT = ['avif', 'webp', 'jpg', 'png']
const VID_EXT = ['webm', 'mp4']

/** Probe a list of candidate URLs, resolve the first that loads. */
function useFirstAvailable(file, kind, enabled = true) {
  const [src, setSrc] = useState(null)
  // idle = not probed yet (off-screen). Distinct from `missing`, so a frame
  // that simply has not been looked at does not get the "empty slot" styling.
  const [state, setState] = useState('idle') // idle | probing | found | missing

  useEffect(() => {
    if (!file) { setState('missing'); return }
    if (!enabled) { setState('idle'); return }
    setState('probing')
    let cancelled = false
    const exts = kind === 'video' ? VID_EXT : IMG_EXT
    const urls = exts.map(e => `${MEDIA_BASE}/${file}.${e}`)

    const tryNext = i => {
      if (cancelled) return
      if (i >= urls.length) { setState('missing'); return }
      const url = urls[i]
      if (kind === 'video') {
        // HEAD is cheap and avoids downloading a video that is not there.
        fetch(url, { method: 'HEAD' })
          .then(r => {
            if (cancelled) return
            const ct = r.headers.get('content-type') || ''
            // A SPA rewrite can answer 200 with index.html; reject that.
            if (r.ok && !ct.includes('text/html')) { setSrc(url); setState('found') }
            else tryNext(i + 1)
          })
          .catch(() => tryNext(i + 1))
      } else {
        const img = new Image()
        img.onload = () => { if (!cancelled) { setSrc(url); setState('found') } }
        img.onerror = () => tryNext(i + 1)
        img.src = url
      }
    }
    tryNext(0)
    return () => { cancelled = true }
  }, [file, kind, enabled])

  return { src, state }
}

/* ==========================================================================
   CinemaImage — lazy, Ken-Burns / drift animated photo with graceful fallback
   ========================================================================== */
/**
 * Which of `names` actually have files on disk. Lets a section hide itself
 * (rather than render dashed placeholders) until its art arrives.
 */
export function useAvailableSlots(names) {
  const [available, setAvailable] = useState(null) // null = still probing
  const key = names.join(',')
  useEffect(() => {
    let cancelled = false
    const probe = file => new Promise(res => {
      const tryNext = k => {
        if (k >= IMG_EXT.length) return res(false)
        const img = new Image()
        img.onload = () => res(true)
        img.onerror = () => tryNext(k + 1)
        img.src = `${MEDIA_BASE}/${file}.${IMG_EXT[k]}`
      }
      tryNext(0)
    })
    Promise.all(names.map(n => probe(SLOTS[n]?.file))).then(hits => {
      if (!cancelled) setAvailable(names.filter((n, i) => hits[i]))
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return available
}

export function CinemaImage({
  slot, alt = '', effect = 'kenburns', className = '', children,
  overlay = true, caption, telugu, eager = false, grade = 'film',
}) {
  const cfg = SLOTS[slot] || {}
  const holder = useRef(null)
  const [near, setNear] = useState(eager)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (near) return
    const el = holder.current
    if (!el || !('IntersectionObserver' in window)) { setNear(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); io.disconnect() }
    }, { rootMargin: '320px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  const { src, state } = useFirstAvailable(cfg.file, 'image', near)
  const [loaded, setLoaded] = useState(false)

  return (
    <figure
      ref={holder}
      className={`cinema cinema-${state} grade-${grade} ${className}`}
      style={{ '--ratio': cfg.ratio || '3/2' }}
    >
      <div className="cinema-frame">
        {state === 'found' && (
          <img
            src={src}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={`cinema-img fx-${reduced ? 'none' : effect}${loaded ? ' loaded' : ''}`}
            onLoad={() => setLoaded(true)}
          />
        )}
        {state !== 'found' && <div className="cinema-fallback">{children}</div>}
        {/* A multiply grade and film grain make a PHOTO sit in the palette.
            On watercolour art they just muddy it, so grade="soft" keeps only
            a whisper of vignette and grade="none" leaves the art untouched. */}
        {overlay && grade === 'film' && <span className="cinema-grade" aria-hidden="true" />}
        {overlay && grade === 'film' && <span className="cinema-grain" aria-hidden="true" />}
        {grade !== 'none' && <span className="cinema-vignette" aria-hidden="true" />}
      </div>
      {(caption || telugu) && (
        <figcaption className="cinema-caption">
          {telugu && <span className="cc-telugu">{telugu}</span>}
          {caption && <span className="cc-en">{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/* ==========================================================================
   HeroFilm — full-bleed looping video behind the hero, poster-first.
   Falls back to the CSS couple illustration when no file exists.
   ========================================================================== */
export function HeroFilm({ children, className = '', onMedia }) {
  const cfg = SLOTS.heroFilm
  const reduced = useReducedMotion()
  const { src, state } = useFirstAvailable(cfg.file, 'video', !reduced)
  const poster = useFirstAvailable(cfg.poster, 'image', true)
  const vid = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    // Report only once both probes have settled, or the hero would flip from
    // "no media" to "media" on load. Under reduced motion the video probe is
    // never started (state stays idle), so treat that as settled.
    const done = s => s === 'found' || s === 'missing'
    const videoSettled = reduced || done(state)
    if (!videoSettled || !done(poster.state)) return
    onMedia?.((state === 'found' && !reduced) || poster.state === 'found')
  }, [state, poster.state, reduced, onMedia])

  useEffect(() => {
    const v = vid.current
    if (!v || !src) return
    const onVis = () => { document.hidden ? v.pause() : v.play().catch(() => {}) }
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [src])

  const hasFilm = state === 'found' && !reduced
  const hasPoster = poster.state === 'found'

  return (
    <div className={`hero-film ${hasFilm || hasPoster ? 'has-media' : 'no-media'} ${className}`}>
      {hasPoster && (
        <img
          className={`hero-film-poster${playing ? ' hidden' : ''}`}
          src={poster.src} alt="" aria-hidden="true" decoding="async"
        />
      )}
      {hasFilm && (
        <video
          ref={vid} className={`hero-film-video${playing ? ' playing' : ''}`}
          src={src} poster={hasPoster ? poster.src : undefined}
          autoPlay muted loop playsInline preload="metadata"
          aria-hidden="true" tabIndex={-1}
        />
      )}
      {(hasFilm || hasPoster) && <span className="hero-film-scrim" aria-hidden="true" />}
      {!hasFilm && !hasPoster && children}
    </div>
  )
}

/* ==========================================================================
   TraditionIcons — a row of round 1:1 ritual vignettes with Telugu labels.
   Shows only the ones whose art exists, and nothing at all until the first
   file lands, so the section never renders as empty placeholders.
   ========================================================================== */
// Labels describe what each icon actually depicts — kalash, rice, turmeric,
// jasmine. Keep these in step with the art if you ever swap a file.
export const TRADITIONS = [
  { slot: 'tradition1', telugu: 'కలశం', caption: 'The sacred kalash', alt: 'A brass kalash topped with a coconut and mango leaves' },
  { slot: 'tradition2', telugu: 'తలంబ్రాలు', caption: 'Rice & pearls', alt: 'A brass plate heaped with talambralu rice' },
  { slot: 'tradition3', telugu: 'పసుపు', caption: 'Turmeric for blessings', alt: 'A bowl of turmeric paste beside mango leaves' },
  { slot: 'tradition4', telugu: 'మల్లెపూలు', caption: 'Jasmine garland', alt: 'A woven garland of jasmine buds' },
]

export function TraditionIcons({ items = TRADITIONS }) {
  const available = useAvailableSlots(items.map(i => i.slot))
  if (!available || available.length === 0) return null
  const shown = items.filter(i => available.includes(i.slot))
  return (
    <div className="tradition-row">
      {shown.map((t, i) => (
        <figure className="tradition" key={t.slot} style={{ '--d': `${i * 110}ms` }}>
          <div className="tradition-disc">
            <CinemaImage
              slot={t.slot} alt={t.alt} effect="icon"
              grade="none" overlay={false} caption={null} telugu={null}
            />
          </div>
          <figcaption>
            <span className="cc-telugu">{t.telugu}</span>
            <span className="cc-en">{t.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ==========================================================================
   SceneBand — a full-width illustration behind a section's content
   ========================================================================== */
/**
 * A band sits behind body text, so contrast cannot be left to chance.
 * `scrim` is a wash of the section's own colour laid over the art: it holds
 * the section's identity and guarantees text legibility no matter how busy
 * or bright the illustration turns out to be. Tune `scrim` first, not
 * `opacity` — lowering opacity alone just fades the art toward white, which
 * on a dark section makes the contrast problem worse, not better.
 */
export function SceneBand({ slot, opacity = 0.3, position = 'center', scrim }) {
  const cfg = SLOTS[slot] || {}
  const { src, state } = useFirstAvailable(cfg.file, 'image')
  if (state !== 'found') return null
  return (
    <span className="scene-band" aria-hidden="true">
      <img
        src={src} alt="" loading="lazy" decoding="async"
        style={{ opacity, objectPosition: position }}
      />
      {scrim && <i style={{ background: scrim }} />}
    </span>
  )
}

/* ==========================================================================
   useBackgroundMusic — the sound toggle, wired to a real track.
   Browsers only allow playback from a user gesture, so every entry point
   here is a click. If the browser still refuses, we fail back to "off"
   rather than showing SOUND ON over silence.
   ========================================================================== */
export function useBackgroundMusic({ volume = 0.5, fadeMs = 1600 } = {}) {
  const ref = useRef(null)
  const fade = useRef(0)
  const [on, setOn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const tryNext = i => {
      if (i >= AUDIO.exts.length) return
      const url = `${MEDIA_BASE}/${AUDIO.file}.${AUDIO.exts[i]}`
      fetch(url, { method: 'HEAD' })
        .then(r => {
          if (cancelled) return
          const ct = r.headers.get('content-type') || ''
          if (r.ok && !ct.includes('text/html')) {
            const a = new Audio()
            a.src = url
            a.loop = true
            a.preload = 'none'
            a.volume = 0
            ref.current = a
            setReady(true)
          } else tryNext(i + 1)
        })
        .catch(() => tryNext(i + 1))
    }
    tryNext(0)
    return () => {
      cancelled = true
      clearInterval(fade.current)
      ref.current?.pause()
    }
  }, [])

  const rampTo = (target, done) => {
    const a = ref.current
    if (!a) return
    clearInterval(fade.current)
    const steps = Math.max(1, Math.round(fadeMs / 50))
    const from = a.volume
    let i = 0
    fade.current = setInterval(() => {
      i++
      a.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)))
      if (i >= steps) { clearInterval(fade.current); done?.() }
    }, 50)
  }

  const play = () => {
    const a = ref.current
    if (!a) return
    a.volume = 0
    a.play().then(() => { setOn(true); rampTo(volume) }).catch(() => setOn(false))
  }
  const pause = () => {
    const a = ref.current
    if (!a) return
    rampTo(0, () => a.pause())
    setOn(false)
  }

  return { on, ready, play, pause, toggle: () => (on ? pause() : play()) }
}

/* ==========================================================================
   ArchFrame — mandapam-arch masked media frame (for portraits)
   ========================================================================== */
export function ArchFrame({
  slot, alt, telugu, caption, children, parallax = 0.07, grade = 'soft',
}) {
  const ref = useParallax(parallax, 42)
  return (
    <div className="arch-frame" ref={ref}>
      <div className="arch-frame-inner">
        <CinemaImage
          slot={slot} alt={alt} effect="kenburns-slow"
          telugu={telugu} caption={caption} grade={grade}
        >{children}</CinemaImage>
      </div>
      <span className="arch-frame-gold" aria-hidden="true" />
    </div>
  )
}

/* ==========================================================================
   DiyaLoop — small square looping video (a real flame) with CSS diya fallback
   ========================================================================== */
export function DiyaLoop({ children, className = '' }) {
  const reduced = useReducedMotion()
  const { src, state } = useFirstAvailable(SLOTS.kalashLoop.file, 'video', !reduced)
  if (state !== 'found' || reduced) return <>{children}</>
  return (
    <video
      className={`diya-loop ${className}`}
      src={src} autoPlay muted loop playsInline preload="metadata"
      aria-hidden="true" tabIndex={-1}
    />
  )
}
