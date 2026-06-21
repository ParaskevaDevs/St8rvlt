'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.foot-marquee, .foot-up', { autoAlpha: 1, y: 0 })
        gsap.set('.foot-line', { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)' })
        return
      }

      // Initial hidden state (set immediately so there's no flash on arrival).
      gsap.set('.foot-marquee', { autoAlpha: 0, y: -20 })
      gsap.set('.foot-line', { autoAlpha: 0, yPercent: 60, clipPath: 'inset(0% 0% 100% 0%)' })
      gsap.set('.foot-up', { autoAlpha: 0, y: 40 })

      // Sequenced entrance — plays once on arrival (no reverse flicker).
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })

      // 1. marquee slides/fades in first (its loop keeps running underneath)
      tl.to('.foot-marquee', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0)
        // 2. headline builds line by line — clip-path mask + y-up
        .to(
          '.foot-line',
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
            ease: 'expo.out',
            stagger: 0.18,
          },
          0.25,
        )
        // 3. socials row + copyright rise up last
        .to(
          '.foot-up',
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
          '-=0.45',
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={root}
      className="relative flex h-screen flex-col overflow-hidden bg-black"
    >
      {/* Marquee — top, cleared from the fixed nav */}
      <div className="shrink-0 pt-[68px] md:pt-[80px]">
        <div className="foot-marquee overflow-hidden border-y border-white/10 py-3" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span
                key={i}
                className="font-archivo text-red"
                style={{ fontSize: 'clamp(18px, 3vw, 34px)', letterSpacing: '0.04em', paddingRight: '1ch' }}
              >
                ST8R ★ STARVLT ★ NEW ERA OF ★ —&nbsp;ST8R ★ STARVLT ★ NEW ERA OF ★ —&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ORDER YOURS. — centered */}
      <div className="flex flex-1 items-center">
        <div className="container-1400 w-full px-6 md:px-12">
          <h2
            className="font-archivo text-paper"
            style={{ fontSize: 'clamp(40px, 11vw, 150px)', lineHeight: 0.86, letterSpacing: '-0.03em' }}
          >
            <span className="foot-line block">ORDER</span>
            <span className="foot-line block">YOURS.</span>
          </h2>
        </div>
      </div>

      {/* Socials + mark, then copyright line — pinned to the bottom */}
      <div className="shrink-0">
        <div className="foot-up container-1400 w-full px-6 pb-7 md:px-12">
          <div className="flex flex-col gap-6 border-t border-white/10 pt-7 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              <a
                href="https://instagram.com/starvlt.cy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-grotesk text-paper transition-colors duration-300 hover:text-red"
                style={{ fontSize: '13px', letterSpacing: '0.12em' }}
              >
                INSTAGRAM — @starvlt.cy
              </a>
              <a
                href="https://depop.com/st8rvault"
                target="_blank"
                rel="noopener noreferrer"
                className="font-grotesk text-paper transition-colors duration-300 hover:text-red"
                style={{ fontSize: '13px', letterSpacing: '0.12em' }}
              >
                DEPOP — depop.com/st8rvault
              </a>
              <span
                className="font-grotesk text-grey"
                style={{ fontSize: '13px', letterSpacing: '0.12em' }}
              >
                NICOSIA, CY
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 object-contain mix-blend-screen"
              />
              <span
                className="font-archivo text-paper"
                style={{ fontSize: '13px', letterSpacing: '0.04em' }}
              >
                ST8R
              </span>
            </div>
          </div>
        </div>

        {/* small print */}
        <div className="foot-up border-t border-white/10">
          <div
            className="container-1400 flex flex-col gap-2 px-6 py-5 font-grotesk text-grey md:flex-row md:items-center md:justify-between md:px-12"
            style={{ fontSize: '10px', letterSpacing: '0.14em' }}
          >
            <span>© 2026 STARVLT (ST8R). ALL RIGHTS RESERVED.</span>
            <span>CYPRUS STREETWEAR — EST. 2024 — DEMO SITE ★ LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
