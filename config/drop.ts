/**
 * ============================================================================
 *  ST8R — DROP CONFIG  (single source of truth)
 * ============================================================================
 *  This is the ONLY file you need to edit to run a drop.
 *  Change the values below, save, and the whole site updates (countdown,
 *  live gate, product list). No code knowledge required — just edit the
 *  values to the right of each `:` and keep the quotes/commas intact.
 * ----------------------------------------------------------------------------
 */

/** One item in the drop. Add/remove these in `products` below. */
export type DropProduct = {
  id: string;        // unique slug, lowercase, no spaces. e.g. "tee-01"
  name: string;      // display name. e.g. "BORN IN NICOSIA TEE"
  price: number;     // price in EUR, number only (no "€"). e.g. 45
  blurb: string;      // one-line description shown under the name. e.g. "Heavyweight cotton, cracked graphic."
  accent: string;     // hex color used to tint the built-in placeholder art. e.g. "#B30710"
  sizes: string[];   // available sizes. e.g. ["S","M","L","XL"] or ["ONE SIZE"]
  stock: number;     // demo scarcity count shown to create urgency. e.g. 25
  image?: string;     // optional path under /public for a real photo. Leave unset to use the placeholder art.
};

/** The whole drop. */
export type DropConfig = {
  dropName: string;  // headline name of the drop. e.g. "DROP 001"
  location: string;  // city/country shown in the kicker. e.g. "NICOSIA, CY"
  /**
   * When the drop unlocks — ISO 8601 with the Cyprus offset.
   * Format: "YYYY-MM-DDTHH:MM:SS+03:00"  (+03:00 = Cyprus summer time / EEST)
   * e.g. "2026-06-27T18:00:00+03:00" = 27 June 2026, 18:00 Cyprus time.
   */
  startTime: string;
  /**
   * Manual override. Set to `true` to force the site LIVE right now and skip
   * the countdown entirely (useful for testing or a surprise drop).
   * Set back to `false` to let the countdown run to `startTime`.
   */
  forceLive: boolean;
  products: DropProduct[];
};

/**
 * The live config. EDIT THE VALUES HERE to run your drop.
 */
const config: DropConfig = {
  dropName: "DROP 001",
  location: "NICOSIA, CY",
  // Replace with your real drop time.
  startTime: "2026-09-04T18:00:00+03:00",
  // Flip to `true` to go live immediately, ignoring the countdown.
  forceLive: false,
  // The drop. Duplicate a block to add more — keep `id` unique. This list
  // feeds both the homepage carousel and the /drop grid.
  products: [
    {
      id: "tee-blood-star",
      name: "BLOOD STAR TEE",
      price: 45,
      blurb: "Heavyweight cotton, cracked star graphic across the chest.",
      accent: "#B30710",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
    },
    {
      id: "hood-noir-vault",
      name: "NOIR VAULT HOODIE",
      price: 95,
      blurb: "Oversized fit, embroidered wordmark, fleece-lined hood.",
      accent: "#3A3A3A",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
    },
    {
      id: "cap-cy-06",
      name: "CY 06 CAP",
      price: 40,
      blurb: "Low-profile six-panel, debossed leather patch.",
      accent: "#FF2A2A",
      sizes: ["ONE SIZE"],
      stock: 30,
    },
    {
      id: "tee-paper-run",
      name: "PAPER RUN TEE",
      price: 45,
      blurb: "Washed paper-white tee, back print of the Nicosia metro line.",
      accent: "#9A9A9A",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
    },
    {
      id: "tote-vault-canvas",
      name: "VAULT CANVAS TOTE",
      price: 35,
      blurb: "Raw canvas, star-branded, holds the whole drop.",
      accent: "#2B0406",
      sizes: ["ONE SIZE"],
      stock: 40,
    },
  ],
};

/**
 * Returns `true` when the drop should be treated as live:
 * either `forceLive` is on, or the current time has reached `startTime`.
 * NOTE: this reads the clock at call time, so call it on the client to react
 * to the countdown hitting zero.
 */
export function isDropLive(cfg: DropConfig = config): boolean {
  if (cfg.forceLive) return true;
  return Date.now() >= new Date(cfg.startTime).getTime();
}

/** Format an ISO startTime as "27.06 · 18:00 CY" in Cyprus time. */
export function formatStart(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Nicosia",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")} · ${get("hour")}:${get("minute")} CY`;
}

export default config;
