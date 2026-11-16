"use client"

import Link from "next/link"
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  MailIcon,
  MegaphoneIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import { useApi } from "@/hooks/use-api"
import { formatRelativeTime, splitQuoted } from "@/lib/seeker/format"
import type { ActivityKind, OverviewResponse } from "@/lib/seeker/types"

import { PageHeader } from "./_components/page-header"
import { Panel } from "./_components/panel"
import { StatCard, StatRow } from "./_components/stat-card"
import { ErrorState, RowsSkeleton, StatsSkeleton } from "./_components/states"
import { NotificationActions, Topbar } from "./_components/topbar"

const ACTIVITY_ICON: Record<
  ActivityKind,
  { icon: LucideIcon; className: string }
> = {
  application: { icon: RefreshCwIcon, className: "text-violet-300" },
  alert: { icon: MegaphoneIcon, className: "text-emerald-400" },
  message: { icon: MailIcon, className: "text-zinc-200" },
}

const SearchPlaceholder = "Search for opportunities..."

/** Seeker home — /deshboard/seeker. Everything below comes from
 *  GET /api/seeker/overview; the search box narrows the feed client-side
 *  because the whole activity list is already in memory. */
export default function SeekerDeshboardPage() {
  const { data, loading, error, refetch } = useApi<OverviewResponse>(
    "/api/seeker/overview"
  )
  const [query, setQuery] = useState("")

  const activity = useMemo(() => {
    const items = data?.activity ?? []
    const needle = query.trim().toLowerCase()
    return needle
      ? items.filter((item) => item.message.toLowerCase().includes(needle))
      : items
  }, [data, query])

  return (
    <>
      <Topbar
        placeholder={SearchPlaceholder}
        value={query}
        onValueChange={setQuery}
        actions={<NotificationActions />}
      />

      <div className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {loading && !data ? (
          <>
            <StatsSkeleton />
            <RowsSkeleton rows={6} height={76} />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data ? (
          <>
            <StatRow>
              <StatCard
                label="Saved Jobs"
                value={data.stats.savedJobs}
                icon={BookmarkIcon}
              />
              <StatCard
                label="Applications Submitted"
                value={data.stats.applications}
                icon={SendIcon}
              />
              <StatCard
                label="Interviews Scheduled"
                value={data.stats.interviews}
                icon={CalendarDaysIcon}
                tone="amber"
              />
              <StatCard
                label="Offers Received"
                value={data.stats.offers}
                icon={TrophyIcon}
                tone="green"
              />
            </StatRow>

            <section
              aria-label="Recent Activity"
              className="flex flex-col gap-4"
            >
              <PageHeader title="Recent Activity" className="items-center">
                <Link
                  href="/deshboard/seeker/applications"
                  className="group inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
                >
                  View All Activity
                  <ArrowUpRightIcon
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              </PageHeader>

              {activity.length === 0 ? (
                <Panel className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No activity matches “{query.trim()}”.
                </Panel>
              ) : (
                <ul className="flex flex-col gap-3">
                  {activity.map((item) => {
                    const { icon: Icon, className } = ACTIVITY_ICON[item.kind]

                    return (
                      <li key={item.id}>
                        <Panel className="flex items-center gap-4 px-4 py-4 sm:px-5">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                            <Icon
                              className={`size-5 ${className}`}
                              aria-hidden
                            />
                          </span>

                          <p className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-200">
                            {splitQuoted(item.message).map((part, index) =>
                              part.quoted ? (
                                <span key={index} className="text-amber-400">
                                  ‘{part.text}’
                                </span>
                              ) : (
                                <span key={index}>{part.text}</span>
                              )
                            )}
                          </p>

                          <time
                            dateTime={item.createdAt}
                            className="hidden shrink-0 text-xs whitespace-nowrap text-muted-foreground sm:block"
                          >
                            {formatRelativeTime(item.createdAt)}
                          </time>
                        </Panel>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>

      <Link
        href="/deshboard/seeker/jobs"
        aria-label="Browse jobs"
        title="Browse jobs"
        className="fixed right-5 bottom-5 z-30 flex size-14 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 sm:right-8 sm:bottom-8"
      >
        <PlusIcon className="size-6" />
      </Link>
    </>
  )
}
