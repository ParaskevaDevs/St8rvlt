'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Tile = {
  id: string
  image: string
  alt: string
  index: string
}

// A tight, curated 2×2 lookbook that fits inside a single 100vh panel.
const TILES: Tile[] = [
  { id: 's1', image: '/gallery-1.jpg', alt: 'ST8R street portrait', index: '01' },
  { id: 's2', image: '/gallery-2.jpg', alt: 'ST8R crew on the ground', index: '02' },
  { id: 's3', image: '/hero.jpg', alt: 'ST8R train detail', index: '03' },
  { id: 's4', image: '/product-1.jpg', alt: 'ST8R blood star tee', index: '04' },
]

export default function Gallery() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('.gal-tile')

      // -------- Reduced motion: everything simply visible -----------------
      if (reduce) {
        gsap.set(tiles, { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)' })
        return
      }

      const hidden = { autoAlpha: 0, yPercent: 14, clipPath: 'inset(0% 0% 100% 0%)' }
      const shown = { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)' }
      gsap.set(tiles, hidden)

      // -------- Touch: no pin (scrub pins feel bad on mobile). Plain
      // staggered reveal as the panel enters. ------------------------------
      if (touch) {
        gsap.to(tiles, {
          ...shown,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        })
        return
      }

      // -------- Desktop: pin for a short scrub window and assemble the grid
      // tile-by-tile during it. The pin makes THE STREETS a discrete snap
      // stop (entry + exit) in the global snap system, just like THE DROP. --
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      tl.to(tiles, {
        ...shown,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.22,
      }, 0.05)
      // hold the assembled grid for the tail of the scrub before snapping out
      tl.to({}, { duration: 0.5 })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="gallery"
      aria-label="The streets"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black md:h-screen"
    >
      <div className="container-1400 w-full px-6 md:px-12">
        <p
          className="mb-3 font-grotesk text-grey"
          style={{ fontSize: '11px', letterSpacing: '0.28em' }}
        >
          02 — ON THE GROUND
        </p>
        <h2
          className="mb-7 font-archivo text-paper md:mb-9"
          style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
        >
          THE STREETS
        </h2>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-5 md:h-[clamp(260px,44vh,460px)]">
          {TILES.map((t) => (
            <figure
              key={t.id}
              data-cursor="hover"
              className="gal-tile group relative aspect-[4/3] overflow-hidden border border-white/5 bg-[#0e0e0e] md:aspect-auto md:h-full"
            >
              <Image
                src={t.image}
                alt={t.alt}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* sparing red accent — small frame index */}
              <span
                className="absolute left-3 top-3 font-archivo text-red"
                style={{ fontSize: '10px', letterSpacing: '0.16em' }}
              >
                {t.index}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
