"use client"

import { useState } from "react"

import { JobCard } from "@/components/job-card/job-card"
import { JobFilters } from "@/components/job-filters/job-filters"
import { JobSearch } from "@/components/job-search/job-search"
import { Pagination } from "@/components/pagination/pagination"
import { useApi } from "@/hooks/use-api"
import type { JobSort, JobType, JobsResponse } from "@/lib/jobs/types"
import type { JobFamily, JobListItem } from "@/lib/jobs/types"
import { ApplicationDialog } from "@/components/dashboard/seeker/application-dialog"

const SORT_LABELS: Record<JobSort, string> = {
  recent: "Most Recent",
  salary: "Salary: High to Low",
  closing: "Closing Soon",
}

/** /jobs — search, type filters, sort and pagination, all driven by
 *  GET /api/jobs. Query state lives here (not in the URL) so resetting the
 *  page when a filter changes happens in the same handler, never in an
 *  effect. */
export function BrowseJobsPage({ initialQuery = "", initialLocation = "" }: { initialQuery?: string; initialLocation?: string }) {
  const [input, setInput] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [category, setCategory] = useState<JobFamily | "all">("all")
  const [minSalary, setMinSalary] = useState(0)
  const [applyJob, setApplyJob] = useState<JobListItem | null>(null)
  const [filters, setFilters] = useState({
    q: initialQuery,
    types: [] as JobType[],
    sort: "recent" as JobSort,
    page: 1,
  })

  const params = new URLSearchParams({
    page: String(filters.page),
    sort: filters.sort,
  })
  if (filters.q) params.set("q", filters.q)
  if (filters.types.length > 0) params.set("types", filters.types.join(","))
  if (category !== "all") params.set("category", category)
  if (location.trim()) params.set("location", location.trim())
  if (minSalary) params.set("minSalary", String(minSalary))

  const { data, loading, error, refetch } = useApi<JobsResponse>(
    `/api/jobs?${params.toString()}`
  )

  function toggleType(type: JobType) {
    setFilters((current) => ({
      ...current,
      page: 1,
      types: current.types.includes(type)
        ? current.types.filter((value) => value !== type)
        : [...current.types, type],
    }))
  }

  function clearFilters() {
    setInput("")
    setLocation("")
    setCategory("all")
    setMinSalary(0)
    setFilters((current) => ({ ...current, q: "", types: [], page: 1 }))
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1
  const skeletons = Array.from({ length: 4 }, (_, index) => index)

  return (
    <div className="min-h-svh bg-[#010103] text-white">
      <main className="mx-auto w-full max-w-[1200px] px-4 pt-10 pb-20 sm:px-6">
        <JobSearch
          value={input}
          onChange={setInput}
          onSubmit={() =>
            setFilters((current) => ({ ...current, q: input.trim(), page: 1 }))
          }
        />

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
          <JobFilters
            counts={
              data?.typeCounts ?? { "Full-time": 0, "Part-time": 0, Remote: 0, Contract: 0, Internship: 0, Freelance: 0 }
            }
            selected={filters.types}
            onToggle={toggleType}
            onClear={clearFilters}
            category={category}
            location={location}
            minSalary={minSalary}
            onCategory={value => { setCategory(value); setFilters(current => ({ ...current, page: 1 })) }}
            onLocation={value => { setLocation(value); setFilters(current => ({ ...current, page: 1 })) }}
            onMinSalary={value => { setMinSalary(value); setFilters(current => ({ ...current, page: 1 })) }}
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-manrope text-xl font-semibold text-white">
                {loading && !data
                  ? "Finding jobs…"
                  : `Found ${(data?.total ?? 0).toLocaleString("en-US")} Professional Jobs`}
              </h1>

              <label className="flex items-center gap-2 text-sm text-white/50">
                Sort by
                <span className="relative">
                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        sort: event.target.value as JobSort,
                        page: 1,
                      }))
                    }
                    className="h-9 cursor-pointer appearance-none rounded-[8px] border border-white/12 bg-[#151516] pr-8 pl-3 font-inter text-sm text-white transition-colors outline-none focus:border-[#5c53fe]"
                  >
                    {(Object.keys(SORT_LABELS) as JobSort[]).map((value) => (
                      <option
                        key={value}
                        value={value}
                        className="bg-[#151516] text-white"
                      >
                        {SORT_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-white/50"
                  >
                    ▾
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {loading &&
                !data &&
                skeletons.map((value) => (
                  <div
                    key={value}
                    className="h-[118px] animate-pulse rounded-[16px] border border-white/5 bg-[#151516]"
                  />
                ))}

              {error && (
                <div className="rounded-[16px] border border-white/5 bg-[#151516] p-8 text-center">
                  <p className="font-inter text-sm text-white/60">
                    We couldn&apos;t load the job list.
                  </p>
                  <button
                    type="button"
                    onClick={refetch}
                    className="mt-4 cursor-pointer rounded-[10px] bg-white px-5 py-2.5 font-manrope text-sm font-semibold text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
                  >
                    Try again
                  </button>
                </div>
              )}

              {data && data.items.length === 0 && (
                <div className="rounded-[16px] border border-white/5 bg-[#151516] p-8 text-center">
                  <p className="font-inter text-sm text-white/60">
                    No jobs match your search.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 cursor-pointer rounded-[10px] border border-white/15 px-5 py-2.5 font-manrope text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {data?.items.map((job) => (
                <JobCard key={job.id} job={job} showApply onApply={() => setApplyJob(job)} />
              ))}
            </div>

            {data && (
              <Pagination
                page={data.page}
                totalPages={totalPages}
                onPage={(page) =>
                  setFilters((current) => ({ ...current, page }))
                }
              />
            )}
          </div>
        </div>
      </main>
      {applyJob ? <ApplicationDialog job={applyJob} onClose={() => setApplyJob(null)} /> : null}
    </div>
  )
}

export default BrowseJobsPage
