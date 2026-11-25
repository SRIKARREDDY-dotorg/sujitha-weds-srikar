/* ==========================================================================
   Traditional Telugu wedding motion system
   ========================================================================== */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/* ---------- reduced motion ------------------------------------------- */
const mq = () => typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => !!mq()?.matches)
  useEffect(() => {
    const m = mq(); if (!m) return
    const on = () => setReduced(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return reduced
}

/* ---------- scroll reveal -------------------------------------------- */
export function Reveal({
  as: Tag = 'div', variant = 'up', delay = 0, threshold = 0.14,
  className = '', children, ...rest
}) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (mq()?.matches || !('IntersectionObserver' in window)) { setVis(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return (
    <Tag
      ref={ref}
      className={`rv rv-${variant}${vis ? ' in' : ''}${className ? ' ' + className : ''}`}
      style={{ '--rv-delay': `${delay}ms` }}
      {...rest}
    >{children}</Tag>
  )
}

/* ---------- headline word-by-word lift -------------------------------- */
export function LiftWords({ text, as: Tag = 'span', className = '', stagger = 70 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (mq()?.matches || !('IntersectionObserver' in window)) { setVis(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const words = String(text).split(' ')
  return (
    <Tag ref={ref} className={`lift-words${vis ? ' in' : ''}${className ? ' ' + className : ''}`}>
      {words.map((w, i) => (
        <span key={i}>
          <i style={{ transitionDelay: `${i * stagger}ms` }}>{w}</i>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/* ==========================================================================
   Particle canvas — marigold petals, jasmine, rose petals, talambralu rice
   ========================================================================== */
const PALETTE = {
  marigold: ['#f0921f', '#f7bb34', '#e2771a', '#f9cf5c'],
  rose: ['#e2889c', '#d16c87', '#f2b2c0', '#c75a7a'],
  jasmine: ['#fffdf7', '#fdf2e6', '#fff8ec'],
  rice: ['#fffdf4', '#f8f0dd'],
  spark: ['#f3dca0', '#e8c27a', '#fff1c4'],
}
const pick = a => a[(Math.random() * a.length) | 0]

function drawMarigold(ctx, s, c) {
  ctx.fillStyle = c
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5, s * 0.44, s * 0.32, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha *= 0.85
  ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2); ctx.fill()
}
function drawRose(ctx, s, c) {
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 0.95, -s * 0.5, s * 0.72, s * 0.62, 0, s)
  ctx.bezierCurveTo(-s * 0.72, s * 0.62, -s * 0.95, -s * 0.5, 0, -s)
  ctx.fill()
}
function drawJasmine(ctx, s, c) {
  ctx.fillStyle = c
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(Math.cos(a) * s * 0.46, Math.sin(a) * s * 0.46, s * 0.4, s * 0.26, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#f6d98a'
  ctx.beginPath(); ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2); ctx.fill()
}
function drawRice(ctx, s, c) {
  ctx.fillStyle = c
  ctx.beginPath(); ctx.ellipse(0, 0, s * 0.26, s * 0.72, 0, 0, Math.PI * 2); ctx.fill()
}
function drawSpark(ctx, s, c) {
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.moveTo(0, -s); ctx.lineTo(s * 0.26, -s * 0.26); ctx.lineTo(s, 0)
  ctx.lineTo(s * 0.26, s * 0.26); ctx.lineTo(0, s); ctx.lineTo(-s * 0.26, s * 0.26)
  ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.26, -s * 0.26)
  ctx.closePath(); ctx.fill()
}
const DRAW = {
  marigold: drawMarigold, rose: drawRose, jasmine: drawJasmine,
  rice: drawRice, spark: drawSpark,
}

const BURST_EVENT = 'telugu-wedding:burst'
/** Fire a talambralu / petal shower from a screen point. */
export function burstAt(x, y, opts = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(BURST_EVENT, { detail: { x, y, ...opts } }))
}
/** Fire a shower centred on a DOM element. */
export function burstFromEl(el, opts) {
  if (!el?.getBoundingClientRect) return
  const r = el.getBoundingClientRect()
  burstAt(r.left + r.width / 2, r.top + r.height / 2, opts)
}

export function PetalCanvas({ density = 1 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, dpr = 1, raf = 0, last = performance.now(), running = true
    const parts = []
    const AMBIENT_TYPES = ['marigold', 'rose', 'jasmine', 'marigold', 'rose', 'spark']

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const cap = () => {
      const base = window.innerWidth < 640 ? 26 : window.innerWidth < 1100 ? 44 : 64
      return Math.round(base * density)
    }

    const spawnAmbient = () => {
      const type = pick(AMBIENT_TYPES)
      const size = type === 'spark' ? 2.5 + Math.random() * 3 : 5 + Math.random() * 9
      parts.push({
        type, size,
        color: pick(PALETTE[type]),
        x: Math.random() * w,
        y: -20 - Math.random() * h * 0.4,
        vx: (Math.random() - 0.5) * 10,
        vy: 24 + Math.random() * 46,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 2.4,
        sway: 14 + Math.random() * 26,
        swaySpeed: 0.5 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.45 + Math.random() * 0.45,
        life: Infinity, gravity: 0, drag: 1, ambient: true,
      })
    }

    const spawnBurst = (x, y, { count, types, power = 1 } = {}) => {
      const n = count ?? (window.innerWidth < 640 ? 46 : 78)
      const pool = types ?? ['rice', 'rice', 'marigold', 'jasmine', 'spark', 'rose']
      for (let i = 0; i < n; i++) {
        const type = pick(pool)
        const a = Math.random() * Math.PI * 2
        const sp = (120 + Math.random() * 420) * power
        parts.push({
          type,
          size: type === 'rice' ? 3 + Math.random() * 3.4
            : type === 'spark' ? 2 + Math.random() * 3
              : 5 + Math.random() * 8,
          color: pick(PALETTE[type]),
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 120 * power,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 11,
          sway: 6 + Math.random() * 14,
          swaySpeed: 1 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          alpha: 1,
          life: 2.4 + Math.random() * 2.2,
          gravity: 620,
          drag: 0.985,
          ambient: false,
        })
      }
    }

    const onBurst = e => {
      const { x, y } = e.detail || {}
      spawnBurst(x ?? w / 2, y ?? h / 3, e.detail || {})
    }

    const frame = now => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)

      const ambientCount = parts.reduce((n, p) => n + (p.ambient ? 1 : 0), 0)
      if (ambientCount < cap() && Math.random() < 0.55) spawnAmbient()

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.phase += p.swaySpeed * dt
        p.vy += p.gravity * dt
        if (p.drag !== 1) { p.vx *= p.drag; p.vy *= p.drag }
        p.x += (p.vx + Math.cos(p.phase) * p.sway) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.life !== Infinity) {
          p.life -= dt
          p.alpha = Math.max(0, Math.min(1, p.life / 1.2))
        }

        if (p.y > h + 60 || p.life <= 0 || p.x < -120 || p.x > w + 120) {
          parts.splice(i, 1); continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        // flutter: petal turning edge-on
        ctx.scale(Math.max(0.22, Math.abs(Math.cos(p.phase * 0.9))), 1)
        if (p.type === 'spark') {
          ctx.shadowColor = p.color
          ctx.shadowBlur = p.size * 3
        }
        DRAW[p.type](ctx, p.size, p.color)
        ctx.restore()
      }
      if (running) raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame) }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener(BURST_EVENT, onBurst)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener(BURST_EVENT, onBurst)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced, density])

  if (reduced) return null
  return <canvas className="petal-canvas" ref={ref} aria-hidden="true" />
}

/* ==========================================================================
   Tera — the ceremonial curtain held between bride and groom
   ========================================================================== */
export function TeraReveal({
  onOpen, bride = 'Venkata Sujitha Reddy', groom = 'Srikar Reddy',
  date = '13 · 12 · 2026', place = 'MYDUKUR',
}) {
  const [state, setState] = useState('closed') // closed | open | gone
  const reduced = useReducedMotion()

  useEffect(() => {
    document.body.classList.toggle('tera-locked', state === 'closed')
    return () => document.body.classList.remove('tera-locked')
  }, [state])

  const open = e => {
    if (state !== 'closed') return
    setState('open')
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    if (!reduced) {
      burstAt(x, y, { count: 110, power: 1.25 })
      setTimeout(() => burstAt(window.innerWidth * 0.3, window.innerHeight * 0.3, { count: 60 }), 320)
      setTimeout(() => burstAt(window.innerWidth * 0.7, window.innerHeight * 0.28, { count: 60 }), 520)
    }
    onOpen?.()
    setTimeout(() => setState('gone'), reduced ? 420 : 1800)
  }

  if (state === 'gone') return null

  return (
    <div className={`tera${state === 'open' ? ' tera-open' : ''}`} role="dialog" aria-label="Open the invitation">
      <div className="tera-panel tera-left" aria-hidden="true" />
      <div className="tera-panel tera-right" aria-hidden="true" />
      <TeraPetals />
      <HangStrings config={[[9, 132, 'jasmine'], [26, 86, 'marigold'], [74, 104, 'marigold'], [91, 150, 'jasmine']]} />
      <span className="tera-halo" aria-hidden="true" />
      <Mandala className="tera-mandala" />
      <div className="tera-lamp l" aria-hidden="true"><Diya /></div>
      <div className="tera-lamp r" aria-hidden="true"><Diya delay={700} /></div>
      <div className="tera-card">
        <Kalash className="tera-kalash" />
        <div className="tera-om">శ్రీ రస్తు · శుభమస్తు</div>
        <div className="tera-monogram"><b>S</b> <b><i>&</i></b> <b>S</b></div>
        <div className="tera-names">
          <span>{bride}</span><em>&</em><span>{groom}</span>
        </div>
        <hr className="tera-rule" />
        <p className="tera-date">{date} &nbsp;·&nbsp; {place}</p>
        <button className="tera-open-btn" onClick={open} autoFocus>
          తెర తీయండి · OPEN THE INVITATION <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ---------- Petals drifting down the curtain --------------------------
   The global PetalCanvas sits below the tera's z-index, so the opening
   screen needs its own layer. CSS-only: 18 nodes is cheaper than running a
   second canvas, and it stops entirely once the tera unmounts. */
// Saturated enough to read against the pale silk: near-white petals were
// invisible on it. Blush rose, marigold and jasmine with a warm shadow.
const TERA_PETAL_COLORS = ['#eeaebd', '#f4c3ce', '#fffdf8', '#efa65f', '#f5c87a', '#e394ab']

export function TeraPetals({ count = 18 }) {
  const reduced = useReducedMotion()
  // generated once: re-randomising on every render would make them jump
  const petals = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    size: 7 + ((i * 13) % 9),
    delay: -((i * 1.37) % 11),
    dur: 11 + ((i * 7) % 9),
    drift: ((i % 5) - 2) * 26,
    spin: 420 + ((i * 97) % 360),
    opacity: 0.5 + ((i * 17) % 40) / 100,
    color: TERA_PETAL_COLORS[i % TERA_PETAL_COLORS.length],
  })), [count])

  if (reduced) return null
  return (
    <div className="tera-petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="tera-petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--dx': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            '--o': p.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Mandala ring — draws itself, then turns slowly ------------ */
export function Mandala({ className = '' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    ref.current?.querySelectorAll('[data-draw]').forEach(el => {
      const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 1400
      el.style.setProperty('--len', len)
    })
  }, [])

  // All detail lives in the outer annulus (r 136–216). The medallion plate
  // covers the centre, so anything drawn inside that radius is never seen.
  const C = 220
  const petals = 18
  const dots = 36
  return (
    <svg
      ref={ref} className={className} viewBox="0 0 440 440"
      fill="none" stroke="currentColor" aria-hidden="true"
    >
      <circle data-draw cx={C} cy={C} r="216" strokeWidth="1" />
      <circle data-draw cx={C} cy={C} r="200" strokeWidth=".7" opacity=".75" />
      <circle data-draw cx={C} cy={C} r="138" strokeWidth=".7" opacity=".75" />
      {/* lotus petal ring, r 142 → 198 */}
      {Array.from({ length: petals }).map((_, i) => (
        <path
          key={`p${i}`} data-draw
          d={`M${C} 22 C${C + 17} 44 ${C + 17} 60 ${C} 80 C${C - 17} 60 ${C - 17} 44 ${C} 22Z`}
          strokeWidth=".9"
          transform={`rotate(${(i / petals) * 360} ${C} ${C})`}
          style={{ animationDelay: `${0.4 + i * 0.05}s` }}
        />
      ))}
      {/* bead ring between the petals and the inner circle */}
      {Array.from({ length: dots }).map((_, i) => {
        const a = (i / dots) * Math.PI * 2 + Math.PI / dots
        return (
          <circle
            key={`d${i}`}
            cx={C + Math.cos(a) * 119} cy={C + Math.sin(a) * 119}
            r={i % 3 === 0 ? 2.6 : 1.5}
            fill="currentColor" stroke="none" opacity="0"
            style={{ animation: `kolam-dot .45s ease ${1.1 + i * 0.018}s forwards` }}
          />
        )
      })}
    </svg>
  )
}

/* ---------- Kalash (sacred pot with coconut & mango leaves) ----------- */
export function Kalash({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 150" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M60 10c-9 7-13 15-13 22 0 8 6 13 13 13s13-5 13-13c0-7-4-15-13-22Z" />
        <path d="M34 45c-6 2-10 5-10 8 0 4 16 7 36 7s36-3 36-7c0-3-4-6-10-8" />
        <path d="M30 56c-6 10-8 22-8 33 0 24 17 42 38 42s38-18 38-42c0-11-2-23-8-33" />
        <path d="M22 92c12 7 26 10 38 10s26-3 38-10" opacity=".55" />
        <path d="M47 50c-14-6-26-18-30-32 14 2 26 12 32 26" />
        <path d="M73 50c14-6 26-18 30-32-14 2-26 12-32 26" />
      </g>
      <circle cx="60" cy="86" r="5" fill="currentColor" opacity=".8" />
    </svg>
  )
}

/* ==========================================================================
   Toranam — mango-leaf garland strung across a doorway
   ========================================================================== */
export function Toranam({ leaves = 22, className = '' }) {
  const items = Array.from({ length: leaves })
  return (
    <svg
      className={`toranam ${className}`}
      viewBox="0 0 1200 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 10 Q600 68 1200 10" stroke="#a98a62" strokeWidth="2.5" fill="none" />
      {items.map((_, i) => {
        const t = (i + 0.5) / leaves
        const x = t * 1200
        // y on the quadratic sag curve
        const y = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 68 + t * t * 10
        const isFlower = i % 4 === 2
        const len = 26 + Math.sin(t * Math.PI) * 16
        return (
          <g
            key={i}
            className="leaf"
            style={{ animationDelay: `${(i % 7) * 0.22}s`, transformOrigin: `${x}px ${y}px` }}
          >
            {isFlower ? (
              <>
                <line x1={x} y1={y} x2={x} y2={y + 13} stroke="#b09071" strokeWidth="1.4" />
                <circle cx={x} cy={y + 20} r="7.5" fill="#ef9020" />
                <circle cx={x} cy={y + 20} r="4" fill="#f7c13e" />
              </>
            ) : (
              <>
                <line x1={x} y1={y} x2={x} y2={y + 6} stroke="#8d7a55" strokeWidth="1.2" />
                <path
                  d={`M${x} ${y + 6} C${x - 9} ${y + len * 0.45} ${x - 7} ${y + len} ${x} ${y + len + 6}
                      C${x + 7} ${y + len} ${x + 9} ${y + len * 0.45} ${x} ${y + 6}Z`}
                  fill={i % 3 === 0 ? '#6f8a5c' : '#88a06c'}
                />
                <line x1={x} y1={y + 8} x2={x} y2={y + len + 4} stroke="#5d7a4d" strokeWidth=".8" opacity=".7" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ---------- hanging jasmine / marigold strings ------------------------ */
export function HangStrings({ config = [[8, 150, 'marigold'], [23, 96, 'jasmine'], [77, 120, 'jasmine'], [92, 170, 'marigold']] }) {
  return (
    <>
      {config.map(([left, len, kind], i) => {
        const beads = Math.floor(len / 15)
        return (
          <div
            key={i}
            className="hang-string"
            aria-hidden="true"
            style={{ left: `${left}%`, height: len, animationDelay: `${i * 0.6}s` }}
          >
            {Array.from({ length: beads }).map((_, b) => (
              <span
                key={b}
                style={{
                  top: b * 15 + 8,
                  background: kind === 'marigold'
                    ? (b % 2 ? '#f7c13e' : '#ef9020')
                    : (b % 2 ? '#fffdf7' : '#f6ead6'),
                  boxShadow: kind === 'marigold'
                    ? '0 0 8px rgba(247,193,62,.6)'
                    : '0 1px 3px rgba(120,90,80,.25)',
                  width: kind === 'marigold' ? 11 : 8,
                  height: kind === 'marigold' ? 11 : 8,
                  marginLeft: kind === 'marigold' ? -5.5 : -4,
                }}
              />
            ))}
          </div>
        )
      })}
    </>
  )
}

/* ==========================================================================
   Muggu / Kolam — self-drawing rice-flour floor art
   ========================================================================== */
export function Kolam({ className = '', size = 220 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)

  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.querySelectorAll('path, circle:not(.k-dot), line').forEach(el => {
      const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 1200
      el.style.setProperty('--len', len)
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (mq()?.matches || !('IntersectionObserver' in window)) { setVis(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const dots = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      dots.push([30 + c * 35, 30 + r * 35])
    }
  }

  return (
    <svg
      ref={ref}
      className={`kolam${vis ? ' in' : ''} ${className}`}
      width={size} height={size} viewBox="0 0 200 200"
      fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" aria-hidden="true"
    >
      {dots.map(([x, y], i) => (
        <circle
          key={i} className="k-dot" cx={x} cy={y} r="1.7"
          fill="currentColor" stroke="none" opacity="0"
          style={{ animationDelay: `${0.4 + i * 0.016}s`, transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      {/* four looping lotus quadrants around a central bloom */}
      <path d="M100 30 C130 48 152 70 170 100 C152 130 130 152 100 170 C70 152 48 130 30 100 C48 70 70 48 100 30Z" />
      <path d="M100 58 C118 70 130 82 142 100 C130 118 118 130 100 142 C82 130 70 118 58 100 C70 82 82 70 100 58Z" />
      <path d="M65 65 C84 72 95 84 100 100 C84 95 72 84 65 65Z M135 65 C128 84 116 95 100 100 C105 84 116 72 135 65Z M135 135 C116 128 105 116 100 100 C116 105 128 116 135 135Z M65 135 C72 116 84 105 100 100 C95 116 84 128 65 135Z" />
      <path d="M100 88 A12 12 0 1 1 99.9 88Z M100 76 A24 24 0 1 1 99.9 76Z" />
    </svg>
  )
}

/* ==========================================================================
   Diya — clay oil lamp with a live flame
   ========================================================================== */
export function Diya({ delay = 0, className = '' }) {
  return (
    <div className={`diya ${className}`} style={{ animationDelay: `${delay}ms`, height: 48 }} aria-hidden="true">
      <div className="diya-halo" style={{ animationDelay: `${delay}ms` }} />
      <div className="diya-flame" style={{ animationDelay: `${delay % 700}ms` }} />
      <div className="diya-bowl" />
    </div>
  )
}

export function DiyaRow({ count = 5 }) {
  return (
    <div className="diya-row" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Diya key={i} delay={i * 180} />
      ))}
    </div>
  )
}

/* ---------- pasupu / kumkum glow orbs -------------------------------- */
export function GlowOrbs({ orbs = [
  { kind: 'pasupu', size: 260, top: '8%', left: '4%', dur: 16 },
  { kind: 'kumkum', size: 220, top: '58%', left: '72%', dur: 20 },
  { kind: 'jasmine', size: 180, top: '36%', left: '46%', dur: 13 },
] }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <>
      {orbs.map((o, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`glow-orb orb-${o.kind}`}
          style={{
            width: o.size, height: o.size, top: o.top, left: o.left,
            animationDuration: `${o.dur}s`, animationDelay: `${i * -4}s`,
          }}
        />
      ))}
    </>
  )
}

/* ==========================================================================
   Telugu typewriter
   ========================================================================== */
export function Typewriter({ text, speed = 95, startDelay = 400, className = '' }) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? text.length : 0)

  useEffect(() => {
    if (reduced) { setN(text.length); return }
    let i = 0, t
    const chars = Array.from(text)
    const start = setTimeout(function step() {
      setN(++i)
      if (i < chars.length) t = setTimeout(step, speed)
    }, startDelay)
    return () => { clearTimeout(start); clearTimeout(t) }
  }, [text, speed, startDelay, reduced])

  const done = n >= Array.from(text).length
  return (
    <span className={`typewriter${done ? ' done' : ''} ${className}`} aria-label={text}>
      {Array.from(text).slice(0, n).join('')}
    </span>
  )
}

/* ==========================================================================
   Scroll progress thread with a marigold bead
   ========================================================================== */
export function ScrollThread() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0
      ref.current?.style.setProperty('--p', `${p}%`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="scroll-thread" ref={ref} aria-hidden="true">
      <i /><b />
    </div>
  )
}

/* ==========================================================================
   Petal cursor trail (pointer devices only)
   ========================================================================== */
export function PetalTrail() {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    let last = 0
    const colors = ['#ef9020', '#f7c13e', '#e2889c', '#fffdf7', '#f2b2c0']
    const onMove = e => {
      const now = performance.now()
      if (now - last < 55) return
      last = now
      const d = document.createElement('span')
      d.className = 'trail-dot'
      d.style.left = e.clientX + (Math.random() - 0.5) * 14 + 'px'
      d.style.top = e.clientY + (Math.random() - 0.5) * 14 + 'px'
      const s = 6 + Math.random() * 7
      d.style.width = d.style.height = s + 'px'
      d.style.background = colors[(Math.random() * colors.length) | 0]
      document.body.appendChild(d)
      setTimeout(() => d.remove(), 900)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])
  return null
}

/* ==========================================================================
   Parallax — attaches a translate to a ref on scroll
   ========================================================================== */
export function useParallax(strength = 0.12, max = 90) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const run = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const centre = r.top + r.height / 2 - window.innerHeight / 2
      const y = Math.max(-max, Math.min(max, -centre * strength))
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.style.transform = ''
    }
  }, [strength, max, reduced])
  return ref
}
