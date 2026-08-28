'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import config, { isDropLive, formatStart, type DropProduct } from '@/config/drop'
import { useCart } from '@/components/cart-context'
import ProductArt from '@/components/ProductArt'

export default function DropPage() {
  // Deterministic on first paint (forceLive only) so SSR and the first
  // client render match — the clock-based flip happens after mount.
  const [live, setLive] = useState(config.forceLive)

  useEffect(() => {
    if (isDropLive(config)) setLive(true)
  }, [])

  if (!live) {
    return (
      <section
        className="flex w-full flex-col items-center justify-center bg-black px-6 text-center"
        style={{ minHeight: '100svh' }}
      >
        <p
          className="font-mono uppercase text-grey"
          style={{ fontSize: '11px', letterSpacing: '0.28em' }}
        >
          NOT LIVE YET — {formatStart(config.startTime)} · {config.location}
        </p>
        <h1
          className="font-archivo text-paper"
          style={{
            marginTop: 16,
            fontSize: 'clamp(40px, 8vw, 90px)',
            letterSpacing: '-0.03em',
          }}
        >
          {config.dropName} ISN&apos;T OPEN YET
        </h1>
        <Link
          href="/"
          className="font-grotesk transition-colors duration-300 hover:bg-red hover:text-black"
          style={{
            marginTop: 32,
            border: '1px solid var(--red)',
            color: 'var(--red)',
            fontWeight: 500,
            letterSpacing: '0.18em',
            fontSize: '13px',
            padding: '14px 30px',
          }}
        >
          BACK TO THE GATE
        </Link>
      </section>
    )
  }

  return (
    <section className="w-full bg-black px-6 pb-24 pt-[calc(100px+env(safe-area-inset-top))] md:px-12">
      <div className="container-1400">
        <p
          className="font-mono uppercase text-red"
          style={{ fontSize: '11px', letterSpacing: '0.28em' }}
        >
          ● DROP IS LIVE — {config.location}
        </p>
        <h1
          className="mt-3 font-archivo text-paper"
          style={{ fontSize: 'clamp(48px, 10vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
        >
          {config.dropName}
        </h1>
        <p
          className="mt-4 font-grotesk text-grey"
          style={{ fontSize: '14px', letterSpacing: '0.02em', maxWidth: '52ch' }}
        >
          No restocks, no noise. What&apos;s below is what exists — once it&apos;s gone, it&apos;s gone.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {config.products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index }: { product: DropProduct; index: number }) {
  const { addItem } = useCart()
  const oneSize = product.sizes.length === 1
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!size) return
    addItem({
      id: product.id,
      name: oneSize ? product.name : `${product.name} — ${size}`,
      price: product.price,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article data-cursor="hover" className="group">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 transition-colors duration-300 group-hover:border-red">
        <ProductArt index={index} name={product.name} accent={product.accent} />
        {product.stock <= 20 && (
          <span
            className="absolute left-3 top-3 border border-red/60 bg-black/60 px-2 py-1 font-mono uppercase text-red backdrop-blur-sm"
            style={{ fontSize: '9px', letterSpacing: '0.16em' }}
          >
            {product.stock} LEFT
          </span>
        )}
        <span
          className="absolute right-3 top-3 font-archivo text-paper"
          style={{ fontSize: '13px', letterSpacing: '0.1em' }}
        >
          €{product.price}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-grotesk text-paper" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>
          {product.name}
        </h3>
        <p
          className="mt-1.5 font-grotesk text-grey"
          style={{ fontSize: '12px', letterSpacing: '0.02em', lineHeight: 1.5 }}
        >
          {product.blurb}
        </p>

        {!oneSize && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={`Size for ${product.name}`}>
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`border font-grotesk transition-colors duration-200 ${
                  size === s
                    ? 'border-red bg-red text-black'
                    : 'border-paper/20 text-paper/70 hover:border-paper/50'
                }`}
                style={{ fontSize: '11px', letterSpacing: '0.08em', padding: '6px 12px' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!size}
          className="mt-4 w-full bg-red py-3 font-archivo text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ fontSize: '12px', letterSpacing: '0.16em' }}
        >
          {added ? 'ADDED ✓' : oneSize ? 'ADD TO CART' : size ? `ADD — ${size}` : 'SELECT A SIZE'}
        </button>
      </div>
    </article>
  )
}
