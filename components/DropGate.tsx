'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import config, { isDropLive, formatStart } from '@/config/drop'

gsap.registerPlugin(ScrollTrigger)

// Run the entrance before the browser paints so nothing flashes in fully-formed
// and then snaps to its hidden start state. Falls back to useEffect on the
// server to avoid the SSR useLayoutEffect warning.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

/** Milliseconds until startTime, clamped at 0. */
function msLeft(): number {
  return Math.max(0, new Date(config.startTime).getTime() - Date.now())
}

function breakdown(ms: number): TimeLeft {
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function DropGate() {
  const root = useRef<HTMLDivElement>(null)
  const colonsRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  // Flipped true once the entrance finishes — gates the "alive" micro-motion
  // (digit swaps + colon blink) so it never fights the load-in timeline.
  const aliveRef = useRef(false)

  // `live` is initialised deterministically (forceLive only, no clock) so the
  // server-rendered HTML and the first client render match — the clock-based
  // flip happens after mount inside the effect below.
  const [live, setLive] = useState<boolean>(config.forceLive)
  // Lazy init so the countdown is correct from first paint. Dynamic numerals
  // carry suppressHydrationWarning to avoid a server/client clock mismatch.
  const [time, setTime] = useState<TimeLeft>(() => breakdown(msLeft()))
  // Whether to render the days segment — decided once at mount and kept stable.
  const [showDays] = useState<boolean>(() => breakdown(msLeft()).days > 0)
  // Drives whether Segments animate their swap. Safe to derive at init time:
  // it never affects rendered HTML (only post-mount animation logic), so a
  // server/client difference can't cause a hydration mismatch.
  const [reduce] = useState(prefersReduced)

  // NOTIFY ME inline form (UI only — nothing is stored or sent).
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // ---- ticking countdown + auto-flip to live + colon blink ------------------
  useEffect(() => {
    const reduceMotion = prefersReduced()

    if (isDropLive(config)) {
      // Deferred to this effect on purpose (not a clock-based useState init):
      // deriving "live" from the clock during render would diverge between SSR
      // and the first client paint and break hydration. This flip runs after
      // mount, once hydration is already complete.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLive(true)
      setTime(breakdown(0))
      return
    }

    const tick = () => {
      const ms = msLeft()
      setTime(breakdown(ms))

      // Separators blink once per second, in sync with the tick — only after
      // the entrance has revealed them, and never with reduced motion.
      if (!reduceMotion && aliveRef.current && colonsRef.current) {
        gsap.fromTo(
          colonsRef.current.querySelectorAll('.dg-colon'),
          { opacity: 0.4 },
          {
            opacity: 1,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
            overwrite: true,
          },
        )
      }

      if (ms <= 0) {
        setLive(true)
        window.clearInterval(id)
      }
    }

    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  // ---- entrance timeline (runs once, before paint) --------------------------
  useIsoLayoutEffect(() => {
    const reduceMotion = prefersReduced()

    // Nav lives outside this component and persists across routes, so its tween
    // is created OUTSIDE the gsap.context — that way unmounting the gate can't
    // revert the nav back to its hidden "from" state on other pages.
    const navEl = document.querySelector('nav[aria-label="Primary"]')
    let navTween: gsap.core.Tween | undefined
    if (!reduceMotion && navEl) {
      navTween = gsap.fromTo(
        navEl,
        { autoAlpha: 0, y: -8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        },
      )
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        // Everything is already at its visible SSR state; just settle the dot
        // to a faint static accent and mark the hero alive.
        gsap.set('.dg-pulse', { autoAlpha: 0.4 })
        aliveRef.current = true
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          aliveRef.current = true
        },
      })

      tl
        // Kicker: clip-reveal left → right + fade.
        .fromTo(
          '.dg-kicker',
          { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
          { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 0.6 },
          0.1,
        )
        // Wordmark: mask wipe upward + subtle scale settle — the centerpiece.
        .fromTo(
          '.dg-wordmark',
          { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.05, yPercent: 8, autoAlpha: 1 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            yPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
          },
          0.2,
        )
        // Countdown units stagger up.
        .fromTo(
          '.dg-unit',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 },
          0.7,
        )
        // Separators fade in right after, settling dim.
        .fromTo('.dg-colon', { autoAlpha: 0 }, { autoAlpha: 0.4, duration: 0.4 }, '>-0.15')
        // CTA / NOTIFY block fades + slides up last.
        .fromTo('.dg-fade', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.05')
        // NOTIFY ME outline "draws in" left → right via clip.
        .fromTo(
          '.dg-notify',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.5 },
          '<',
        )

      // Barely-there red heartbeat on the wordmark, fades in then loops.
      gsap.fromTo(
        '.dg-pulse',
        { autoAlpha: 0, scale: 0.7 },
        {
          autoAlpha: 0.6,
          scale: 1.5,
          duration: 1.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.7,
        },
      )
    }, root)

    return () => {
      ctx.revert()
      navTween?.kill()
      if (navEl) gsap.set(navEl, { clearProps: 'all' })
    }
  }, [])

  // ---- wordmark mouse-parallax (desktop, fine pointer only) -----------------
  useEffect(() => {
    if (prefersReduced()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = wordmarkRef.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const clamp = gsap.utils.clamp(-6, 6)

    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      xTo(clamp(dx * 6))
      yTo(clamp(dy * 6))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [])

  const fmtStart = formatStart(config.startTime)

  return (
    <div ref={root}>
      {/* ===================== THE GATE (100svh) ===================== */}
      <section
        className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black px-6 text-center"
        style={{ minHeight: '100svh' }}
        aria-label={config.dropName}
      >
        {/* Kicker */}
        <p
          className="dg-kicker font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.28em',
            color: live ? 'var(--red)' : 'var(--grey)',
          }}
        >
          {live ? '● DROP IS LIVE' : `NEXT DROP — ${fmtStart} · ${config.location}`}
        </p>

        {/* Wordmark (parallax wrapper) */}
        <div
          ref={wordmarkRef}
          className="relative inline-block"
          style={{ marginTop: 'clamp(20px, 4vh, 48px)', willChange: 'transform' }}
        >
          <h1
            className="dg-wordmark font-archivo text-paper"
            style={{
              fontSize: 'clamp(64px, 14vw, 200px)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
            }}
          >
            ST8R
          </h1>
          {/* faint pulsing red accent */}
          <span
            className="dg-pulse"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '14%',
              right: '-0.18em',
              width: 'clamp(6px, 0.9vw, 11px)',
              aspectRatio: '1 / 1',
              borderRadius: '9999px',
              background: 'var(--red)',
              opacity: 0,
            }}
          />
        </div>

        {/* State B — drop live: single solid CTA into the drop */}
        {live ? (
          <Link
            href="/drop"
            className="dg-fade font-grotesk transition-opacity duration-300 hover:opacity-90"
            style={{
              marginTop: 'clamp(28px, 5vh, 56px)',
              background: 'var(--red)',
              color: 'var(--black)',
              fontWeight: 500,
              letterSpacing: '0.18em',
              fontSize: '14px',
              padding: '16px 34px',
            }}
          >
            ENTER THE DROP
          </Link>
        ) : (
          <>
            {/* State A — countdown */}
            <div
              ref={colonsRef}
              id="dg-countdown"
              className="max-md:grid max-md:grid-cols-2 max-md:place-items-center md:flex md:items-end md:justify-center"
              style={{
                marginTop: 'clamp(28px, 5vh, 56px)',
                gap: 'clamp(8px, 2vw, 20px)',
              }}
            >
              {showDays && (
                <>
                  <Segment value={time.days} label="DAYS" reduce={reduce} aliveRef={aliveRef} />
                  <Colon />
                </>
              )}
              <Segment value={time.hours} label="HRS" reduce={reduce} aliveRef={aliveRef} />
              <Colon />
              <Segment value={time.minutes} label="MIN" reduce={reduce} aliveRef={aliveRef} />
              <Colon />
              <Segment value={time.seconds} label="SEC" reduce={reduce} aliveRef={aliveRef} />
            </div>

            {/* NOTIFY ME → inline email (UI only) */}
            <div
              className="dg-fade max-md:w-full"
              style={{ marginTop: 'clamp(28px, 5vh, 52px)', minHeight: 48 }}
            >
              {subscribed ? (
                <p
                  className="font-grotesk"
                  style={{ color: 'var(--red)', letterSpacing: '0.18em', fontSize: '13px' }}
                >
                  ✓ YOU&apos;RE ON THE LIST
                </p>
              ) : notifyOpen ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.trim()) setSubscribed(true)
                  }}
                  className="flex flex-wrap items-center justify-center gap-2 max-md:w-full"
                >
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="bg-transparent font-grotesk text-paper outline-none placeholder:text-grey/60 max-md:w-full max-md:text-center"
                    style={{
                      border: '1px solid rgba(245,243,239,0.25)',
                      padding: '12px 16px',
                      letterSpacing: '0.06em',
                      fontSize: '13px',
                      minWidth: 220,
                    }}
                  />
                  <button
                    type="submit"
                    className="font-grotesk transition-colors hover:bg-red hover:text-black max-md:w-full"
                    style={{
                      border: '1px solid var(--red)',
                      color: 'var(--red)',
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      fontSize: '13px',
                      padding: '12px 22px',
                      transitionDuration: '250ms',
                    }}
                  >
                    JOIN
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setNotifyOpen(true)}
                  className="dg-notify font-grotesk transition-colors hover:bg-red hover:text-black max-md:w-full"
                  style={{
                    border: '1px solid var(--red)',
                    color: 'var(--red)',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    fontSize: '13px',
                    padding: '14px 30px',
                    transitionDuration: '250ms',
                  }}
                >
                  NOTIFY ME
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

/** A single countdown unit: big red digits + tiny mono label. */
function Segment({
  value,
  label,
  reduce,
  aliveRef,
}: {
  value: number
  label: string
  reduce: boolean
  aliveRef: React.MutableRefObject<boolean>
}) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const prev = useRef<number>(value)
  const cloneRef = useRef<HTMLElement | null>(null)

  // Animate a quick swap whenever the displayed value changes: the outgoing
  // number (an imperative clone) slides/blurs up and out while the live span
  // slides in from below. Timekeeping is untouched — this only reacts to the
  // already-updated `value`.
  useEffect(() => {
    if (value === prev.current) return
    const oldVal = prev.current
    prev.current = value

    // Reduced motion or pre-entrance: the render already shows the new value.
    if (reduce || !aliveRef.current) return

    const box = boxRef.current
    const num = numRef.current
    if (!box || !num) return

    // Clear any in-flight swap before starting a new one.
    if (cloneRef.current) {
      gsap.killTweensOf(cloneRef.current)
      cloneRef.current.remove()
      cloneRef.current = null
    }
    gsap.killTweensOf(num)

    const clone = num.cloneNode(true) as HTMLElement
    clone.textContent = pad(oldVal)
    clone.setAttribute('aria-hidden', 'true')
    Object.assign(clone.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
    })
    box.appendChild(clone)
    cloneRef.current = clone

    gsap.to(clone, {
      yPercent: -110,
      autoAlpha: 0,
      filter: 'blur(6px)',
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        clone.remove()
        if (cloneRef.current === clone) cloneRef.current = null
      },
    })
    gsap.fromTo(
      num,
      { yPercent: 110, autoAlpha: 0, filter: 'blur(6px)' },
      { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.32, ease: 'power3.out' },
    )
  }, [value, reduce, aliveRef])

  // Remove a stray clone if we unmount mid-swap.
  useEffect(
    () => () => {
      if (cloneRef.current) {
        cloneRef.current.remove()
        cloneRef.current = null
      }
    },
    [],
  )

  return (
    <div className="dg-unit flex flex-col items-center">
      <span
        ref={boxRef}
        className="relative block overflow-hidden font-archivo tabular-nums"
        style={{
          color: 'var(--red)',
          fontSize: 'clamp(34px, 8vw, 96px)',
          lineHeight: 1,
          letterSpacing: '0.01em',
        }}
      >
        <span ref={numRef} className="block" suppressHydrationWarning>
          {pad(value)}
        </span>
      </span>
      <span
        className="font-mono uppercase"
        style={{
          marginTop: 8,
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: 'var(--grey)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

/** Dimmer ":" separator that blinks in sync with the tick. */
function Colon() {
  return (
    <span
      className="dg-colon font-archivo max-md:hidden"
      aria-hidden="true"
      style={{
        color: 'var(--paper)',
        opacity: 0.4,
        fontSize: 'clamp(28px, 6vw, 72px)',
        lineHeight: 1,
        // align with the digit row, sitting above the label baseline
        marginBottom: 26,
      }}
    >
      :
    </span>
  )
}
