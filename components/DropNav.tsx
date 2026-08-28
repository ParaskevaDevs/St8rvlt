'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from './cart-context'

/**
 * Minimal fixed top nav, transparent over the black gate.
 * Left = ST8R (home), right = DROP + INFO + cart.
 * Gains a solid/blurred backdrop once the page scrolls past the hero so
 * paper-colored text on paper-colored content stays readable.
 */
const LINKS = [
  { label: 'DROP', href: '/drop' },
  { label: 'INFO', href: '/about' },
]

export default function DropNav() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-colors duration-300 ${
        scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav
        className="container-1400 flex items-center justify-between"
        style={{ padding: '16px clamp(20px, 4vw, 48px)' }}
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center" aria-label="ST8R home">
          <span
            className="font-archivo text-paper transition-colors duration-300 hover:text-red"
            style={{ fontSize: '15px', letterSpacing: '0.04em' }}
          >
            ST8R
          </span>
        </Link>

        <ul className="flex items-center" style={{ gap: 'clamp(18px, 3vw, 40px)' }}>
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="font-grotesk text-paper/80 transition-colors duration-300 hover:text-red"
                style={{ fontSize: '12px', letterSpacing: '0.18em' }}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
              className="group flex items-center gap-2 font-grotesk text-paper/80 transition-colors duration-300 hover:text-red"
              style={{ fontSize: '12px', letterSpacing: '0.18em' }}
            >
              <span>BAG</span>
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 font-grotesk transition-colors duration-300 ${
                  count > 0 ? 'bg-red text-black' : 'bg-white/15 text-paper'
                }`}
                style={{ fontSize: '10px' }}
              >
                {count}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
