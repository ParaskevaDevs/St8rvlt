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
        gsap.set('.foot-reveal', { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' })
        return
      }
      gsap.from('.foot-reveal', {
        yPercent: 60,
        autoAlpha: 0,
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="relative bg-black pt-24 md:pt-32">
      {/* Marquee */}
      <div
        className="overflow-hidden border-y border-white/10 py-4"
        aria-hidden="true"
      >
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="font-archivo text-red"
              style={{ fontSize: 'clamp(20px, 3vw, 38px)', letterSpacing: '0.04em', paddingRight: '1ch' }}
            >
              ST8R ★ STARVLT ★ NEW ERA OF ★ —&nbsp;ST8R ★ STARVLT ★ NEW ERA OF ★ —&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="container-1400 px-6 py-20 md:px-12 md:py-28">
        <h2
          className="foot-reveal font-archivo text-paper"
          style={{ fontSize: 'clamp(56px, 16vw, 280px)', lineHeight: 0.86, letterSpacing: '-0.03em' }}
        >
          ORDER<br />YOURS.
        </h2>

        <div className="foot-reveal mt-16 flex flex-col gap-8 border-t border-white/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
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
      <div className="border-t border-white/10">
        <div className="container-1400 flex flex-col gap-2 px-6 py-6 font-grotesk text-grey md:flex-row md:items-center md:justify-between md:px-12"
          style={{ fontSize: '10px', letterSpacing: '0.14em' }}
        >
          <span>© 2026 STARVLT (ST8R). ALL RIGHTS RESERVED.</span>
          <span>CYPRUS STREETWEAR — EST. 2024 — DEMO SITE</span>
        </div>
      </div>
    </footer>
  )
}
