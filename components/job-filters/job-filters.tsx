import { CheckIcon } from "lucide-react"

import type { JobFamily, JobType } from "@/lib/jobs/types"
import { JOB_TYPES } from "@/lib/jobs/types"

/** Left rail of /jobs: job-type checkboxes with the whole-board counts (they
 *  don't move while a search or another filter is active). */
export function JobFilters({
  counts,
  selected,
  onToggle,
  onClear,
  category,
  location,
  minSalary,
  onCategory,
  onLocation,
  onMinSalary,
}: {
  counts: Record<JobType, number>
  selected: JobType[]
  onToggle: (type: JobType) => void
  onClear: () => void
  category: string
  location: string
  minSalary: number
  onCategory: (category: JobFamily | "all") => void
  onLocation: (location: string) => void
  onMinSalary: (salary: number) => void
}) {
  return (
    <aside className="h-fit rounded-[16px] border border-white/5 bg-[#151516] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-manrope text-lg font-semibold text-white">
          Filters
        </h2>
        {(selected.length > 0 || category !== "all" || location || minSalary > 0) && (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-xs font-medium text-[#8f8bff] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
          >
            Clear
          </button>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-white/60">Job Type</legend>

        <ul className="mt-3 flex flex-col gap-2.5">
          {JOB_TYPES.map((type) => {
            const checked = selected.includes(type)

            return (
              <li key={type}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/85">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(type)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-[18px] shrink-0 place-items-center rounded-[4px] border border-white/25 transition-colors peer-checked:border-white peer-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#5c53fe]/70"
                  >
                    {checked && (
                      <CheckIcon
                        className="size-3 text-[#0b0b14]"
                        strokeWidth={4}
                      />
                    )}
                  </span>
                  <span>{type}</span>
                  <span className="ml-auto text-white/40 tabular-nums">
                    {counts[type]}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <label className="mt-5 block text-sm font-medium text-white/60">Location<input value={location} onChange={event => onLocation(event.target.value)} placeholder="City or Remote" className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-500" /></label>
      <label className="mt-5 block text-sm font-medium text-white/60">Category<select value={category} onChange={event => onCategory(event.target.value as JobFamily | "all")} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#101012] px-3 text-sm text-white outline-none focus:border-violet-500"><option value="all">All categories</option><option value="design">Design</option><option value="engineering">Engineering</option><option value="research">Research</option><option value="data">Data & Analytics</option><option value="marketing">Marketing</option></select></label>
      <label className="mt-5 block text-sm font-medium text-white/60">Minimum salary<select value={minSalary} onChange={event => onMinSalary(Number(event.target.value))} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#101012] px-3 text-sm text-white outline-none focus:border-violet-500"><option value={0}>Any salary</option><option value={90000}>$90k+</option><option value={130000}>$130k+</option><option value={180000}>$180k+</option></select></label>
    </aside>
  )
}
