"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import {
  BadgeCheckIcon,
  BookmarkCheckIcon,
  BookmarkIcon,
  BriefcaseIcon,
} from "lucide-react"

import type { JobDetail } from "@/lib/jobs/types"

/** Detail header: logo, title, "company • Verified Employer", bookmark and
 *  the white Apply Now button. Applying needs an account, so the button leads
 *  to sign-in rather than pretending to file an application. */
export function JobHero({ job }: { job: JobDetail }) {
  const [saved, setSaved] = useState(false)

  return (
    <section className="flex flex-col gap-5 rounded-[16px] border border-white/5 bg-[#151516] p-6 md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-[#1f1f1f]">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${job.company} logo`}
              width={44}
              height={44}
              className="size-9 object-contain"
            />
          ) : (
            <BriefcaseIcon
              aria-hidden="true"
              className="size-6 text-white/50"
            />
          )}
        </span>

        <div className="min-w-0">
          <h1 className="font-inter text-xl leading-tight font-semibold text-white sm:text-2xl">
            {job.title}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
            <span>{job.company}</span>
            <span aria-hidden="true" className="text-white/30">
              •
            </span>
            {job.verified && (
              <span className="flex items-center gap-1 text-[#4ade80]">
                <BadgeCheckIcon aria-hidden="true" className="size-4" />
                Verified Employer
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:ml-auto">
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved jobs" : "Save this job"}
          onClick={() => setSaved((value) => !value)}
          className="grid size-11 cursor-pointer place-items-center rounded-[10px] border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
        >
          {saved ? (
            <BookmarkCheckIcon
              aria-hidden="true"
              className="size-5 text-[#4ade80]"
            />
          ) : (
            <BookmarkIcon aria-hidden="true" className="size-5" />
          )}
        </button>

        <Link
          href="/sign-in"
          className="grid h-11 place-items-center rounded-[10px] bg-white px-7 font-manrope text-[15px] font-semibold text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
        >
          Apply Now
        </Link>
      </div>
    </section>
  )
}
