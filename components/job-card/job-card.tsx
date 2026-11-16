"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  BookmarkCheckIcon,
  BookmarkIcon,
  BriefcaseIcon,
  DollarSignIcon,
} from "lucide-react"

import type { JobBadge, JobListItem } from "@/lib/jobs/types"
import { deleteJson, postJson } from "@/hooks/use-api"

/** Badge chip colours — Easy Apply reads green, Hot Job amber, both on the
 *  #1f1f1f chip fill used by the salary/type chips. */
const badgeStyles: Record<JobBadge, string> = {
  "Easy Apply": "text-[#4ade80]",
  Senior: "text-white/70",
  "Hot Job": "text-[#fbbf24]",
}

function Chip({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`flex h-8 items-center gap-1.5 rounded-full bg-[#1f1f1f] px-3 font-inter text-[13px] font-medium whitespace-nowrap ${
        className ?? "text-white/85"
      }`}
    >
      {icon}
      {children}
    </span>
  )
}

/** One row of the /jobs list. The bookmark is intentionally local: the board
 *  is public, so there is no session to persist it against yet. */
export function JobCard({ job, onApply, showApply = false }: { job: JobListItem; onApply?: () => void; showApply?: boolean }) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/seeker/saved-jobs?limit=100")
      .then(response => response.ok ? response.json() as Promise<{ items: { id: string }[] }> : null)
      .then(data => { if (active && data) setSaved(data.items.some(item => item.id === `saved-${job.id}`)) })
      .catch(() => undefined)
    return () => { active = false }
  }, [job.id])

  async function toggleSaved() {
    setSaving(true)
    setSaveError(false)
    try {
      if (saved) await deleteJson(`/api/seeker/saved-jobs?id=${encodeURIComponent(`saved-${job.id}`)}`)
      else await postJson("/api/seeker/saved-jobs", { jobId: job.id })
      setSaved(!saved)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="flex gap-4 rounded-[16px] border border-white/5 bg-[#151516] p-5 transition-colors hover:border-white/15">
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#1f1f1f]">
        {job.companyLogo ? (
          <Image
            src={job.companyLogo}
            alt={`${job.company} logo`}
            width={36}
            height={36}
            className="size-7 object-contain"
          />
        ) : (
          <BriefcaseIcon aria-hidden="true" className="size-5 text-white/50" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-3">
          <h3 className="font-inter text-[17px] leading-snug font-semibold text-white">
            <Link
              href={`/jobs/${job.id}`}
              className="transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
            >
              {job.title}
            </Link>
          </h3>

          <button
            type="button"
            aria-pressed={saved}
            aria-label={
              saved
                ? `Remove ${job.title} from saved jobs`
                : `Save ${job.title}`
            }
            onClick={() => void toggleSaved()}
            disabled={saving}
            className="-mt-1.5 ml-auto cursor-pointer rounded-lg p-2 text-white/45 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none disabled:opacity-50"
          >
            {saved ? (
              <BookmarkCheckIcon
                aria-hidden="true"
                className="size-4.5 text-[#4ade80]"
              />
            ) : (
              <BookmarkIcon aria-hidden="true" className="size-4.5" />
            )}
          </button>
        </div>

        <p className="mt-1 truncate font-inter text-sm text-white/55">
          {job.company} • {job.location}
        </p>

        <div className="mt-3.5 flex flex-wrap gap-2">
          <Chip
            icon={
              <DollarSignIcon
                aria-hidden="true"
                className="size-3.5 text-white/50"
              />
            }
          >
            {job.salary}
          </Chip>
          <Chip
            icon={
              <BriefcaseIcon
                aria-hidden="true"
                className="size-3.5 text-white/50"
              />
            }
          >
            {job.type}
          </Chip>
          {job.mode === "Hybrid" && <Chip>{job.mode}</Chip>}
          {job.badges.map((badge) => (
            <Chip key={badge} className={badgeStyles[badge]}>
              {badge}
            </Chip>
          ))}
        </div>
        {showApply ? <button type="button" onClick={onApply} className="mt-4 h-9 self-start rounded-lg bg-white px-4 text-sm font-medium text-black hover:bg-white/90">Apply Now</button> : null}
        {saveError ? <p role="alert" className="mt-2 text-xs text-red-400">Could not update saved jobs.</p> : null}
      </div>
    </article>
  )
}
