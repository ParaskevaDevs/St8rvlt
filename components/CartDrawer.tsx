'use client'

import { useEffect } from 'react'
import { useCart } from './cart-context'

export default function CartDrawer() {
  const { lines, count, isOpen, closeCart, removeItem } = useCart()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)

  return (
    <>
      {/* scrim */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[9100] bg-black/60 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[9200] flex h-full w-full flex-col border-l border-white/10 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[420px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-archivo text-paper" style={{ fontSize: '14px', letterSpacing: '0.12em' }}>
            YOUR BAG ({count})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="font-grotesk text-paper/70 transition-colors hover:text-red"
            style={{ fontSize: '12px', letterSpacing: '0.18em' }}
          >
            CLOSE ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 font-grotesk text-grey" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
              Your bag is empty. Go pull something from the drop.
            </p>
          ) : (
            <ul className="flex flex-col">
              {lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-4 border-b border-white/5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-grotesk text-paper" style={{ fontSize: '13px', letterSpacing: '0.04em' }}>
                      {l.name}
                    </p>
                    <p className="font-grotesk text-grey" style={{ fontSize: '12px' }}>
                      €{l.price} × {l.qty}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(l.id)}
                    aria-label={`Remove ${l.name}`}
                    className="font-grotesk text-grey transition-colors hover:text-red"
                    style={{ fontSize: '11px', letterSpacing: '0.12em' }}
                  >
                    REMOVE
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between font-grotesk text-paper" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
            <span className="text-grey">SUBTOTAL</span>
            <span>€{subtotal}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0}
            className="w-full bg-red py-3.5 font-archivo text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ fontSize: '12px', letterSpacing: '0.16em' }}
          >
            CHECKOUT
          </button>
          <p className="mt-3 text-center font-grotesk text-grey" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
            DEMO — NO PAYMENT IS TAKEN
          </p>
        </div>
      </aside>
    </>
  )
}
