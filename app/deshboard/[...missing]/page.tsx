import { notFound, redirect } from "next/navigation"

import { ROLES } from "@/lib/roles"

/** Catch-all for /deshboard/* URLs that match no real route.
 *
 *  Without this, Next falls through to the app-wide 404, which renders
 *  OUTSIDE app/deshboard/layout.tsx — no sidebar, no shell (the reported
 *  bug). Landing here instead means every miss renders inside the shell via
 *  app/deshboard/not-found.tsx.
 *
 *  It also rescues old links written with a capitalised role
 *  (/deshboard/Seeker/saved → /deshboard/seeker/saved): the first segment is
 *  matched against the roles case-insensitively and redirected to its
 *  canonical URL — but only when the URL actually changes, otherwise a
 *  missing child page (/deshboard/seeker/jobs) would redirect to itself. */
export default async function MissingDeshboardPage({
  params,
}: {
  params: Promise<{ missing: string[] }>
}) {
  const { missing } = await params
  const [head = "", ...rest] = missing

  const role = ROLES.find((value) => value.toLowerCase() === head.toLowerCase())

  if (role) {
    const requested = `/deshboard/${missing.join("/")}`
    const canonical = `/deshboard/${role}${
      rest.length > 0 ? `/${rest.join("/")}` : ""
    }`

    if (canonical !== requested) redirect(canonical)
  }

  notFound()
}
