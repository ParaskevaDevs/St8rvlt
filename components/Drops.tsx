'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from './cart-context'

gsap.registerPlugin(ScrollTrigger)

type Product = {
  id: string
  name: string
  price: number
  image?: string
  color?: string
}

const PRODUCTS: Product[] = [
  { id: 'st8r-tee-blood', name: 'BLOOD STAR TEE', price: 25, image: '/product-1.jpg' },
  { id: 'st8r-hood-noir', name: 'NOIR HOODIE', price: 25, color: '#161616' },
  { id: 'st8r-cap-cy', name: 'CY CAP', price: 25, color: '#B30710' },
  { id: 'st8r-tee-paper', name: 'PAPER TEE', price: 25, color: '#23211d' },
  { id: 'st8r-tote-vault', name: 'VAULT TOTE', price: 25, color: '#2b0406' },
]

export default function Drops() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // heading reveal
      gsap.from('.drops-heading', {
        yPercent: reduce ? 0 : 120,
        opacity: reduce ? 1 : 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.drops-heading', start: 'top 85%' },
      })

      // horizontal scroll only on desktop
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          if (reduce || !track.current || !root.current) return
          const scrollAmount = () =>
            track.current!.scrollWidth - window.innerWidth

          gsap.to(track.current, {
            x: () => -scrollAmount(),
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => '+=' + scrollAmount(),
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="shop"
      aria-label="The drop"
      className="relative overflow-hidden bg-black py-24 md:py-0"
    >
      <div className="md:flex md:h-screen md:flex-col md:justify-center">
        <div className="container-1400 px-6 md:px-12">
          <p
            className="mb-3 font-grotesk text-grey"
            style={{ fontSize: '11px', letterSpacing: '0.28em' }}
          >
            01 — IN STOCK
          </p>
          <h2
            className="drops-heading mb-12 font-archivo text-red md:mb-16"
            style={{ fontSize: 'clamp(44px, 9vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            THE DROP
          </h2>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-6 md:w-max md:flex-row md:gap-8 md:px-12"
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              data-cursor="hover"
              className="group w-full shrink-0 md:w-[340px] lg:w-[380px]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#0e0e0e] transition-colors duration-300 group-hover:border-red">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={`${p.name} — ST8R drop`}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundColor: p.color }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className="absolute right-3 top-3 font-archivo text-paper"
                  style={{ fontSize: '12px', letterSpacing: '0.1em' }}
                >
                  €{p.price}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
