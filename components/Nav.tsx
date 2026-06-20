'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from './cart-context'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'SHOP', href: '#shop' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'ABOUT', href: '#about' },
]

export default function Nav() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')

    // No hero on the page → fall back to a simple top-of-page check.
    if (!hero) {
      const onScroll = () => setScrolled(window.scrollY > 24)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches
    // The hero is pinned for 350% only on the desktop scrub path; in the
    // reduced-motion / touch fallback it's a normal 100vh section.
    const pinned = !reduce && !touch

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: pinned ? '+=350%' : 'bottom top',
      onLeave: () => setScrolled(true),
      onEnterBack: () => setScrolled(false),
      // Sync initial state on load (e.g. refresh mid-page).
      onRefresh: (self) => setScrolled(self.progress >= 1),
    })

    return () => st.kill()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-[background-color,backdrop-filter,border-color] duration-300 motion-reduce:transition-none ${
        scrolled
          ? 'border-b border-white/10 bg-black/40 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        className="container-1400 flex items-center justify-between"
        style={{ padding: '16px clamp(20px, 4vw, 48px)' }}
        aria-label="Primary"
      >
        <a href="#top" className="flex items-center" aria-label="ST8R home">
          <span
            className="font-archivo text-paper"
            style={{ fontSize: '15px', letterSpacing: '0.04em' }}
          >
            ST8R
          </span>
        </a>

        <div className="flex items-center" style={{ gap: 'clamp(18px, 3vw, 40px)' }}>
          <ul className="hidden items-center sm:flex" style={{ gap: 'clamp(18px, 3vw, 40px)' }}>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="font-grotesk text-paper/80 transition-colors duration-300 hover:text-red"
                  style={{ fontSize: '12px', letterSpacing: '0.18em' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            className="group relative flex items-center gap-2 font-grotesk text-paper transition-colors duration-300 hover:text-red"
            style={{ fontSize: '12px', letterSpacing: '0.18em' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 5h2l1.6 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6" />
              <circle cx="9" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
            </svg>
            <span>CART</span>
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1 font-grotesk text-[10px] transition-all duration-300 ${
                count > 0 ? 'bg-red text-black' : 'bg-white/15 text-paper'
              }`}
            >
              {count}
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}
