import { randomBytes } from "node:crypto"

import {
  formatAmount,
  CHECKOUT_PLANS,
  getCheckoutPlan,
  type CheckoutCurrency,
  type CheckoutSession,
} from "./plan"

/** Checkout sessions behind /checkout → /checkout/success (server-only).
 *
 *  There is no Stripe key in this project (.env holds only better-auth vars),
 *  so payment runs against a local session store that mirrors the parts of
 *  Stripe's API this UI reads: create a `cs_test_…` session, then look it up
 *  again to confirm it. Swapping in real Stripe means replacing
 *  `createCheckoutSession` with `stripe.checkout.sessions.create` and this
 *  lookup with a webhook / `sessions.retrieve` call — the shapes the pages use
 *  (CheckoutSession, lib/checkout/plan.ts) stay the same. */

export type CheckoutInput = {
  plan?: string
  audience?: string
  currency?: string
  email?: string
  card?: {
    number?: string
    expiry?: string
    cvc?: string
    name?: string
    country?: string
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns the first problem with the payload, or null when it is payable. */
export function validateCheckout(input: CheckoutInput): string | null {
  const card = input.card ?? {}
  if (input.plan && (!CHECKOUT_PLANS[input.plan.toLowerCase()] || (input.audience && CHECKOUT_PLANS[input.plan.toLowerCase()].audience !== input.audience))) return "Choose a valid plan."

  if (input.currency !== "usd" && input.currency !== "bdt") {
    return "Choose a currency."
  }
  if (!input.email || !EMAIL_RE.test(input.email)) {
    return "Enter a valid email address."
  }

  const digits = (card.number ?? "").replace(/\D/g, "")
  if (digits.length < 15 || digits.length > 16) {
    return "Your card number is incomplete."
  }

  const expiry = /^(\d{2})\/(\d{2})$/.exec(card.expiry ?? "")
  if (!expiry) {
    return "Your expiry date is incomplete."
  }
  const month = Number(expiry[1])
  const year = 2000 + Number(expiry[2])
  const now = new Date()
  if (month < 1 || month > 12) {
    return "Your expiry month is invalid."
  }
  if (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  ) {
    return "Your card has expired."
  }

  if (!/^\d{3,4}$/.test(card.cvc ?? "")) {
    return "Your security code is incomplete."
  }
  if (!card.name || card.name.trim().length < 2) {
    return "Enter the cardholder name."
  }
  if (!card.country) {
    return "Choose a country or region."
  }

  return null
}

/** The session map must survive being loaded twice: Next bundles the route
 *  handlers and the server pages separately, so each gets its own copy of
 *  this module — without a global the session created by POST /api/checkout
 *  would be invisible to /checkout/success (and a dev-server hot reload would
 *  forget every session). */
function checkoutSessions() {
  const shared = globalThis as typeof globalThis & {
    __hireloopCheckoutSessions?: Map<string, CheckoutSession>
  }

  shared.__hireloopCheckoutSessions ??= new Map<string, CheckoutSession>()
  return shared.__hireloopCheckoutSessions
}

const sessions = checkoutSessions()

export function createCheckoutSession(
  input: CheckoutInput,
  cardLast4: string
): CheckoutSession {
  const currency = input.currency as CheckoutCurrency
  const plan = getCheckoutPlan(input.plan, input.audience)
  const session: CheckoutSession = {
    // `cs_test_` + 16 mixed-case chars, matching Stripe's session id shape
    // (and the id the success screen prints).
    id: `cs_test_${randomBytes(12).toString("base64url").slice(0, 16)}`,
    status: "complete",
    plan: {
      name: plan.name,
      description: plan.description,
    },
    planId: plan.id,
    audience: plan.audience,
    currency,
    usd: plan.usd,
    amount: formatAmount(currency, plan.usd),
    email: input.email ?? "",
    cardLast4,
    createdAt: new Date().toISOString(),
  }

  sessions.set(session.id, session)
  return session
}

export function getCheckoutSession(id: string): CheckoutSession | null {
  return sessions.get(id) ?? null
}
