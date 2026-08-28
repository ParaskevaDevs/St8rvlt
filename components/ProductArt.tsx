/**
 * Designed placeholder art for a product card — used until real photography
 * exists. Dark gradient + accent glow + grain + a giant translucent index
 * numeral + a diagonal repeating wordmark band, so an empty product slot
 * reads as "intentional" rather than a missing image.
 */
export default function ProductArt({
  index,
  name,
  accent,
  className,
}: {
  index: number
  name: string
  accent: string
  className?: string
}) {
  const n = String(index).padStart(2, '0')

  return (
    <div
      aria-hidden="true"
      className={`relative h-full w-full overflow-hidden ${className ?? ''}`}
      style={{
        background: `radial-gradient(120% 140% at 85% 12%, ${accent}4D, transparent 60%), linear-gradient(160deg, #101010 0%, #050505 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <span
        className="absolute -bottom-[0.1em] -left-[0.02em] font-archivo text-paper"
        style={{
          fontSize: 'clamp(110px, 22vw, 200px)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          opacity: 0.07,
        }}
      >
        {n}
      </span>

      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] items-center justify-center"
        style={{ width: '170%' }}
      >
        <span
          className="whitespace-nowrap font-mono uppercase text-paper"
          style={{ fontSize: '11px', letterSpacing: '0.5em', opacity: 0.08 }}
        >
          {`ST8R — ${name} — `.repeat(6)}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-3 border border-paper/[0.07]" />
    </div>
  )
}
