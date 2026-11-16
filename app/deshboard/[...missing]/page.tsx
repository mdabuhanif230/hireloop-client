import Link from "next/link"

import { ROLES } from "@/lib/roles"

/** Friendly fallback for dashboard links without a page yet.
 *
 *  Rendering a real page here (instead of throwing `notFound()` or
 *  `redirect()`) also avoids a React Server Components performance-measure
 *  exception in the current Next.js development overlay when a route aborts. */
export default async function MissingDashboardPage({
  params,
}: {
  params: Promise<{ missing: string[] }>
}) {
  const { missing } = await params
  const head = missing[0] ?? ""
  const role = ROLES.find((value) => value.toLowerCase() === head.toLowerCase())
  const canonical = role ? `/deshboard/${role}` : "/deshboard"

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        Dashboard
      </p>
      <h1 className="text-3xl font-semibold text-foreground">
        This page isn&apos;t available yet
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        The dashboard link may be outdated, or this section is still being built.
        Choose a dashboard page to continue.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href={canonical}
          className="inline-flex h-10 items-center rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4b42e8]"
        >
          {role ? `Open ${role} dashboard` : "Open dashboard"}
        </Link>
        <Link
          href="/jobs"
          className="inline-flex h-10 items-center rounded-lg border border-input px-5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent"
        >
          Browse jobs
        </Link>
      </div>
    </main>
  )
}
