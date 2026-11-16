"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { authClient } from "@/lib/auth-client"
import { DEFAULT_ROLE, isRole } from "@/lib/roles"

/** /deshboard root — resolves the visitor's role and hands off to it.
 *
 *  The navbar's "Deshboard" link already targets /deshboard/<role> directly,
 *  so this route only catches typed URLs and old bookmarks. The session is
 *  read on the client (the same authClient.useSession() the navbar uses) —
 *  no server round-trip to Mongo just to pick a redirect. Signed-out
 *  visitors fall back to DEFAULT_ROLE, the same fallback the navbar uses.
 *
 *  Rendered inside the shell (app/deshboard/layout.tsx) while the session
 *  resolves, so even this stub keeps the sidebar. */
export default function DeshboardIndexPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const role =
    session && isRole(session.user.role) ? session.user.role : DEFAULT_ROLE

  React.useEffect(() => {
    if (isPending) return
    router.replace(`/deshboard/${role}`)
  }, [isPending, role, router])

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="size-6 animate-spin rounded-full border-2 border-muted border-t-[#5c53fe]"
      />
      <p className="text-sm text-muted-foreground">Opening your dashboard…</p>
    </main>
  )
}
