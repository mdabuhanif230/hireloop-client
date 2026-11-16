import {
  ClockIcon,
  LaptopIcon,
  LandmarkIcon,
  ShieldCheckIcon,
} from "lucide-react"

import type { BenefitKey, JobDetail } from "@/lib/jobs/types"

const BENEFITS: Record<
  BenefitKey,
  { label: string; icon: typeof ShieldCheckIcon }
> = {
  health: { label: "Full Health & Dental", icon: ShieldCheckIcon },
  retirement: { label: "Competitive 401k", icon: LandmarkIcon },
  hardware: { label: "Latest Hardware Stipend", icon: LaptopIcon },
  pto: { label: "Unlimited PTO", icon: ClockIcon },
}

/** Long-form column of the detail page: description, responsibilities,
 *  requirements (tag chips + bullets) and the 2×2 benefits grid. */
export function JobDescription({ job }: { job: JobDetail }) {
  return (
    <article className="rounded-[16px] border border-white/5 bg-[#151516] p-6 sm:p-8">
      <section>
        <h2 className="font-manrope text-lg font-semibold text-white">
          Job Description
        </h2>
        <p className="mt-3 font-inter text-[15px] leading-[1.75] text-white/60">
          {job.description}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-manrope text-lg font-semibold text-white">
          Responsibilities
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {job.responsibilities.map((item) => (
            <li
              key={item}
              className="flex gap-3 font-inter text-[15px] leading-[1.7] text-white/60"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-white/30"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-manrope text-lg font-semibold text-white">
          Requirements
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {job.requirementTags.map((tag) => (
            <span
              key={tag}
              className="flex h-8 items-center gap-1.5 rounded-[8px] bg-[#1f1f1f] px-3 font-inter-tight text-[13px] font-medium tracking-[0.02em] text-white/85"
            >
              {tag}
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {job.requirements.map((item) => (
            <li
              key={item}
              className="flex gap-3 font-inter text-[15px] leading-[1.7] text-white/60"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-white/30"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-manrope text-lg font-semibold text-white">
          Benefits
        </h2>

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {job.benefits.map((key) => {
            const { label, icon: Icon } = BENEFITS[key]

            return (
              <li
                key={key}
                className="flex items-center gap-3 font-inter text-[15px] text-white/75"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#1f1f1f]">
                  <Icon aria-hidden="true" className="size-4 text-white/70" />
                </span>
                {label}
              </li>
            )
          })}
        </ul>
      </section>
    </article>
  )
}
