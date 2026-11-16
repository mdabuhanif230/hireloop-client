import type { NextRequest } from "next/server"

import {
  createCheckoutSession,
  validateCheckout,
  type CheckoutInput,
} from "@/lib/checkout/store"

/** Creates the payment session behind /checkout.
 *
 *  POST { currency, email, card: { number, expiry, cvc, name, country } }
 *    → 201 { session }        (validated — the client shows the same errors)
 *    → 400 { error }          (first failing rule, Stripe-style message) */
export async function POST(request: NextRequest) {
  let body: CheckoutInput
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Body must be a JSON object" },
      { status: 400 }
    )
  }

  const problem = validateCheckout(body)
  if (problem) {
    return Response.json({ error: problem }, { status: 400 })
  }

  const digits = (body.card?.number ?? "").replace(/\D/g, "")
  const session = createCheckoutSession(body, digits.slice(-4))

  return Response.json({ session }, { status: 201 })
}
