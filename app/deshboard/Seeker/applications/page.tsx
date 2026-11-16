"use client"

import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/use-api"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  formatRelativeTime,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
} from "@/lib/seeker/format"
import type {
  Application,
  ApplicationTab,
  ApplicationsResponse,
} from "@/lib/seeker/types"
import { cn } from "cn"

import { PageHeader } from "../_components/page-header"
import { Panel } from "../_components/panel"
import { StatCard, StatRow } from "../_components/stat-card"
import {
  EmptyState,
  ErrorState,
  RowsSkeleton,
  StatsSkeleton,
} from "../_components/states"
import { NotificationActions, Topbar } from "../_components/topbar"

const TABS: { id: ApplicationTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
]

const HEADERS = ["Job Title", "Company", "Applied", "Status", "Action"] as const

/** /deshboard/seeker/applications — the pipeline table. Everything except
 *  the Active/Archived toggle is server-side: GET /api/seeker/applications
 *  handles search, tab and pagination, and reports the four KPIs from the
 *  whole pipeline (not the visible page). */
export default function ApplicationsPage() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<ApplicationTab>("active")
  const [page, setPage] = useState(1)

  const debouncedQuery = useDebouncedValue(query)

  const path = useMemo(() => {
    const params = new URLSearchParams()
    params.set("tab", tab)
    params.set("page", String(page))
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim())
    return `/api/seeker/applications?${params.toString()}`
  }, [tab, page, debouncedQuery])

  const { data, loading, error, refetch } = useApi<ApplicationsResponse>(path)

  function pickTab(next: ApplicationTab) {
    setTab(next)
    setPage(1)
  }

  const total = data?.total ?? 0
  const pageSize = data?.pageSize ?? 1
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <>
      <Topbar
        placeholder="Search applications..."
        value={query}
        onValueChange={setQuery}
        actions={<NotificationActions />}
      />

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="My Applications"
          description="Track your job applications and interview progress in real-time."
        >
          <div
            role="group"
            aria-label="Application view"
            className="flex items-center gap-1 rounded-lg border border-border bg-white/[0.03] p-1"
          >
            {TABS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => pickTab(option.id)}
                aria-pressed={tab === option.id}
                className={cn(
                  "h-8 rounded-md px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50",
                  tab === option.id
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-sm font-medium text-black transition-colors outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
          >
            <DownloadIcon className="size-4" />
            Export PDF
          </button>
        </PageHeader>

        {loading && !data ? (
          <>
            <StatsSkeleton />
            <RowsSkeleton rows={5} height={64} />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data ? (
          <>
            <StatRow>
              <StatCard label="Total Applied" value={data.stats.total} />
              <StatCard label="Shortlisted" value={data.stats.shortlisted} />
              <StatCard
                label="Interviews"
                value={data.stats.interviews}
                tone="amber"
              />
              <StatCard
                label="Success Rate"
                value={`${data.stats.successRate}%`}
                tone="green"
              />
            </StatRow>

            {data.items.length === 0 ? (
              <EmptyState
                title={
                  tab === "archived"
                    ? "No archived applications"
                    : "No applications found"
                }
                description={
                  tab === "archived"
                    ? "Applications you archive are kept here out of the active pipeline."
                    : debouncedQuery.trim()
                      ? `Nothing matches “${debouncedQuery.trim()}”.`
                      : "Jobs you apply to will appear here with their live status."
                }
              >
                <Link
                  href="/jobs"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
                >
                  Browse jobs
                </Link>
              </EmptyState>
            ) : (
              <Panel className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        {HEADERS.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className={cn(
                              "px-5 py-3.5 font-medium",
                              header === "Action" && "text-right"
                            )}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((application) => (
                        <ApplicationRow
                          key={application.id}
                          application={application}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {start}–{end} of {total} applications
                  </p>
                  <Pagination
                    page={page}
                    pageCount={Math.max(1, Math.ceil(total / pageSize))}
                    onPageChange={setPage}
                  />
                </div>
              </Panel>
            )}
          </>
        ) : null}
      </div>
    </>
  )
}

function ApplicationRow({ application }: { application: Application }) {
  const monogram = application.company
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <tr className="border-b border-border/60 transition-colors last:border-0 hover:bg-white/[0.02]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[11px] font-semibold tracking-wide text-zinc-200"
          >
            {monogram}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-zinc-100">
              {application.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {application.type} • {application.mode}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-zinc-300">
        {application.company}
      </td>

      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
        {formatRelativeTime(application.appliedAt)}
      </td>

      <td className="px-5 py-4">
        <Badge
          variant="ghost"
          className={STATUS_BADGE_CLASS[application.status]}
        >
          {STATUS_LABEL[application.status]}
        </Badge>
      </td>

      <td className="px-5 py-4 text-right">
        <Link
          href={application.jobId ? `/jobs/${application.jobId}` : "/jobs"}
          className="rounded-md text-zinc-200 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
        >
          Details
        </Link>
      </td>
    </tr>
  )
}

function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}) {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  const stepClass =
    "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-white/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 disabled:pointer-events-none disabled:opacity-40"

  return (
    <nav
      aria-label="Applications pagination"
      className="flex items-center gap-1"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={stepClass}
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      {pages.map((value) => (
        <button
          key={value}
          type="button"
          aria-current={value === page ? "page" : undefined}
          aria-label={`Page ${value}`}
          onClick={() => onPageChange(value)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50",
            value === page
              ? "bg-white font-medium text-black"
              : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
          )}
        >
          {value}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={stepClass}
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  )
}
