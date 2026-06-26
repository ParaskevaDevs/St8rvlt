'use client'

import Link from 'next/link'

/**
 * Minimal fixed top nav, transparent over the black gate.
 * Left = ST8R (home), right = DROP + INFO.
 */
const LINKS = [
  { label: 'DROP', href: '/drop' },
  { label: 'INFO', href: '/about' },
]

export default function DropNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[9000] bg-transparent">
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
        </ul>
      </nav>
    </header>
  )
}
