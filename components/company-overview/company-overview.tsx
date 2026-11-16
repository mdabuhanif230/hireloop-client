import Image from "next/image"
import Link from "next/link"

import { Building2Icon } from "lucide-react"

import type { CompanyRef } from "@/lib/jobs/types"

/** Right rail of the detail page: cover panel, size/industry rows and the
 *  outbound Visit Website button. */
export function CompanyOverview({ company }: { company: CompanyRef }) {
  return (
    <aside className="h-fit rounded-[16px] border border-white/5 bg-[#151516] p-6">
      <h2 className="font-manrope text-lg font-semibold text-white">
        Company Overview
      </h2>

      <div className="relative mt-4 grid h-40 place-items-center overflow-hidden rounded-[12px] bg-gradient-to-br from-[#22242b] via-[#15161b] to-[#0d0e12]">
        <span
          aria-hidden="true"
          className="absolute -top-10 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-2xl"
        />
        {company.logo ? (
          <Image
            src={company.logo}
            alt={`${company.name} logo`}
            width={72}
            height={72}
            className="relative size-14 object-contain"
          />
        ) : (
          <Building2Icon
            aria-hidden="true"
            className="relative size-10 text-white/35"
          />
        )}
      </div>

      <dl className="mt-5">
        <div className="flex items-center justify-between gap-4 border-t border-white/10 py-3.5">
          <dt className="text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
            Size
          </dt>
          <dd className="text-right font-inter text-sm font-medium text-white">
            {company.size}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 py-3.5">
          <dt className="text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
            Industry
          </dt>
          <dd className="text-right font-inter text-sm font-medium text-white">
            {company.industry}
          </dd>
        </div>
      </dl>

      <Link
        href={company.website}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-4 grid h-11 w-full place-items-center rounded-[10px] bg-white/10 font-manrope text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
      >
        Visit Website
      </Link>
    </aside>
  )
}
