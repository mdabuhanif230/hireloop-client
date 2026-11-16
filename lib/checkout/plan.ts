/** Isomorphic checkout constants — imported by BOTH the client pages
 *  (checkout form/summary) and the server-only session store, so nothing in
 *  here may touch Node APIs. */

export type PlanAudience = "seekers" | "recruiters"
export type CheckoutPlan = { id: string; name: string; description: string; usd: number; audience: PlanAudience }

export const CHECKOUT_PLANS: Record<string, CheckoutPlan> = {
  pro: { id: "pro", name: "HireLoop Pro Plan", description: "Apply to 30 jobs per month with unlimited saved jobs and salary insights.", usd: 19, audience: "seekers" },
  premium: { id: "premium", name: "HireLoop Premium Plan", description: "Unlimited applications, profile boost, early access, and priority support.", usd: 39, audience: "seekers" },
  growth: { id: "growth", name: "HireLoop Growth Plan", description: "Up to 10 active job posts with applicant tracking and analytics.", usd: 49, audience: "recruiters" },
  enterprise: { id: "enterprise", name: "HireLoop Enterprise Plan", description: "Up to 50 active posts, advanced analytics, and team features.", usd: 149, audience: "recruiters" },
}

export const CHECKOUT_PLAN = CHECKOUT_PLANS.pro

export function getCheckoutPlan(id?: string, audience?: string) {
  const plan = CHECKOUT_PLANS[(id ?? "pro").toLowerCase()] ?? CHECKOUT_PLAN
  return audience === plan.audience ? plan : audience ? CHECKOUT_PLAN : plan
}

export type CheckoutCurrency = "usd" | "bdt"

/** BDT is a fixed display quote: 20 × 127.6665 = 2,553.33, the amount printed
 *  on the checkout screen (the note under the currency picker rounds it to
 *  127.67). */
export const USD_TO_BDT = 127.6665

export interface CheckoutSession {
  id: string
  status: "complete"
  plan: { name: string; description: string }
  planId: string
  audience: PlanAudience
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
