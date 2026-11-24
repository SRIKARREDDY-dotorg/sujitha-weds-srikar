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
  heroStill:     { file: 'couple-portrait',  kind: 'image', ratio: '4/5' },
  talambralu:    { file: 'talambralu',       kind: 'image', ratio: '3/2' },
  mangalsutra:   { file: 'mangalsutra',      kind: 'image', ratio: '4/5' },
  jeelakarra:    { file: 'jeelakarra-bellam', kind: 'image', ratio: '3/2' },
  mehendi:       { file: 'mehendi-hands',    kind: 'image', ratio: '1/1' },
  mandapam:      { file: 'mandapam-wide',    kind: 'image', ratio: '16/9' },
  toranamClose:  { file: 'toranam-closeup',  kind: 'image', ratio: '3/2' },
  receptionNight:{ file: 'reception-night',  kind: 'image', ratio: '3/2' },
  kalashLoop:    { file: 'diya-loop',        kind: 'video', ratio: '1/1' },
  pellikuthuru:  { file: 'pellikuthuru',     kind: 'image', ratio: '4/5' },
}

/* Extension candidates, best format first. */
const IMG_EXT = ['avif', 'webp', 'jpg', 'png']
const VID_EXT = ['webm', 'mp4']

/** Probe a list of candidate URLs, resolve the first that loads. */
function useFirstAvailable(file, kind, enabled = true) {
  const [src, setSrc] = useState(null)
  const [state, setState] = useState('probing') // probing | found | missing

  useEffect(() => {
    if (!enabled || !file) { setState('missing'); return }
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
export function CinemaImage({
  slot, alt = '', effect = 'kenburns', className = '', children,
  overlay = true, caption, telugu, eager = false,
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
      className={`cinema cinema-${state} ${className}`}
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
        {overlay && <span className="cinema-grade" aria-hidden="true" />}
        {overlay && <span className="cinema-grain" aria-hidden="true" />}
        <span className="cinema-vignette" aria-hidden="true" />
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
    const any = (state === 'found' && !reduced) || poster.state === 'found'
    if (state !== 'probing' && poster.state !== 'probing') onMedia?.(any)
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
   MomentsGallery — crossfading ritual slideshow with Telugu captions.
   Renders only the slots whose files actually exist; hides itself if none do.
   ========================================================================== */
const DEFAULT_MOMENTS = [
  { slot: 'pellikuthuru',   telugu: 'పెళ్ళికూతురు',       caption: 'Pelli Kuthuru — the bride is blessed' },
  { slot: 'mehendi',        telugu: 'గోరింటాకు',           caption: 'Gorintaku — mehendi night' },
  { slot: 'jeelakarra',     telugu: 'జీలకర్ర బెల్లం',      caption: 'Jeelakarra Bellam — the first vow' },
  { slot: 'mangalsutra',    telugu: 'మాంగళ్య ధారణ',        caption: 'Mangalya Dharana — three sacred knots' },
  { slot: 'talambralu',     telugu: 'తలంబ్రాలు',           caption: 'Talambralu — a shower of pearls and rice' },
  { slot: 'mandapam',       telugu: 'కళ్యాణ మండపం',        caption: 'The Kalyana Mandapam at dawn' },
  { slot: 'receptionNight', telugu: 'ఆశీర్వచనం',           caption: 'Reception — an evening of blessings' },
]

export function MomentsGallery({ moments = DEFAULT_MOMENTS, interval = 4200 }) {
  const [available, setAvailable] = useState([])
  const [i, setI] = useState(0)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  // probe every candidate once, keep the ones that resolve
  useEffect(() => {
    let cancelled = false
    const probe = file => new Promise(res => {
      const tryNext = k => {
        if (k >= IMG_EXT.length) return res(null)
        const img = new Image()
        img.onload = () => res(`${MEDIA_BASE}/${file}.${IMG_EXT[k]}`)
        img.onerror = () => tryNext(k + 1)
        img.src = `${MEDIA_BASE}/${file}.${IMG_EXT[k]}`
      }
      tryNext(0)
    })
    Promise.all(moments.map(m => probe(SLOTS[m.slot]?.file))).then(urls => {
      if (cancelled) return
      setAvailable(moments.map((m, k) => ({ ...m, src: urls[k] })).filter(m => m.src))
      setReady(true)
    })
    return () => { cancelled = true }
  }, [moments])

  useEffect(() => {
    if (reduced || available.length < 2) return
    const t = setInterval(() => setI(v => (v + 1) % available.length), interval)
    return () => clearInterval(t)
  }, [available.length, interval, reduced])

  if (!ready || available.length === 0) return null

  return (
    <div className="moments" role="group" aria-label="Wedding ritual gallery">
      <div className="moments-stage">
        {available.map((m, k) => (
          <figure key={m.slot} className={`moment${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
            <img src={m.src} alt={m.caption} loading={k === 0 ? 'eager' : 'lazy'} decoding="async" />
            <span className="moment-grade" />
            <figcaption>
              <span className="cc-telugu">{m.telugu}</span>
              <span className="cc-en">{m.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {available.length > 1 && (
        <div className="moments-dots">
          {available.map((m, k) => (
            <button
              key={m.slot}
              className={k === i ? 'on' : ''}
              onClick={() => setI(k)}
              aria-label={m.caption}
              aria-current={k === i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   ArchFrame — mandapam-arch masked media frame (for portraits)
   ========================================================================== */
export function ArchFrame({ slot, alt, telugu, caption, children, parallax = 0.07 }) {
  const ref = useParallax(parallax, 42)
  return (
    <div className="arch-frame" ref={ref}>
      <div className="arch-frame-inner">
        <CinemaImage slot={slot} alt={alt} effect="kenburns-slow" telugu={telugu} caption={caption}>
          {children}
        </CinemaImage>
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
