'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = root.current
    if (!video || !section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches

    // -------- Fallback: reduced-motion or touch (scrubbing currentTime is
    // unreliable on iOS). Static poster; on touch, autoplay muted loop once. --
    if (reduce || touch) {
      gsap.set(endRef.current, { opacity: 1 })
      if (touch && !reduce) {
        video.muted = true
        video.loop = true
        video.play().catch(() => {
          /* autoplay may be blocked; poster remains */
        })
      }
      return
    }

    // -------- Desktop: pinned scroll-scrubbed playback --------------------
    let duration = 0
    video.muted = true
    video.pause()
    video.load()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (duration) {
              const t = self.progress * duration
              // guard against seeking past the buffered end
              if (Number.isFinite(t)) video.currentTime = Math.min(t, duration - 0.05)
            }
          },
        },
      })

      // Anchor the timeline length to 1 so positions map to scroll progress.
      tl.to({}, { duration: 1 }, 0)
      // End overlay fades in near the finish (progress > ~0.85).
      tl.fromTo(endRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.85)
    }, root)

    const onMeta = () => {
      duration = video.duration
      ScrollTrigger.refresh()
    }
    if (video.readyState >= 1 && video.duration) {
      onMeta()
    } else {
      video.addEventListener('loadedmetadata', onMeta)
    }

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={root}
      id="top"
      aria-label="ST8R hero"
      className="relative h-screen w-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/hero-poster.jpg"
        preload="auto"
        muted
        playsInline
        aria-label="ST8R train moving forward as the logo reveals"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* vignette for edge depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* end overlay — fades in near the finish */}
      <div
        ref={endRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 pb-16"
        style={{ opacity: 0 }}
      >
        <p
          className="font-archivo text-paper"
          style={{
            fontSize: 'clamp(40px, 8vw, 96px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
        >
          ORDER YOURS.
        </p>
        <a
          href="#shop"
          className="pointer-events-auto inline-block border border-red font-archivo text-red transition-colors duration-300 hover:bg-red hover:text-black"
          style={{ fontSize: '11px', letterSpacing: '0.2em', padding: '14px 28px' }}
        >
          SHOP THE DROP
        </a>
      </div>
    </section>
  )
}
