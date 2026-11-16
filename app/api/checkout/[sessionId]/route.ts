import type { NextRequest } from "next/server"

import { getCheckoutSession } from "@/lib/checkout/store"

/** Reads a session back for /checkout/success ("Session ID Verified"). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const session = getCheckoutSession(sessionId)

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 })
  }

  return Response.json({ session })
}
