'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const tvRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = root.current
    if (!video || !section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches

    const ctx = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>('.hero-intro-item')

      // -------- Fallback: reduced-motion or touch (scrubbing currentTime is
      // unreliable on iOS). Static layout; autoplay muted loop inside the TV. --
      if (reduce || touch) {
        gsap.set(introItems, { autoAlpha: 1, y: 0 })
        if (!reduce) {
          video.muted = true
          video.loop = true
          video.play().catch(() => {
            /* autoplay may be blocked; poster remains */
          })
        }
        return
      }

      // -------- Intro stagger: brand reads instantly, then settles ----------
      gsap.fromTo(
        introItems,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
        },
      )

      // -------- Desktop: pinned scroll-scrubbed playback inside the TV -------
      let duration = 0
      video.muted = true
      video.pause()
      video.load()

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=280%',
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

      const onMeta = () => {
        duration = video.duration
        ScrollTrigger.refresh()
      }
      if (video.readyState >= 1 && video.duration) {
        onMeta()
      } else {
        video.addEventListener('loadedmetadata', onMeta)
      }

      // store for cleanup
      ;(section as HTMLElement & { _onMeta?: () => void })._onMeta = onMeta
    }, root)

    return () => {
      const onMeta = (section as HTMLElement & { _onMeta?: () => void })._onMeta
      if (onMeta) video.removeEventListener('loadedmetadata', onMeta)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={root}
      id="top"
      aria-label="ST8R hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-black"
    >
      <div className="container-1400 grid w-full grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-12 md:gap-8 md:py-0">
        {/* ---------- Type-first brand block ---------- */}
        <div className="md:col-span-7 lg:col-span-7">
          <p
            ref={introRef}
            className="hero-intro-item font-archivo text-grey"
            style={{ fontSize: '11px', letterSpacing: '0.28em' }}
          >
            CYPRUS STREETWEAR — EST. 2024
          </p>

          <h1
            className="hero-intro-item mt-5 font-archivo text-paper"
            style={{
              fontSize: 'clamp(64px, 12vw, 180px)',
              lineHeight: 0.86,
              letterSpacing: '-0.03em',
            }}
          >
            ST8R
          </h1>

          <p
            className="hero-intro-item mt-5 font-archivo text-paper"
            style={{
              fontSize: 'clamp(18px, 2.4vw, 30px)',
              letterSpacing: '0.04em',
            }}
          >
            NEW ERA OF <span className="text-red">★</span>
          </p>

          <a
            href="#shop"
            className="hero-intro-item mt-9 inline-block border border-red font-archivo text-red transition-colors duration-300 hover:bg-red hover:text-black"
            style={{ fontSize: '11px', letterSpacing: '0.2em', padding: '14px 28px' }}
          >
            SHOP THE DROP
          </a>
        </div>

        {/* ---------- Retro CRT television ---------- */}
        <div className="hero-intro-item flex justify-center md:col-span-5 md:justify-end">
          <div
            ref={tvRef}
            className="crt-tv relative w-full"
            style={{ maxWidth: 'min(360px, 80vw)' }}
          >
            {/* antenna */}
            <div className="crt-antenna" aria-hidden="true">
              <span className="crt-antenna-arm crt-antenna-left" />
              <span className="crt-antenna-arm crt-antenna-right" />
            </div>

            {/* TV body */}
            <div className="crt-body">
              <div className="crt-face">
                {/* screen */}
                <div className="crt-screen">
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

                  {/* screen vignette */}
                  <div className="crt-screen-vignette" aria-hidden="true" />
                  {/* scanlines */}
                  <div className="crt-scanlines" aria-hidden="true" />
                  {/* faint flicker + glow */}
                  <div className="crt-flicker" aria-hidden="true" />
                </div>

                {/* control panel: knobs + power LED */}
                <div className="crt-controls" aria-hidden="true">
                  <span className="crt-led" />
                  <span className="crt-knob" />
                  <span className="crt-knob" />
                  <span className="crt-speaker" />
                </div>
              </div>
            </div>

            {/* feet */}
            <div className="crt-feet" aria-hidden="true">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crt-tv {
          --bezel: #17171a;
          --bezel-hi: #2a2a2e;
        }

        /* ----- antenna ----- */
        .crt-antenna {
          position: relative;
          height: 42px;
          display: flex;
          justify-content: center;
        }
        .crt-antenna-arm {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 2px;
          height: 56px;
          background: linear-gradient(to top, #3a3a3e, #6a6a70);
          transform-origin: bottom center;
          border-radius: 2px;
        }
        .crt-antenna-left {
          transform: rotate(-34deg);
        }
        .crt-antenna-right {
          transform: rotate(34deg);
        }

        /* ----- body ----- */
        .crt-body {
          position: relative;
          background: linear-gradient(160deg, var(--bezel-hi), var(--bezel) 55%, #0f0f11);
          border-radius: 22px;
          padding: 18px 18px 16px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -2px 6px rgba(0, 0, 0, 0.6),
            0 24px 60px rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .crt-face {
          display: flex;
          gap: 14px;
          align-items: stretch;
        }

        /* ----- screen ----- */
        .crt-screen {
          position: relative;
          flex: 1;
          aspect-ratio: 4 / 3;
          border-radius: 14px / 18px;
          overflow: hidden;
          background: #000;
          box-shadow:
            inset 0 0 0 3px #050506,
            inset 0 0 0 6px #1c1c1f,
            inset 0 0 28px rgba(0, 0, 0, 0.9);
          /* faint screen glow */
          filter: saturate(1.05);
        }
        .crt-screen-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            120% 120% at 50% 45%,
            transparent 52%,
            rgba(0, 0, 0, 0.55) 100%
          );
        }
        .crt-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.22) 3px
          );
          mix-blend-mode: multiply;
          opacity: 0.7;
        }
        .crt-flicker {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            80% 60% at 50% 40%,
            rgba(120, 160, 255, 0.06),
            transparent 70%
          );
          animation: crt-flicker 5.5s steps(60) infinite;
        }
        @keyframes crt-flicker {
          0%,
          97%,
          100% {
            opacity: 0.5;
          }
          98% {
            opacity: 0.3;
          }
          99% {
            opacity: 0.65;
          }
        }

        /* ----- controls ----- */
        .crt-controls {
          width: 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding-top: 6px;
        }
        .crt-led {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--red, #ff2a2a);
          box-shadow: 0 0 8px 1px rgba(255, 42, 42, 0.8);
        }
        .crt-knob {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #4a4a4e, #1a1a1c 70%);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.15),
            0 1px 2px rgba(0, 0, 0, 0.6);
        }
        .crt-speaker {
          margin-top: 4px;
          width: 26px;
          height: 40px;
          border-radius: 4px;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.4px);
          background-size: 6px 6px;
          opacity: 0.6;
        }

        /* ----- feet ----- */
        .crt-feet {
          display: flex;
          justify-content: space-between;
          padding: 0 34px;
        }
        .crt-feet span {
          width: 26px;
          height: 12px;
          background: #0f0f11;
          border-radius: 0 0 6px 6px;
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.5);
        }

        @media (prefers-reduced-motion: reduce) {
          .crt-flicker {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
