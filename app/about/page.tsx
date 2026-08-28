import Image from 'next/image'

const VALUES = [
  {
    label: '01 — LIMITED',
    body: 'Every drop is a fixed run. No restocks, no "back soon." What sells out stays sold out.',
  },
  {
    label: '02 — LOCAL',
    body: 'Designed and printed in Nicosia. The train on the wordmark is the old Cyprus railway — gone, but still ours.',
  },
  {
    label: '03 — HONEST',
    body: 'One price, one size run, no discount games. What you see on the drop page is what exists.',
  },
]

const SOCIALS = [
  { label: 'INSTAGRAM — @starvlt.cy', href: 'https://instagram.com/starvlt.cy' },
  { label: 'DEPOP — st8rvault', href: 'https://depop.com/st8rvault' },
]

export default function AboutPage() {
  return (
    <div className="w-full bg-black pb-24 pt-[calc(110px+env(safe-area-inset-top))]">
      <div className="container-1400 px-6 md:px-12">
        <p
          className="font-mono uppercase text-grey"
          style={{ fontSize: '11px', letterSpacing: '0.28em' }}
        >
          INFO
        </p>
        <h1
          className="mt-3 font-archivo text-paper"
          style={{ fontSize: 'clamp(48px, 10vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
        >
          BORN IN NICOSIA.
          <br />
          WORN WORLDWIDE.
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p
              className="font-grotesk text-paper"
              style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7, maxWidth: '58ch' }}
            >
              ST8R started as a sticker on a train carriage in Nicosia and became a
              streetwear label built the same way: small, fast, and gone before it
              gets stale. There&apos;s no warehouse of last season&apos;s stock — every
              piece is printed for one drop, in one quantity, and once it&apos;s claimed
              it doesn&apos;t come back.
            </p>
            <p
              className="mt-6 font-grotesk text-paper"
              style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.7, maxWidth: '58ch' }}
            >
              We work out of Cyprus and ship worldwide. The name is shorthand for
              &quot;STARTER&quot; — the line for whoever&apos;s first through the door
              on drop day.
            </p>

            <div className="mt-14 flex flex-col divide-y divide-paper/10 border-y border-paper/10">
              {VALUES.map((v) => (
                <div key={v.label} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <p
                    className="font-mono uppercase text-grey"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  >
                    {v.label}
                  </p>
                  <p
                    className="font-grotesk text-paper"
                    style={{ fontSize: '14px', lineHeight: 1.6, maxWidth: '48ch' }}
                  >
                    {v.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <p
                className="mb-4 font-mono uppercase text-grey"
                style={{ fontSize: '11px', letterSpacing: '0.28em' }}
              >
                FIND US
              </p>
              <ul className="flex flex-col gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="group inline-flex items-center gap-2 font-grotesk text-paper transition-colors hover:text-red"
                      style={{ fontSize: '15px', letterSpacing: '0.04em' }}
                    >
                      <span className="inline-block transition-transform group-hover:translate-x-1.5">
                        {s.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-block -translate-x-1.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative aspect-square w-full self-start overflow-hidden border border-paper/10 bg-[#0e0e0e]">
            <Image
              src="/logo.png"
              alt="ST8R — Nicosia train mark"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
