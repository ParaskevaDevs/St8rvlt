'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type CartLine = {
  id: string
  name: string
  price: number
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  isOpen: boolean
  addItem: (item: { id: string; name: string; price: number }) => void
  removeItem: (id: string) => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem: CartContextValue['addItem'] = (item) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id)
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, qty: l.qty + 1 } : l,
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
    setIsOpen(true)
  }

  const removeItem: CartContextValue['removeItem'] = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      isOpen,
      addItem,
      removeItem,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [lines, count, isOpen],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
