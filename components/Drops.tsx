'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from './cart-context'
import config from '@/config/drop'
import ProductArt from './ProductArt'

gsap.registerPlugin(ScrollTrigger)

// A layout effect (not a passive effect) so ctx.revert() below runs
// synchronously during React's unmount commit, before React detaches the
// section — otherwise ScrollTrigger's pin-spacer re-parenting is still in
// place when React tries to removeChild it, throwing a NotFoundError.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Sourced from config/drop.ts — the same list that drives the /drop grid,
// so the homepage teaser and the full drop never fall out of sync.
const PRODUCTS = config.products

export default function Drops() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useIsoLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // The mobile address bar shows/hides constantly, firing height-only
    // resizes. Ignore those so the pinned carousel never jumps mid-scroll;
    // genuine width/orientation changes still recompute via the handlers below.
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      // heading reveal (all viewports)
      gsap.from('.drops-heading', {
        yPercent: reduce ? 0 : 120,
        opacity: reduce ? 1 : 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.drops-heading', start: 'top 85%' },
      })

      // Pinned horizontal scroll-telling — ONE code path for mobile + desktop.
      // The section pins and the product row scrubs sideways as you scroll.
      // The only difference is card width (CSS): ~80vw on phones, fixed px on
      // desktop. Distance is computed from the element so it survives resizes.
      if (reduce || !track.current || !root.current) return

      const distance = () => track.current!.scrollWidth - window.innerWidth

      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    }, root)

    // Recompute only on real width / orientation changes (not the address-bar
    // height wobble), so the pin stays stable on touch.
    let lastW = window.innerWidth
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth
        ScrollTrigger.refresh()
      }
    }
    const onOrient = () => {
      lastW = window.innerWidth
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onOrient)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onOrient)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={root}
      id="shop"
      aria-label="The drop"
      className="relative overflow-hidden bg-black"
    >
      <div className="flex min-h-[100svh] flex-col justify-center py-8 md:min-h-screen">
        <div className="container-1400 px-6 md:px-12">
          <div className="flex items-baseline justify-between">
            <p
              className="mb-3 font-grotesk text-grey"
              style={{ fontSize: '11px', letterSpacing: '0.28em' }}
            >
              01 — IN STOCK
            </p>
            <p
              className="drops-heading mb-3 font-mono uppercase text-grey"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              SCROLL TO EXPLORE →
            </p>
          </div>
          <h2
            className="drops-heading mb-12 font-archivo text-red md:mb-16"
            style={{ fontSize: 'clamp(44px, 9vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            THE DROP
          </h2>
        </div>

        <div
          ref={track}
          className="flex w-max flex-row gap-4 px-6 md:gap-8 md:px-12"
        >
          {PRODUCTS.map((p, i) => (
            <article
              key={p.id}
              data-cursor="hover"
              className="group w-[80vw] shrink-0 md:w-[340px] lg:w-[380px]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#0e0e0e] transition-colors duration-300 group-hover:border-red">
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.name} — ST8R drop`}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover"
                    />
                  ) : (
                    <ProductArt index={i + 1} name={p.name} accent={p.accent} />
                  )}
                </div>
                {p.stock <= 20 && (
                  <span
                    className="absolute left-3 top-3 border border-red/60 bg-black/60 px-2 py-1 font-mono uppercase text-red backdrop-blur-sm"
                    style={{ fontSize: '9px', letterSpacing: '0.16em' }}
                  >
                    {p.stock} LEFT
                  </span>
                )}
                <span
                  className="absolute right-3 top-3 font-archivo text-paper"
                  style={{ fontSize: '12px', letterSpacing: '0.1em' }}
                >
                  €{p.price}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-grotesk text-paper"
                    style={{ fontSize: '13px', letterSpacing: '0.1em' }}
                  >
                    {p.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price })}
                    className="border border-red px-4 py-2 font-grotesk text-red transition-colors duration-300 hover:bg-red hover:text-black"
                    style={{ fontSize: '10px', letterSpacing: '0.16em' }}
                  >
                    ADD TO CART
                  </button>
                </div>
                <p
                  className="mt-1.5 font-grotesk text-grey"
                  style={{ fontSize: '11px', letterSpacing: '0.03em' }}
                >
                  {p.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
