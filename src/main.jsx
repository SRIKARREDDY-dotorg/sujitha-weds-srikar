import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, MapPin, Heart, Check, Menu, X, Music2,
} from 'lucide-react'
import './styles.css'
import './animations.css'
import {
  Reveal, LiftWords, PetalCanvas, PetalTrail, ScrollThread, TeraReveal, Toranam, HangStrings,
  Kolam, DiyaRow, GlowOrbs, Typewriter, Kalash, useParallax, burstFromEl, burstAt,
} from './animations.jsx'
import { HeroFilm, CinemaImage, MomentsGallery, ArchFrame, DiyaLoop } from './media.jsx'

const weddingDate = new Date('2026-12-13T07:15:00+05:30')

function CountUnit({ label, value }) {
  const [tick, setTick] = useState(false)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    setTick(true)
    const t = setTimeout(() => setTick(false), 560)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div className={`count-unit${tick ? ' tick' : ''}`}>
      <strong>{String(value).padStart(2, '0')}</strong>
      <span>{label}</span>
    </div>
  )
}

function Countdown() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, weddingDate - now)
  const units = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor(diff / 3600000) % 24],
    ['Minutes', Math.floor(diff / 60000) % 60],
    ['Seconds', Math.floor(diff / 1000) % 60],
  ]
  return (
    <div className="countdown">
      {units.map(([label, value]) => <CountUnit key={label} label={label} value={value} />)}
    </div>
  )
}

function FloralMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" opacity=".8">
        <path d="M80 18 C65 38 65 58 80 80 C95 58 95 38 80 18Z" /><path d="M142 80 C122 65 102 65 80 80 C102 95 122 95 142 80Z" /><path d="M80 142 C95 122 95 102 80 80 C65 102 65 122 80 142Z" /><path d="M18 80 C38 95 58 95 80 80 C58 65 38 65 18 80Z" />
        <path d="M36 36 C58 38 72 52 80 80 C52 72 38 58 36 36Z" /><path d="M124 36 C102 38 88 52 80 80 C108 72 122 58 124 36Z" /><path d="M124 124 C102 122 88 108 80 80 C108 88 122 102 124 124Z" /><path d="M36 124 C58 122 72 108 80 80 C52 88 38 102 36 124Z" />
        <circle cx="80" cy="80" r="9" /><circle cx="80" cy="80" r="3" fill="currentColor" />
      </g>
    </svg>
  )
}

function App() {
  const [menu, setMenu] = useState(false)
  const [rsvp, setRsvp] = useState('')
  const [guest, setGuest] = useState('')
  const [sent, setSent] = useState(false)
  const [music, setMusic] = useState(false)
  const [filmOn, setFilmOn] = useState(false)
  const heroArt = useParallax(0.09, 56)

  const submit = e => {
    e.preventDefault()
    if (!rsvp) return
    setSent(true)
    burstFromEl(e.currentTarget, { count: 120, power: 1.15 })
  }
  const nav = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenu(false)
  }
  const onHeroMedia = useCallback(has => setFilmOn(has), [])

  return (
    <div className="site-shell">
      <TeraReveal names="Venkata Sujitha Reddy & Srikar Reddy" />
      <ScrollThread />
      <PetalCanvas />
      <PetalTrail />

      <div className="topline"><span>✦ A CELEBRATION OF LOVE ✦</span><span>13 · 12 · 2026</span></div>
      <header className="nav">
        <a className="brand" href="#home" onClick={e => { e.preventDefault(); nav('home') }}>S <i>&</i> S<span>THE WEDDING</span></a>
        <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        <nav className={menu ? 'nav-links show' : 'nav-links'}>
          {['Our Story', 'Moments', 'Celebrations', 'The Details', 'RSVP'].map((x, i) =>
            <button key={x} onClick={() => nav(['story', 'moments', 'events', 'details', 'rsvp'][i])}>{x}</button>)}
        </nav>
        <button
          className={`sound-button${music ? ' on' : ''}`}
          onClick={() => setMusic(!music)}
          title="Decorative sound toggle"
        >
          {music
            ? <span className="wave" aria-hidden="true"><i /><i /><i /><i /></span>
            : <Music2 size={15} />}
          <span>{music ? 'SOUND ON' : 'SOUND OFF'}</span>
        </button>
      </header>

      <main>
        <section className={`hero${filmOn ? ' film-on' : ''}`} id="home">
          <HeroFilm onMedia={onHeroMedia}>
            <>
              <div className="hero-wash" />
              <div className="hero-grain" />
            </>
          </HeroFilm>
          <GlowOrbs />
          <Toranam />
          <HangStrings />

          <div className="hero-copy">
            <p className="eyebrow"><span /> WITH THE BLESSINGS OF OUR FAMILIES <span /></p>
            <div className="telugu-kicker"><Typewriter text="శుభమస్తు · మంగళమస్తు" /></div>
            <h1><LiftWords text="Two hearts." as="span" /><br /><em><LiftWords text="One beautiful" as="span" /></em><br /><LiftWords text="forever." as="span" /></h1>
            <p className="hero-sub">Together with our families, we invite you to share in the joy of our wedding celebration.</p>
            <div className="names">
              <span className="shimmer">Venkata Sujitha Reddy</span><b>&</b><span className="shimmer">Srikar Reddy</span>
            </div>
            <p className="date-line">SUNDAY <i>·</i> DECEMBER 13, 2026 <i>·</i> MYDUKUR</p>
            <button className="open-invite" onClick={e => { burstFromEl(e.currentTarget, { count: 44 }); nav('story') }}>
              EXPLORE THE INVITATION <ArrowDown size={15} />
            </button>
          </div>

          <div className="hero-art" ref={heroArt} aria-label="Abstract floral wedding illustration">
            <div className="arch arch-back" /><div className="arch arch-front" />
            <div className="sun-disc" />
            <div className="couple-art">
              <div className="veil" />
              <div className="bride"><div className="b-head" /><div className="b-body" /><div className="b-skirt" /></div>
              <div className="groom"><div className="g-head" /><div className="g-body" /><div className="g-leg" /></div>
            </div>
            <div className="art-flower f1">✿</div><div className="art-flower f2">❀</div><div className="art-flower f3">✿</div>
            <div className="art-caption">A little promise<br />wrapped in forever</div>
            <FloralMark className="hero-flower" />
          </div>

          <div className="hero-bottom"><span>SCROLL TO FEEL THE LOVE</span><div /><span>01 / 05</span></div>
          <span className="floating-heart h1">♡</span><span className="floating-heart h2">♡</span>
        </section>

        <section className="intro section-pad" id="story">
          <Reveal variant="up" className="section-index">01 <span>— THE INVITATION</span></Reveal>
          <div className="intro-grid">
            <Reveal variant="left" className="intro-ornament">
              <Kolam size={170} />
              <span>శ్రీరస్తు</span>
              <small>BY THE GRACE OF THE DIVINE</small>
            </Reveal>
            <Reveal variant="right" delay={140} className="intro-text rv-stagger">
              <p className="eyebrow rose">A NOTE FROM OUR FAMILIES</p>
              <h2>With joy in our hearts,<br /><em>we begin a new chapter.</em></h2>
              <p className="telugu-body">మా ఇరు కుటుంబాల పెద్దల ఆశీస్సులతో, మా వివాహ వేడుకకు విచ్చేసి నూతన వధూవరులను ఆశీర్వదించవలసిందిగా మనస్ఫూర్తిగా ఆహ్వానిస్తున్నాము.</p>
              <p className="english-body">With the love and blessings of our elders and families, we request the pleasure of your presence as we celebrate the beginning of our life together. Your blessings will make our day truly special.</p>
              <div className="signature">With love, <span>Sujitha & Srikar</span></div>
            </Reveal>
          </div>
        </section>

        {/* Ritual film-strip — each frame appears only if its asset exists */}
        <section className="rituals section-pad" id="moments">
          <Reveal variant="up" className="section-index">02 <span>— THE RITUALS</span></Reveal>
          <Reveal variant="up" delay={80} className="section-heading rv-stagger">
            <p className="eyebrow rose">మా వేడుకలు</p>
            <h2>Every ritual,<br /><em>a promise kept.</em></h2>
            <p>The small sacred moments that make a Telugu wedding.</p>
          </Reveal>
          <Reveal variant="blur" delay={120}><MomentsGallery /></Reveal>
          <div className="ritual-grid">
            <Reveal variant="up" delay={60}>
              <CinemaImage
                slot="jeelakarra" effect="kenburns"
                telugu="జీలకర్ర బెల్లం" caption="Cumin & jaggery — the first vow"
                alt="Bride and groom placing a paste of cumin and jaggery on each other's heads"
              ><Kalash className="cinema-ph" /></CinemaImage>
            </Reveal>
            <Reveal variant="up" delay={140}>
              <CinemaImage
                slot="talambralu" effect="kenburns-out"
                telugu="తలంబ్రాలు" caption="A shower of rice and pearls"
                alt="Rice mixed with pearls showering over the couple"
              ><FloralMark className="cinema-ph" /></CinemaImage>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <CinemaImage
                slot="mehendi" effect="pan"
                telugu="గోరింటాకు" caption="Mehendi — henna and laughter"
                alt="Intricate henna on the bride's hands"
              ><Kolam size={120} className="cinema-ph" /></CinemaImage>
            </Reveal>
          </div>
        </section>

        <section className="count-section">
          <div className="count-bg-mark"><FloralMark /></div>
          <Reveal variant="up"><p className="eyebrow">THE COUNTDOWN TO FOREVER</p></Reveal>
          <Reveal variant="up" delay={90}><h2><span className="shimmer-light">Our day is almost here</span> <span>♡</span></h2></Reveal>
          <Countdown />
          <p className="count-foot">13 DECEMBER 2026 <i>·</i> MUHURTHAM 7:15 AM</p>
          <DiyaLoop><DiyaRow count={5} /></DiyaLoop>
        </section>

        <section className="events section-pad" id="events">
          <Reveal variant="up" className="section-index">03 <span>— THE CELEBRATIONS</span></Reveal>
          <Reveal variant="up" delay={80} className="section-heading rv-stagger">
            <p className="eyebrow rose">SAVE THE DATES</p>
            <h2>Come for the rituals.<br /><em>Stay for the memories.</em></h2>
            <p>Two moments, one celebration — we would love to have you with us.</p>
          </Reveal>
          <div className="event-grid">
            <Reveal variant="unfurl" delay={60}>
              <article className="event-card reception">
                <div className="event-card-top"><span>THE EVENING BEFORE</span><span>01</span></div>
                <div className="event-illustration">
                  <CinemaImage slot="receptionNight" className="event-photo" effect="kenburns" alt="Wedding reception stage at night">
                    <>
                      <div className="moon" /><div className="lamp lamp-a">✧</div>
                      <div className="lamp lamp-b">✧</div><div className="event-arch" />
                    </>
                  </CinemaImage>
                  <span>RECEPTION</span>
                </div>
                <div className="event-info">
                  <p className="telugu-label">స్వాగతం & విందు</p>
                  <h3>The Reception</h3>
                  <div className="event-meta">
                    <span><CalendarDays /> Saturday, 12 December 2026</span>
                    <span><Clock3 /> 7:30 PM onwards</span>
                  </div>
                  <p className="event-note">An evening of warmth, laughter and togetherness.</p>
                </div>
              </article>
            </Reveal>
            <Reveal variant="unfurl" delay={180}>
              <article className="event-card wedding">
                <div className="event-card-top"><span>THE BIG DAY</span><span>02</span></div>
                <div className="event-illustration">
                  <CinemaImage slot="mangalsutra" className="event-photo" effect="kenburns-out" alt="Groom tying the mangalsutra during the muhurtham">
                    <>
                      <div className="sun" /><div className="event-arch" />
                      <div className="mango-leaf">❧</div>
                    </>
                  </CinemaImage>
                  <span>MUHURTHAM</span>
                </div>
                <div className="event-info">
                  <p className="telugu-label">శుభ వివాహం</p>
                  <h3>The Wedding</h3>
                  <div className="event-meta">
                    <span><CalendarDays /> Sunday, 13 December 2026</span>
                    <span><Clock3 /> 7:15 AM – 8:15 AM</span>
                  </div>
                  <p className="event-note">Join us as two families become one.</p>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="details section-pad" id="details">
          <Reveal variant="up" className="section-index">04 <span>— THE PLACE</span></Reveal>
          <Reveal variant="zoom" delay={80}>
            <div className="details-card">
              <div className="details-copy">
                <p className="eyebrow rose">WHERE WE MEET</p>
                <h2>A place to gather,<br /><em>a day to remember.</em></h2>
                <p className="telugu-body">మీ రాకే మాకు ఆనందం. మీ ఆశీస్సులే మా అమూల్యమైన కానుక.</p>
                <h3>K.S.C. Kalyana Mandapam</h3>
                <p>Mydukur, Andhra Pradesh, India</p>
                <a
                  className="map-link"
                  href="https://www.google.com/maps/search/?api=1&query=K.S.C.+Kalyana+Mandapam+Mydukur+Andhra+Pradesh"
                  target="_blank" rel="noreferrer"
                >GET DIRECTIONS <ArrowUpRight size={15} /></a>
              </div>
              <div className="map-art">
                <CinemaImage slot="mandapam" className="map-photo" effect="drift" alt="The Kalyana Mandapam decorated for the wedding">
                  <>
                    <div className="map-circle c1" /><div className="map-circle c2" />
                    <div className="map-road road1" /><div className="map-road road2" />
                  </>
                </CinemaImage>
                <div className="map-sonar" /><div className="map-sonar s2" />
                <div className="map-pin"><MapPin size={25} /></div>
                <div className="map-label">MYDUKUR <span>ANDHRA PRADESH</span></div>
                <FloralMark className="map-flower" />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="rsvp-section" id="rsvp">
          <GlowOrbs orbs={[
            { kind: 'pasupu', size: 220, top: '12%', left: '6%', dur: 18 },
            { kind: 'kumkum', size: 190, top: '52%', left: '78%', dur: 15 },
          ]} />
          <Reveal variant="up" className="rsvp-inner rv-stagger">
            <FloralMark className="rsvp-flower" />
            <p className="eyebrow">A LITTLE NOTE</p>
            <h2>Your presence is<br /><em>our present.</em></h2>
            <p className="rsvp-copy">We hope you can join us for this beautiful beginning. Please let us know if you'll be there.</p>
            {sent ? (
              <div className="thanks">
                <Check /><span>Thank you, {guest || 'dear friend'}! We can't wait to celebrate with you.</span>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={submit}>
                <input aria-label="Your name" placeholder="Your name" value={guest} onChange={e => setGuest(e.target.value)} required />
                <select aria-label="Attendance" value={rsvp} onChange={e => setRsvp(e.target.value)} required>
                  <option value="">Will you be joining us?</option>
                  <option value="Joyfully accepts">Joyfully accepts</option>
                  <option value="Regretfully declines">Regretfully declines</option>
                </select>
                <button type="submit">SEND MY RESPONSE <ArrowUpRight size={15} /></button>
              </form>
            )}
            <p className="rsvp-small">A thousand thanks for being part of our story. <Heart size={12} fill="currentColor" /></p>
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="footer-monogram">S <i>&</i> S</div>
        <p>MADE WITH LOVE, FOR A DAY FULL OF LOVE</p>
        <div className="footer-names">Venkata Sujitha Reddy <span>♡</span> Srikar Reddy</div>
        <small>13 · 12 · 2026 &nbsp; | &nbsp; MYDUKUR, INDIA</small>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
