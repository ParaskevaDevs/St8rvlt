'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// One marquee unit — repeated to fill the strip, then the whole span is
// duplicated so the CSS `.marquee-track` (-50% loop) reads seamlessly.
const MARQUEE = 'NEW ERA OF ★ — ST8R — STARVLT — NICOSIA, CY — '

type Social = {
  label: string
  href?: string
  dim?: boolean
}

const SOCIALS: Social[] = [
  { label: 'INSTAGRAM — @starvlt.cy', href: 'https://instagram.com/starvlt.cy' },
  { label: 'DEPOP — st8rvault', href: 'https://depop.com/st8rvault' },
  { label: 'NICOSIA, CY', dim: true },
]

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Reduced motion: everything visible and static (marquee loop is killed
      // separately by the CSS media query on `.marquee-track`).
      if (reduce) {
        gsap.set('.foot-wordmark, .foot-col, .foot-legal', {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
        })
        return
      }

      // Hidden start states, set immediately so nothing flashes in fully formed.
      gsap.set('.foot-wordmark', {
        autoAlpha: 0,
        yPercent: 8,
        scale: 1.05,
        clipPath: 'inset(0% 0% 100% 0%)',
        transformOrigin: '50% 100%',
      })
      gsap.set('.foot-col', {
        autoAlpha: 0,
        y: 24,
        clipPath: 'inset(0% 0% 100% 0%)',
      })
      gsap.set('.foot-legal', { autoAlpha: 0, y: 18 })

      // Plays once as the footer enters — no scrub, no reverse flicker.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })

      // 1. ST8R wordmark — mask reveal upward + settle from a slight scale.
      tl.to(
        '.foot-wordmark',
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'expo.out',
        },
        0,
      )
        // 2. ABOUT + SOCIALS columns rise and unmask, staggered.
        .to(
          '.foot-col',
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          },
          0.35,
        )
        // 3. Legal row last.
        .to(
          '.foot-legal',
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3',
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={root}
      aria-label="Site footer"
      className="relative z-10 overflow-hidden bg-black"
    >
      {/* 1 — MARQUEE STRIP */}
      <div className="foot-marquee overflow-hidden bg-red" aria-hidden="true">
        <div className="marquee-track py-2.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="font-grotesk text-black"
              style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em' }}
            >
              {MARQUEE.repeat(6)}
            </span>
          ))}
        </div>
      </div>

      <div className="container-1400 px-6 py-20 md:px-12 md:py-28">
        {/* 2 — BIG WORDMARK */}
        <div className="foot-wordmark relative inline-block" style={{ willChange: 'transform' }}>
          <h2
            className="font-archivo text-paper"
            style={{ fontSize: 'clamp(72px, 14vw, 220px)', lineHeight: 0.82, letterSpacing: '-0.04em' }}
          >
            ST8R
          </h2>
          {/* red dot accent — matches the hero wordmark motif */}
          <span
            aria-hidden="true"
            className="absolute rounded-full bg-red"
            style={{ top: '16%', right: '-0.16em', width: '0.16em', height: '0.16em' }}
          />
        </div>

        {/* 3 — ABOUT / SOCIALS band */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
          {/* LEFT — ABOUT */}
          <div className="foot-col">
            <p
              className="mb-5 font-mono text-grey"
              style={{ fontSize: '11px', letterSpacing: '0.28em' }}
            >
              ABOUT
            </p>
            <p
              className="font-grotesk text-paper"
              style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '46ch' }}
            >
              ST8R is a Cyprus streetwear label built on limited drops. No restocks,
              no noise — just timed releases from the vault. Born in Nicosia, worn
              worldwide.
            </p>
          </div>

          {/* RIGHT — SOCIALS / STOCKISTS */}
          <div className="foot-col md:justify-self-end">
            <p
              className="mb-5 font-mono text-grey"
              style={{ fontSize: '11px', letterSpacing: '0.28em' }}
            >
              SOCIALS / STOCKISTS
            </p>
            <ul className="flex flex-col gap-3.5">
              {SOCIALS.map((s) =>
                s.href ? (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="group inline-flex items-center gap-2 font-grotesk text-paper transition-colors hover:text-red"
                      style={{ fontSize: '15px', letterSpacing: '0.04em', transitionDuration: '250ms' }}
                    >
                      <span
                        className="inline-block transition-transform group-hover:translate-x-1.5"
                        style={{ transitionDuration: '250ms' }}
                      >
                        {s.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-block -translate-x-1.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        style={{ transitionDuration: '250ms' }}
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ) : (
                  <li key={s.label}>
                    <span
                      className="font-grotesk text-grey"
                      style={{ fontSize: '15px', letterSpacing: '0.04em' }}
                    >
                      {s.label}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 4 — LEGAL / LICENSE ROW */}
      <div className="foot-legal border-t border-paper/10">
        <div
          className="container-1400 flex flex-col gap-3 px-6 py-6 font-mono text-grey md:flex-row md:items-center md:justify-between md:px-12"
          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
        >
          <span>© 2026 STARVLT (ST8R). ALL RIGHTS RESERVED.</span>
          <span>CYPRUS STREETWEAR — EST. 2024 — DEMO SITE</span>
          <a
            href="https://paraskeva.dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Built by paraskeva.dev (opens in a new tab)"
            className="text-grey transition-colors duration-300 hover:text-red"
          >
            BUILT BY PARASKEVA.DEV
          </a>
        </div>
      </div>
    </footer>
  )
}
