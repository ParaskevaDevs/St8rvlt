'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = ['BORN IN NICOSIA.', 'WORN WORLDWIDE.', 'NEW ERA OF ★.']

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.man-line')

      if (reduce) {
        gsap.set(lines, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(lines.slice(0, -1), { autoAlpha: 0.18 })
        return
      }

      gsap.set(lines, { autoAlpha: 0, yPercent: 40, clipPath: 'inset(0% 0% 100% 0%)' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.6,
        },
      })

      // background shift black -> deep red -> black
      tl.to(root.current, { backgroundColor: '#0B0B0B', duration: 0.5 }, 0)
        .to(root.current, { backgroundColor: '#B30710', duration: 1 }, 0.5)
        .to(root.current, { backgroundColor: '#0B0B0B', duration: 1 }, 2)

      lines.forEach((line, i) => {
        const at = i
        tl.to(
          line,
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.6,
            ease: 'expo.out',
          },
          at,
        )
        // fade previous line back so statements reveal one at a time
        if (i > 0) {
          tl.to(
            lines[i - 1],
            { autoAlpha: 0.12, yPercent: -25, duration: 0.6, ease: 'power2.inOut' },
            at,
          )
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="about"
      aria-label="Manifesto"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div className="relative container-1400 px-6" style={{ height: 'min(40vh, 320px)' }}>
        {LINES.map((line) => (
          <h2
            key={line}
            className="man-line absolute inset-0 flex items-center justify-center text-center font-archivo text-paper"
            style={{
              fontSize: 'clamp(40px, 9vw, 130px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            {line}
          </h2>
        ))}
      </div>
    </section>
  )
}
