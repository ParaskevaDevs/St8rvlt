// Stub — the real drop grid (built from config/drop.ts products) lands next build.
export default function DropPage() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center bg-black px-6 text-center"
      style={{ minHeight: '100svh' }}
    >
      <h1
        className="font-archivo text-paper"
        style={{ fontSize: 'clamp(48px, 10vw, 120px)', letterSpacing: '-0.03em' }}
      >
        DROP
      </h1>
      <p
        className="font-mono uppercase"
        style={{ marginTop: 16, fontSize: '11px', letterSpacing: '0.28em', color: 'var(--grey)' }}
      >
        coming in next build
      </p>
    </section>
  );
}
