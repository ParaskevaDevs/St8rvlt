'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || !dot.current) return

    const el = dot.current
    document.body.classList.add('has-custom-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const grow = () =>
      gsap.to(el, {
        scale: 3.2,
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power3.out',
      })
    const shrink = () =>
      gsap.to(el, {
        scale: 1,
        backgroundColor: '#FF2A2A',
        duration: 0.3,
        ease: 'power3.out',
      })

    const interactiveSel = 'a, button, [data-cursor="hover"]'
    const over = (e: Event) => {
      if ((e.target as Element)?.closest(interactiveSel)) grow()
    }
    const out = (e: Event) => {
      if ((e.target as Element)?.closest(interactiveSel)) shrink()
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return <div ref={dot} className="cursor-dot" aria-hidden="true" />
}
