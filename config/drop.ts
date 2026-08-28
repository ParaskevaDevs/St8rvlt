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
  image: string;     // path under /public. e.g. "/products/tee-01.jpg"
  sizes: string[];   // available sizes. e.g. ["S","M","L","XL"]
  stock: number;     // demo scarcity count shown to create urgency. e.g. 25
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
  // ~2 days out from launch. Replace with your real drop time.
  startTime: "2026-06-27T18:00:00+03:00",
  // Flip to `true` to go live immediately, ignoring the countdown.
  forceLive: false,
  // Placeholder products so the /drop page has data in the next build.
  // Duplicate a block to add more — keep `id` unique.
  products: [
    {
      id: "tee-01",
      name: "BORN IN NICOSIA TEE",
      price: 45,
      image: "/products/tee-01.jpg",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
    },
    {
      id: "hood-01",
      name: "VAULT HOODIE",
      price: 95,
      image: "/products/hood-01.jpg",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
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

export default config;
