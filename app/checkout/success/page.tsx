import { redirect } from "next/navigation"

import { PaymentSuccess } from "@/components/payment-success/payment-success"
import { getCheckoutSession } from "@/lib/checkout/store"

/** /checkout/success?session=cs_test_… — reads the session back from the
 *  store before printing "Session ID Verified"; an unknown or missing id
 *  bounces straight back to /checkout. (Server component: no fetch round-trip
 *  to our own API, and no client flash of an empty card.) */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>
}) {
  const { session: sessionId } = await searchParams
  const session = sessionId ? getCheckoutSession(sessionId) : null

  if (!session) redirect("/checkout")

  return (
    <div className="min-h-svh bg-[#050507] text-white">
      <PaymentSuccess session={session} />
    </div>
  )
}
