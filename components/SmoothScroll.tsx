'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Route touch through Lenis too, so section snapping (lenis.scrollTo)
      // works on phones. Touch-only — desktop (wheel) behaviour is unchanged.
      syncTouch: true,
    })

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // ----------------------------------------------------------------------
    // Five-stop section snapping (Lenis-aware — NOT CSS scroll-snap).
    //
    // Stops, top → bottom:
    //   0 HERO      (pinned + scrubbed)
    //   1 MANIFESTO (pinned + scrubbed)
    //   2 THE DROP  (pinned + horizontally scrubbed)
    //   3 THE STREETS (gallery)
    //   4 ORDER YOURS. / FOOTER
    //
    // Snap targets are anchored to the REAL ScrollTrigger start/end of each
    // pinned section, so the next stop begins exactly where the previous pin
    // releases — zero dead scroll between them. The interior of a pinned
    // section is a free-scrub zone (train video / 3 statements / product row):
    // we never snap there, only at its entry and exit. Everything else snaps
    // one stop per gesture, in the scroll direction.
    // ----------------------------------------------------------------------
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    // No snap on reduced-motion (normal scroll) or touch (gentle native feel).
    const snapEnabled = !reduce && !coarse

    // power2.inOut — deliberate "arriving at a stop".
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    let stops: number[] = [] // sorted scroll positions (px) of the 5 stops
    let scrubRanges: Array<[number, number]> = [] // pinned interiors (free)
    let lastDir = 0 // +1 down, -1 up
    let isSnapping = false
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let rebuildRaf = 0

    const buildStops = () => {
      if (!snapEnabled) return

      const pins = ScrollTrigger.getAll()
        .filter((st) => st.pin)
        .sort((a, b) => a.start - b.start)

      const pts = new Set<number>()
      pts.add(0)
      scrubRanges = []
      pins.forEach((st) => {
        // entry + exit are snap targets; the span between is free-scrub.
        pts.add(Math.round(st.start))
        pts.add(Math.round(st.end))
        scrubRanges.push([st.start, st.end])
      })

      // Footer is the last (non-pinned) stop.
      const footer = document.querySelector('footer')
      if (footer) {
        pts.add(Math.round(footer.getBoundingClientRect().top + window.scrollY))
      }

      // Sort, clamp, and merge near-duplicate boundaries (a pin's end coincides
      // with the next section's top → collapse to a single stop).
      const max = lenis.limit
      const sorted = Array.from(pts)
        .map((p) => Math.max(0, Math.min(p, max)))
        .sort((a, b) => a - b)

      stops = []
      for (const p of sorted) {
        if (stops.length === 0 || p - stops[stops.length - 1] > 8) stops.push(p)
      }
    }

    const inScrubInterior = (y: number, eps: number) => {
      for (const [start, end] of scrubRanges) {
        if (y > start + eps && y < end - eps) return true
      }
      return false
    }

    const attemptSnap = () => {
      if (!snapEnabled || isSnapping || stops.length === 0) return

      const vh = window.innerHeight
      const y = lenis.scroll
      const eps = vh * 0.06

      // Free-scrub zone (hero video / manifesto statements / product row).
      if (inScrubInterior(y, eps)) return

      // Below the last stop = footer tail → free scroll so all footer content
      // (socials, small print) stays reachable.
      const last = stops[stops.length - 1]
      if (y > last + eps) return

      // Directional, one-stop-per-gesture target.
      const commit = vh * 0.04
      let target: number
      if (lastDir > 0) {
        // scrolling down → next stop at/above current position
        target = stops.find((p) => p >= y - commit) ?? last
      } else if (lastDir < 0) {
        // scrolling up → next stop at/below current position
        target = stops[0]
        for (let i = stops.length - 1; i >= 0; i--) {
          if (stops[i] <= y + commit) {
            target = stops[i]
            break
          }
        }
      } else {
        // no direction yet → nearest
        target = stops.reduce((best, p) =>
          Math.abs(p - y) < Math.abs(best - y) ? p : best,
        )
      }

      if (Math.abs(target - y) > 3) {
        isSnapping = true
        lenis.scrollTo(target, {
          duration: 0.7,
          easing: easeInOut,
          onComplete: () => {
            isSnapping = false
          },
        })
      }
    }

    // Settle detection: Lenis stops emitting 'scroll' once inertia ends, so a
    // trailing debounce fires only after the gesture has truly come to rest.
    const onScroll = () => {
      ScrollTrigger.update()
      if (!snapEnabled) return
      if (lenis.direction) lastDir = lenis.direction
      if (settleTimer) clearTimeout(settleTimer)
      settleTimer = setTimeout(attemptSnap, 130)
    }
    lenis.on('scroll', onScroll)

    // Fresh user intent releases an in-flight snap so we never fight them.
    const onUserIntent = () => {
      isSnapping = false
    }

    const scheduleRebuild = () => {
      cancelAnimationFrame(rebuildRaf)
      rebuildRaf = requestAnimationFrame(buildStops)
    }

    if (snapEnabled) {
      window.addEventListener('wheel', onUserIntent, { passive: true })
      window.addEventListener('touchstart', onUserIntent, { passive: true })
      window.addEventListener('keydown', onUserIntent)
      ScrollTrigger.addEventListener('refresh', scheduleRebuild)
      // Build once the pinned spacers have been laid out.
      requestAnimationFrame(() => requestAnimationFrame(buildStops))
    }

    return () => {
      if (settleTimer) clearTimeout(settleTimer)
      cancelAnimationFrame(rebuildRaf)
      if (snapEnabled) {
        window.removeEventListener('wheel', onUserIntent)
        window.removeEventListener('touchstart', onUserIntent)
        window.removeEventListener('keydown', onUserIntent)
        ScrollTrigger.removeEventListener('refresh', scheduleRebuild)
      }
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
