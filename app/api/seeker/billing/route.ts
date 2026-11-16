import type { NextRequest } from "next/server"

import { getBilling } from "@/lib/seeker/store"

/** Subscription, card on file and invoice history for
 *  /deshboard/seeker/billing.  GET ?q=<search> filters the invoice table. */
export async function GET(request: NextRequest) {
  return Response.json(getBilling(request.nextUrl.searchParams.get("q") ?? ""))
}
