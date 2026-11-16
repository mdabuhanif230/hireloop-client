"use client"

import Image from "next/image"
import Link from "next/link"
import {
  BellIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  TimerIcon,
  WalletIcon,
  XCircleIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deleteJson, useApi } from "@/hooks/use-api"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { formatRelativeTime } from "@/lib/seeker/format"
import type {
  SavedJob,
  SavedJobCategory,
  SavedJobsResponse,
  SavedSort,
} from "@/lib/seeker/types"
import { SAVED_PAGE_SIZE } from "@/lib/seeker/types"
import { cn } from "cn"

import { PageHeader } from "../_components/page-header"
import { Panel } from "../_components/panel"
import { MiniStat } from "../_components/stat-card"
import { EmptyState, ErrorState, RowsSkeleton } from "../_components/states"
import { Topbar, TopbarIconButton } from "../_components/topbar"

const CHIP_CLASS =
  "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-300"

const PRIMARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none"

const SECONDARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/5 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none"

const TAB_CLASS =
  "h-9 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none"

/** /deshboard/seeker/saved — the bookmarked-jobs list. Filters, search and
 *  sort all round-trip to GET /api/seeker/saved-jobs; "Load More" widens the
 *  window (`limit`) rather than paging, so the list grows in place. */
export default function SavedJobsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<"all" | SavedJobCategory>("all")
  const [sort, setSort] = useState<SavedSort>("recent")
  const [limit, setLimit] = useState(SAVED_PAGE_SIZE)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const debouncedQuery = useDebouncedValue(query)

  const path = useMemo(() => {
    const params = new URLSearchParams()
    params.set("category", category)
    params.set("sort", sort)
    params.set("limit", String(limit))
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim())
    return `/api/seeker/saved-jobs?${params.toString()}`
  }, [category, sort, limit, debouncedQuery])

  const { data, loading, error, refetch } = useApi<SavedJobsResponse>(path)

  function pickCategory(next: "all" | SavedJobCategory) {
    setCategory(next)
    setLimit(SAVED_PAGE_SIZE)
  }

  async function removeJob(id: string) {
    setBusyId(id)
    setActionError(null)
    try {
      await deleteJson(`/api/seeker/saved-jobs?id=${encodeURIComponent(id)}`)
      refetch()
    } catch {
      setActionError("We couldn't remove that job from your list.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <Topbar
        placeholder="Search jobs, companies, or skills..."
        value={query}
        onValueChange={setQuery}
        actions={
          <>
            <TopbarIconButton label="Notifications" dot="green">
              <BellIcon />
            </TopbarIconButton>
            <Link
              href="/deshboard/seeker/settings"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3.5 text-sm font-medium text-black transition-colors outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
            >
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">Upload Resume</span>
            </Link>
          </>
        }
      />

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Saved Jobs"
          description="Manage and track your bookmarked opportunities."
        >
          <MiniStat
            label="Total Saved"
            value={data?.total ?? 0}
            icon={BookmarkIcon}
          />
          <MiniStat
            label="Closing Soon"
            value={data?.closingSoon ?? 0}
            icon={TimerIcon}
            tone="amber"
          />
        </PageHeader>

        {loading && !data ? (
          <>
            <Panel className="h-[52px] animate-pulse bg-white/5" />
            <RowsSkeleton rows={4} height={132} />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data ? (
          <>
            <Panel className="flex flex-col gap-4 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
              <div
                role="group"
                aria-label="Filter saved jobs by category"
                className="flex flex-wrap items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => pickCategory("all")}
                  aria-pressed={category === "all"}
                  className={cn(
                    TAB_CLASS,
                    category === "all"
                      ? "bg-white/10 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Saved
                </button>
                {data.categories.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => pickCategory(option.id)}
                    aria-pressed={category === option.id}
                    className={cn(
                      TAB_CLASS,
                      category === option.id
                        ? "bg-white/10 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs whitespace-nowrap text-muted-foreground">
                  Sort by:
                </span>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as SavedSort)}
                  items={{
                    recent: "Recently Saved",
                    closing: "Closing Soon",
                    salary: "Salary: High to Low",
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-9 rounded-lg border-border bg-white/5"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Saved</SelectItem>
                    <SelectItem value="closing">Closing Soon</SelectItem>
                    <SelectItem value="salary">Salary: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Panel>

            {actionError ? (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {actionError}
              </p>
            ) : null}

            {data.items.length === 0 ? (
              <EmptyState
                title="No saved jobs here"
                description={
                  category === "all" && !debouncedQuery.trim()
                    ? "Bookmark a job while browsing and it will show up in this list."
                    : "Nothing matches the current filters — try a different category or search."
                }
              >
                <Link
                  href="/deshboard/seeker/jobs"
                  className={PRIMARY_BUTTON_CLASS}
                >
                  Browse jobs
                </Link>
              </EmptyState>
            ) : (
              <ul className="flex flex-col gap-4">
                {data.items.map((job) => (
                  <li key={job.id}>
                    <SavedJobRow
                      job={job}
                      busy={busyId === job.id}
                      onRemove={() => removeJob(job.id)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {data.hasMore ? (
              <div className="flex justify-center pt-1">
                <Button
                  variant="ghost"
                  onClick={() => setLimit((value) => value + SAVED_PAGE_SIZE)}
                  className="h-10 rounded-xl px-5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Load More
                  <ChevronDownIcon className="size-4" />
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  )
}

function SavedJobRow({
  job,
  busy,
  onRemove,
}: {
  job: SavedJob
  busy: boolean
  onRemove: () => void
}) {
  return (
    <Panel
      className={cn(
        "flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6",
        job.closed && "opacity-70"
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
          <Image
            src={job.companyLogo}
            alt={`${job.company} logo`}
            width={44}
            height={44}
            className="size-8 object-contain p-1"
          />
        </span>

        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-[-0.01em]">
              {job.title}
            </h2>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              {job.company}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={CHIP_CLASS}>
              <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />
              {job.location}
            </span>
            <span className={CHIP_CLASS}>
              <WalletIcon className="size-3.5 shrink-0 text-muted-foreground" />
              {job.salary}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <div className="flex flex-col gap-1 text-xs lg:items-end">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
            <ClockIcon className="size-3.5" aria-hidden />
            Saved {formatRelativeTime(job.savedAt)}
          </span>
          {job.closed && job.closesAt ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-red-400">
              <XCircleIcon className="size-3.5" aria-hidden />
              Closed {formatRelativeTime(job.closesAt)}
            </span>
          ) : job.closesAt ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-amber-400">
              <TimerIcon className="size-3.5" aria-hidden />
              Closes {formatRelativeTime(job.closesAt)}
            </span>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={busy}
          aria-label={`Remove ${job.title} from saved jobs`}
          onClick={onRemove}
          className="size-9 text-zinc-300 hover:text-white"
        >
          <BookmarkIcon className="size-4 fill-current" />
        </Button>

        {job.closed ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className={cn(
              SECONDARY_BUTTON_CLASS,
              "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
            )}
          >
            Remove from List
          </button>
        ) : job.draftStarted ? (
          <Link
            href="/deshboard/seeker/jobs"
            className={SECONDARY_BUTTON_CLASS}
          >
            Draft Started
          </Link>
        ) : (
          <Link href="/deshboard/seeker/jobs" className={PRIMARY_BUTTON_CLASS}>
            Apply Now
          </Link>
        )}
      </div>
    </Panel>
  )
}
