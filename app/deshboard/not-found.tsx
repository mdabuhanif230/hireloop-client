import Link from "next/link"

/** 404 that renders INSIDE the app shell.
 *
 *  `app/deshboard/not-found.tsx` sits under `app/deshboard/layout.tsx`, so a
 *  bad dashboard URL keeps the sidebar and the shell palette instead of
 *  dropping to the app-wide 404 (which has no shell around it). It is raised
 *  by the catch-all at app/deshboard/[...missing]/page.tsx.
 *
 *  "Back to Dashboard" targets /deshboard — the role-resolving stub — so the
 *  button lands a seeker, recruiter or admin on their own workspace without
 *  this file having to read a session. */
export default function DeshboardNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        Error 404
      </p>

      <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>

      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist in this workspace.
        Check the link, or head back to your dashboard.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/deshboard"
          className="inline-flex h-10 items-center rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4b42e8] focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
        >
          Back to Dashboard
        </Link>

        <Link
          href="/jobs"
          className="inline-flex h-10 items-center rounded-lg border border-input px-5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
        >
          Browse Jobs
        </Link>
      </div>
    </main>
  )
}
