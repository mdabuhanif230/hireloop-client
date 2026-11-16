/** Isomorphic checkout constants — imported by BOTH the client pages
 *  (checkout form/summary) and the server-only session store, so nothing in
 *  here may touch Node APIs. */

export const CHECKOUT_PLAN = {
  id: "pro",
  name: "Hireloop Pro Plan",
  description: "Access to all features",
  usd: 20,
} as const

export type CheckoutCurrency = "usd" | "bdt"

/** BDT is a fixed display quote: 20 × 127.6665 = 2,553.33, the amount printed
 *  on the checkout screen (the note under the currency picker rounds it to
 *  127.67). */
export const USD_TO_BDT = 127.6665

export interface CheckoutSession {
  id: string
  status: "complete"
  plan: { name: string; description: string }
  currency: CheckoutCurrency
  /** Charged amount in USD; BDT is derived with USD_TO_BDT. */
  usd: number
  amount: string
  email: string
  cardLast4: string
  createdAt: string
}

export function formatAmount(
  currency: CheckoutCurrency,
  usd: number = CHECKOUT_PLAN.usd
) {
  if (currency === "bdt") {
    return `BDT ${(usd * USD_TO_BDT).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
  return `$${usd.toFixed(2)}`
}

export function usdToBdt(usd: number = CHECKOUT_PLAN.usd) {
  return usd * USD_TO_BDT
}
