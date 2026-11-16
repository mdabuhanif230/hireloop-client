/** Shapes shared between the /api/seeker route handlers and the seeker
 *  dashboard pages. Everything here is a type, so `import type` from a client
 *  component erases it at build time — no server code reaches the browser. */

export type SavedJobCategory = "design" | "engineering" | "product"

/** Rows per "Load More" step on the saved-jobs list. Lives here rather than
 *  in the store so the page can reset its window without importing
 *  server-only seed data into the client bundle. */
export const SAVED_PAGE_SIZE = 8

export type SavedSort = "recent" | "closing" | "salary"

export type ApplicationStatus =
  "applied" | "under_review" | "shortlisted" | "rejected" | "offered"

export type ApplicationTab = "active" | "archived"

export type ActivityKind = "application" | "alert" | "message"

/** Quoted segments (single quotes) are rendered amber — see splitQuoted(). */
export interface ActivityItem {
  id: string
  kind: ActivityKind
  message: string
  createdAt: string
}

export interface OverviewResponse {
  stats: {
    savedJobs: number
    applications: number
    interviews: number
    offers: number
  }
  activity: ActivityItem[]
  statusDistribution: { status: ApplicationStatus; count: number }[]
}

export interface SavedJob {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  salary: string
  category: SavedJobCategory
  savedAt: string
  /** null = no deadline. In the past + `closed` = the listing is gone. */
  closesAt: string | null
  closed: boolean
  draftStarted: boolean
}

export interface SavedCategory {
  id: "all" | SavedJobCategory
  label: string
  count: number
}

export interface SavedJobsResponse {
  items: SavedJob[]
  /** Rows returned. The list grows in steps of SAVED_PAGE_SIZE via Load More,
   *  so the client re-requests with a bigger limit instead of appending. */
  limit: number
  hasMore: boolean
  /** Count before pagination, so the header stats never depend on the page. */
  total: number
  closingSoon: number
  categories: SavedCategory[]
}

export interface Application {
  id: string
  jobId?: string | null
  applicantName?: string
  applicantEmail?: string
  resumeName?: string
  coverLetter?: string
  title: string
  company: string
  /** null → the page falls back to a monogram tile. */
  companyLogo: string | null
  type: string
  mode: string
  appliedAt: string
  status: ApplicationStatus
  interviewAt: string | null
  archived: boolean
}

export interface ApplicationStats {
  total: number
  shortlisted: number
  interviews: number
  /** Share of applications that reached an interview, floored to a whole %. */
  successRate: number
}

export interface ApplicationsResponse {
  items: Application[]
  page: number
  pageSize: number
  total: number
  stats: ApplicationStats
}

export interface BillingPlan {
  name: string
  price: number
  interval: string
  description: string
  features: string[]
  nextBillingDate: string
}

export interface PaymentMethod {
  brand: string
  last4: string
  holder: string
  expires: string
}

export interface BillingInvoice {
  id: string
  date: string
  plan: string
  amount: number
  transactionId: string
  status: "paid" | "pending" | "failed"
}

export interface BillingResponse {
  plan: BillingPlan
  paymentMethod: PaymentMethod | null
  history: BillingInvoice[]
  applicationsUsed: number
  applicationLimit: number | null
}

export interface ResumeFile {
  fileName: string
  updatedAt: string
  sizeMb: number
}

export interface SeekerProfile {
  name: string
  email: string
  avatarUrl: string | null
  headline: string
  bio: string
  skills: string[]
  resume: ResumeFile | null
}

export interface ProfilePatch {
  name?: string
  email?: string
  avatarUrl?: string | null
  headline?: string
  bio?: string
  skills?: string[]
  resume?: ResumeFile | null
}
