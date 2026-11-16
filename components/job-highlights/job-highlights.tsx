import { BriefcaseIcon, ClockIcon, MapPinIcon, WalletIcon } from "lucide-react"

import type { JobDetail } from "@/lib/jobs/types"

/** The four labelled tiles under the detail header. */
export function JobHighlights({ job }: { job: JobDetail }) {
  const items = [
    { label: "Salary Range", value: job.salary, icon: WalletIcon },
    { label: "Location", value: job.location, icon: MapPinIcon },
    { label: "Job Type", value: job.type, icon: BriefcaseIcon },
    { label: "Experience", value: job.experience, icon: ClockIcon },
  ]

  return (
    <section
      aria-label="Job at a glance"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-[12px] border border-white/5 bg-[#151516] p-4"
        >
          <Icon aria-hidden="true" className="size-4 text-white/50" />
          <p className="mt-3 text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
            {label}
          </p>
          <p className="mt-1 font-inter text-[15px] font-semibold text-white">
            {value}
          </p>
        </div>
      ))}
    </section>
  )
}
