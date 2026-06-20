'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Tile = {
  id: string
  image?: string
  color?: string
  speed: number // parallax factor
  span: string // grid classes
  pin?: boolean
}

const TILES: Tile[] = [
  { id: 'g1', image: '/gallery-1.jpg', speed: -40, span: 'md:row-span-2' },
  { id: 'b1', color: '#B30710', speed: 30, span: '' },
  { id: 'g2', image: '/gallery-2.jpg', speed: -20, span: 'md:col-span-2', pin: true },
  { id: 'b2', color: '#161616', speed: 50, span: '' },
  { id: 'b3', color: '#23211d', speed: -30, span: '' },
  { id: 'b4', color: '#2b0406', speed: 20, span: 'md:col-span-2' },
]

export default function Gallery() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('.gal-tile')

      if (reduce) {
        gsap.set(tiles, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 })
        return
      }

      tiles.forEach((tile) => {
        const inner = tile.querySelector<HTMLElement>('.gal-inner')
        const speed = Number(tile.dataset.speed || 0)

        // clip-path mask reveal
        gsap.fromTo(
          tile,
          { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: tile, start: 'top 88%' },
          },
        )

        // parallax drift
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -speed / 6 },
            {
              yPercent: speed / 6,
              ease: 'none',
              scrollTrigger: {
                trigger: tile,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }

        // one tile scales/pins briefly as it passes center
        if (tile.dataset.pin === 'true' && inner) {
          gsap.fromTo(
            inner,
            { scale: 1 },
            {
              scale: 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: tile,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: true,
              },
            },
          )
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="gallery"
      aria-label="The streets"
      className="bg-black py-24 md:py-32"
    >
      <div className="container-1400 px-6 md:px-12">
        <p
          className="mb-3 font-grotesk text-grey"
          style={{ fontSize: '11px', letterSpacing: '0.28em' }}
        >
          02 — ON THE GROUND
        </p>
        <h2
          className="mb-12 font-archivo text-paper md:mb-16"
          style={{ fontSize: 'clamp(44px, 9vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
        >
          THE STREETS
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {TILES.map((t, i) => (
            <figure
              key={t.id}
              data-cursor="hover"
              data-speed={t.speed}
              data-pin={t.pin ? 'true' : 'false'}
              className={`gal-tile relative aspect-[4/5] overflow-hidden bg-[#0e0e0e] ${t.span}`}
            >
              <div className="gal-inner absolute inset-[-8%]">
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={`ST8R street photography ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: t.color }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
