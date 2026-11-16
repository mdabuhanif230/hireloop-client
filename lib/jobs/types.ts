/** Shared contracts for the public job board (/jobs, /jobs/[id]).
 *
 *  Everything here is plain JSON so the same shapes serve the route handlers
 *  (app/api/jobs/*) and the client pages that fetch them. */

export const JOB_TYPES = ["Full-time", "Contract", "Freelance"] as const
export type JobType = (typeof JOB_TYPES)[number]

export const JOB_SORTS = ["recent", "salary", "closing"] as const
export type JobSort = (typeof JOB_SORTS)[number]

/** Chip that sits next to the salary/type chips on a job card. */
export type JobBadge = "Easy Apply" | "Senior" | "Hot Job"

/** Copy families — the seed stores one description/responsibilities set per
 *  family instead of repeating it 16 times (lib/jobs/store.ts). */
export type JobFamily =
  "design" | "engineering" | "research" | "data" | "marketing"

export interface CompanyRef {
  name: string
  logo: string | null
  size: string
  industry: string
  website: string
}

/** Row of the /jobs list. */
export interface JobListItem {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  salary: string
  type: JobType
  mode: string
  badges: JobBadge[]
  postedAt: string
}

export interface JobsResponse {
  items: JobListItem[]
  page: number
  pageSize: number
  /** Rows matching the current q/type filter (drives "Found N jobs" + pages). */
  total: number
  /** Unfiltered count — always the whole board. */
  totalAll: number
  /** Per-type totals over the whole board, so the sidebar counts don't jump
   *  around while a search is active. */
  typeCounts: Record<JobType, number>
  sort: JobSort
  q: string
  types: JobType[]
}

export type BenefitKey = "health" | "retirement" | "hardware" | "pto"

/** Full detail row behind /jobs/[id]. `company` stays the display string the
 *  cards render; the structured profile gets its own field. */
export interface JobDetail extends JobListItem {
  verified: boolean
  experience: string
  closesAt: string | null
  description: string
  responsibilities: string[]
  requirementTags: string[]
  requirements: string[]
  benefits: BenefitKey[]
  companyProfile: CompanyRef
}

export interface JobNotFound {
  error: string
}
