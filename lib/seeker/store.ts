import type {
  ActivityItem,
  Application,
  ApplicationStatus,
  ApplicationsResponse,
  ApplicationTab,
  BillingInvoice,
  BillingResponse,
  OverviewResponse,
  ProfilePatch,
  SavedJob,
  SavedJobCategory,
  SavedJobsResponse,
  SavedSort,
  SeekerProfile,
} from "@/lib/seeker/types"
import { SAVED_PAGE_SIZE } from "@/lib/seeker/types"

/** Server-side data access for the seeker dashboard.
 *
 *  The reads below are the seam where MongoDB lands: every route handler
 *  calls one function here, so swapping the arrays for collection queries
 *  does not touch the API contract or the pages. Until then the numbers on
 *  screen come from this seed data rather than from literals in the JSX —
 *  stats, category counts and pagination are all derived from the rows.
 *
 *  Nothing here is scoped by session yet; profile is the exception because
 *  it merges the signed-in better-auth user (see app/api/seeker/profile). */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const h = (n: number) => n * HOUR
const d = (n: number) => n * DAY

/** ISO string `offset` ms from now — negative is in the past. */
const at = (offset: number) => new Date(Date.now() + offset).toISOString()

const COMING_SOON_WINDOW = 7 * DAY
export const APPLICATIONS_PAGE_SIZE = 5

/* ------------------------------------------------------------------ *
 * Saved jobs
 * ------------------------------------------------------------------ */

type SavedJobSeed = {
  title: string
  company: string
  logo: string
  location: string
  salary: string
  category: SavedJobCategory
  /** How long ago it was bookmarked. */
  savedAgo: number
  /** Deadline offset — negative means the listing already closed. */
  closesIn?: number
  draftStarted?: boolean
}

// Counts: design 8, engineering 12, product 4 = 24 bookmarks, 3 closing soon.
const SAVED_JOBS_SEED: SavedJobSeed[] = [
  {
    title: "Senior Product Designer",
    company: "Adobe",
    logo: "/logos/adobe.png",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    category: "design",
    savedAgo: h(2),
    closesIn: d(3),
  },
  {
    title: "Frontend Engineer",
    company: "Uber",
    logo: "/logos/uber.png",
    location: "Remote, Global",
    salary: "$140k - $180k",
    category: "engineering",
    savedAgo: d(1),
  },
  {
    title: "Staff UX Researcher",
    company: "Google",
    logo: "/logos/google.png",
    location: "New York, NY (On-site)",
    salary: "$180k - $220k",
    category: "design",
    savedAgo: d(3),
    draftStarted: true,
  },
  {
    title: "Full Stack Developer",
    company: "Meta",
    logo: "/logos/meta.png",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k - $210k + Bonus",
    category: "engineering",
    savedAgo: d(5),
  },
  {
    title: "Design Systems Lead",
    company: "Spotify",
    logo: "/logos/spotify.png",
    location: "Remote, USA",
    salary: "$150k - $190k",
    category: "design",
    savedAgo: d(12),
    closesIn: -d(1),
  },
  {
    title: "Product Designer",
    company: "Airbnb",
    logo: "/logos/airbnb.png",
    location: "Remote, Europe",
    salary: "$120k - $150k",
    category: "design",
    savedAgo: d(2),
  },
  {
    title: "Brand Designer",
    company: "Apple",
    logo: "/logos/apple.png",
    location: "Cupertino, CA (Hybrid)",
    salary: "$140k - $175k",
    category: "design",
    savedAgo: d(4),
    closesIn: d(6),
  },
  {
    title: "Motion Designer",
    company: "Netflix",
    logo: "/logos/netflix.png",
    location: "Los Angeles, CA (Hybrid)",
    salary: "$130k - $165k",
    category: "design",
    savedAgo: d(6),
  },
  {
    title: "UX Writer",
    company: "Microsoft",
    logo: "/logos/microsoft.png",
    location: "Redmond, WA (Hybrid)",
    salary: "$115k - $145k",
    category: "design",
    savedAgo: d(8),
  },
  {
    title: "Senior Visual Designer",
    company: "Uber",
    logo: "/logos/uber.png",
    location: "San Francisco, CA (On-site)",
    salary: "$155k - $195k",
    category: "design",
    savedAgo: d(9),
  },
  {
    title: "Staff Software Engineer",
    company: "Nvidia",
    logo: "/logos/nvidia.png",
    location: "Santa Clara, CA (On-site)",
    salary: "$210k - $280k",
    category: "engineering",
    savedAgo: d(7),
    closesIn: d(2),
  },
  {
    title: "Backend Engineer",
    company: "Amazon",
    logo: "/logos/amazon.png",
    location: "Seattle, WA (Hybrid)",
    salary: "$160k - $215k",
    category: "engineering",
    savedAgo: d(1),
  },
  {
    title: "Platform Engineer",
    company: "Tesla",
    logo: "/logos/tesla.png",
    location: "Austin, TX (On-site)",
    salary: "$170k - $230k",
    category: "engineering",
    savedAgo: d(3),
  },
  {
    title: "Machine Learning Engineer",
    company: "Google",
    logo: "/logos/google.png",
    location: "Mountain View, CA (Hybrid)",
    salary: "$185k - $250k",
    category: "engineering",
    savedAgo: d(4),
  },
  {
    title: "DevOps Engineer",
    company: "Microsoft",
    logo: "/logos/microsoft.png",
    location: "Remote, USA",
    salary: "$150k - $200k",
    category: "engineering",
    savedAgo: d(5),
    draftStarted: true,
  },
  {
    title: "iOS Engineer",
    company: "Apple",
    logo: "/logos/apple.png",
    location: "Cupertino, CA (On-site)",
    salary: "$165k - $220k",
    category: "engineering",
    savedAgo: d(6),
  },
  {
    title: "Data Engineer",
    company: "Netflix",
    logo: "/logos/netflix.png",
    location: "Los Gatos, CA (Hybrid)",
    salary: "$155k - $205k",
    category: "engineering",
    savedAgo: d(8),
  },
  {
    title: "Security Engineer",
    company: "Adobe",
    logo: "/logos/adobe.png",
    location: "San Jose, CA (Hybrid)",
    salary: "$160k - $210k",
    category: "engineering",
    savedAgo: d(10),
  },
  {
    title: "Site Reliability Engineer",
    company: "Spotify",
    logo: "/logos/spotify.png",
    location: "Remote, EU",
    salary: "$145k - $190k",
    category: "engineering",
    savedAgo: d(11),
  },
  {
    title: "Engineering Manager",
    company: "Airbnb",
    logo: "/logos/airbnb.png",
    location: "Remote, USA",
    salary: "$190k - $250k",
    category: "engineering",
    savedAgo: d(13),
  },
  {
    title: "Senior Product Manager",
    company: "Meta",
    logo: "/logos/meta.png",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$175k - $240k",
    category: "product",
    savedAgo: d(2),
    closesIn: d(6),
  },
  {
    title: "Product Manager",
    company: "Uber",
    logo: "/logos/uber.png",
    location: "Remote, Global",
    salary: "$140k - $185k",
    category: "product",
    savedAgo: d(5),
  },
  {
    title: "Group Product Manager",
    company: "Google",
    logo: "/logos/google.png",
    location: "New York, NY (On-site)",
    salary: "$200k - $270k",
    category: "product",
    savedAgo: d(9),
  },
  {
    title: "Product Operations Manager",
    company: "Spotify",
    logo: "/logos/spotify.png",
    location: "Remote, USA",
    salary: "$120k - $155k",
    category: "product",
    savedAgo: d(14),
  },
]

let savedJobs: SavedJob[] = SAVED_JOBS_SEED.map((seed, index) => ({
  id: `saved-${index + 1}`,
  title: seed.title,
  company: seed.company,
  companyLogo: seed.logo,
  location: seed.location,
  salary: seed.salary,
  category: seed.category,
  savedAt: at(-seed.savedAgo),
  closesAt: seed.closesIn === undefined ? null : at(seed.closesIn),
  closed: seed.closesIn !== undefined && seed.closesIn < 0,
  draftStarted: seed.draftStarted ?? false,
}))

const CATEGORY_LABEL: Record<SavedJobCategory, string> = {
  design: "Design",
  engineering: "Engineering",
  product: "Product",
}

const isClosingSoon = (job: SavedJob) => {
  if (job.closed || !job.closesAt) return false
  const remaining = new Date(job.closesAt).getTime() - Date.now()
  return remaining > 0 && remaining <= COMING_SOON_WINDOW
}

export function querySavedJobs(options: {
  category?: string
  sort?: SavedSort
  q?: string
  limit?: number
}): SavedJobsResponse {
  const category =
    options.category === "design" ||
    options.category === "engineering" ||
    options.category === "product"
      ? options.category
      : "all"
  const query = (options.q ?? "").trim().toLowerCase()
  const limit = Math.max(1, options.limit ?? SAVED_PAGE_SIZE)

  const matching = savedJobs.filter((job) => {
    const inCategory = category === "all" || job.category === category
    const matchesQuery =
      !query ||
      [job.title, job.company, job.location, job.salary].some((field) =>
        field.toLowerCase().includes(query)
      )
    return inCategory && matchesQuery
  })

  const sorted = [...matching].sort((a, b) => {
    if (options.sort === "closing") {
      // Listings without a deadline sort last, closed ones after them.
      const aTime = a.closesAt ? new Date(a.closesAt).getTime() : Infinity
      const bTime = b.closesAt ? new Date(b.closesAt).getTime() : Infinity
      return aTime - bTime
    }
    if (options.sort === "salary")
      return salaryTop(b.salary) - salaryTop(a.salary)
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  })

  const items = sorted.slice(0, limit)

  return {
    items,
    limit,
    hasMore: items.length < sorted.length,
    // Global count, not a filtered one: this drives the "Saved Jobs" header
    // stat, which must not shrink while a search or category filter is active.
    total: savedJobs.length,
    closingSoon: savedJobs.filter(isClosingSoon).length,
    categories: (["design", "engineering", "product"] as const).map((id) => ({
      id,
      label: CATEGORY_LABEL[id],
      count: savedJobs.filter((job) => job.category === id).length,
    })),
  }
}

/** Upper bound of "$160k - $200k + Equity" → 200, used for salary sorting. */
function salaryTop(salary: string) {
  const numbers = salary.match(/\d+/g)
  if (!numbers?.length) return 0
  return Number(numbers[numbers.length - 1])
}

export function removeSavedJob(id: string) {
  const before = savedJobs.length
  savedJobs = savedJobs.filter((job) => job.id !== id)
  return savedJobs.length < before
}

export function saveJob(input: { id: string; title: string; company: string; companyLogo: string | null; location: string; salary: string; category: string }) {
  const id = `saved-${input.id}`
  const existing = savedJobs.find(job => job.id === id)
  if (existing) return existing
  const category: SavedJobCategory = input.category === "design" ? "design" : input.category === "engineering" ? "engineering" : "product"
  const saved: SavedJob = { id, title: input.title, company: input.company, companyLogo: input.companyLogo ?? "/images/logo.png", location: input.location, salary: input.salary, category, savedAt: new Date().toISOString(), closesAt: null, closed: false, draftStarted: false }
  savedJobs.unshift(saved)
  return saved
}

/* ------------------------------------------------------------------ *
 * Applications
 * ------------------------------------------------------------------ */

type ApplicationSeed = {
  title: string
  company: string
  logo?: string
  type: string
  mode: string
  appliedAgo: number
  status: ApplicationStatus
  interviewIn?: number
}

// 24 rows: 5 applied, 5 under review, 8 shortlisted, 5 rejected, 1 offered,
// 3 of the shortlisted ones carrying an interview slot.
const APPLICATIONS_SEED: ApplicationSeed[] = [
  {
    title: "Senior Frontend Engineer",
    company: "Stark Industries",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: h(2),
    status: "applied",
  },
  {
    title: "Product Designer",
    company: "Cyberdyne Systems",
    type: "Contract",
    mode: "Hybrid",
    appliedAgo: d(1),
    status: "under_review",
  },
  {
    title: "Lead Data Scientist",
    company: "Wayne Enterprises",
    type: "Full-time",
    mode: "On-site",
    appliedAgo: d(4),
    status: "shortlisted",
    interviewIn: d(3),
  },
  {
    title: "Cloud Architect",
    company: "Oscorp Tech",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: d(7),
    status: "rejected",
  },
  {
    title: "AI Research Engineer",
    company: "Hooli Corp",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(14),
    status: "offered",
  },
  {
    title: "Backend Engineer",
    company: "Umbrella Systems",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(16),
    status: "shortlisted",
  },
  {
    title: "Product Manager",
    company: "Wonka Industries",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: d(21),
    status: "applied",
  },
  {
    title: "Data Analyst",
    company: "Tyrell Corporation",
    type: "Part-time",
    mode: "Remote",
    appliedAgo: d(22),
    status: "under_review",
  },
  {
    title: "UX Designer",
    company: "Stark Industries",
    type: "Contract",
    mode: "On-site",
    appliedAgo: d(23),
    status: "shortlisted",
  },
  {
    title: "Site Reliability Engineer",
    company: "Wayne Enterprises",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(28),
    status: "rejected",
  },
  {
    title: "Machine Learning Engineer",
    company: "Hooli Corp",
    type: "Full-time",
    mode: "On-site",
    appliedAgo: d(31),
    status: "shortlisted",
    interviewIn: d(2),
  },
  {
    title: "QA Engineer",
    company: "Cyberdyne Systems",
    type: "Contract",
    mode: "Remote",
    appliedAgo: d(33),
    status: "applied",
  },
  {
    title: "Solutions Architect",
    company: "Oscorp Tech",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(35),
    status: "under_review",
  },
  {
    title: "Frontend Engineer",
    company: "Umbrella Systems",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: d(38),
    status: "shortlisted",
  },
  {
    title: "Technical Writer",
    company: "Wonka Industries",
    type: "Part-time",
    mode: "Remote",
    appliedAgo: d(42),
    status: "rejected",
  },
  {
    title: "Mobile Engineer",
    company: "Tyrell Corporation",
    type: "Full-time",
    mode: "On-site",
    appliedAgo: d(46),
    status: "shortlisted",
    interviewIn: d(6),
  },
  {
    title: "Growth Product Manager",
    company: "Stark Industries",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(51),
    status: "applied",
  },
  {
    title: "Business Analyst",
    company: "Wayne Enterprises",
    type: "Contract",
    mode: "Hybrid",
    appliedAgo: d(55),
    status: "under_review",
  },
  {
    title: "DevOps Engineer",
    company: "Hooli Corp",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: d(58),
    status: "shortlisted",
  },
  {
    title: "Brand Designer",
    company: "Cyberdyne Systems",
    type: "Contract",
    mode: "On-site",
    appliedAgo: d(64),
    status: "rejected",
  },
  {
    title: "Cloud Engineer",
    company: "Oscorp Tech",
    type: "Full-time",
    mode: "Hybrid",
    appliedAgo: d(70),
    status: "shortlisted",
  },
  {
    title: "Research Scientist",
    company: "Umbrella Systems",
    type: "Full-time",
    mode: "On-site",
    appliedAgo: d(76),
    status: "applied",
  },
  {
    title: "Customer Success Manager",
    company: "Wonka Industries",
    type: "Part-time",
    mode: "Remote",
    appliedAgo: d(83),
    status: "under_review",
  },
  {
    title: "Security Analyst",
    company: "Tyrell Corporation",
    type: "Full-time",
    mode: "Remote",
    appliedAgo: d(91),
    status: "rejected",
  },
]

const applications: Application[] = APPLICATIONS_SEED.map((seed, index) => ({
  id: `app-${index + 1}`,
  jobId: null,
  title: seed.title,
  company: seed.company,
  companyLogo: seed.logo ?? null,
  type: seed.type,
  mode: seed.mode,
  appliedAt: at(-seed.appliedAgo),
  status: seed.status,
  interviewAt: seed.interviewIn === undefined ? null : at(seed.interviewIn),
  archived: false,
}))

export function submitApplication(input: {
  jobId: string
  title: string
  company: string
  companyLogo: string | null
  type: string
  mode: string
  applicantName: string
  applicantEmail: string
  resumeName: string
  coverLetter: string
}) {
  const duplicate = applications.find(application => application.jobId === input.jobId && !application.archived)
  if (duplicate) return { application: duplicate, duplicate: true }
  const application: Application = {
    ...input,
    id: `app-${Date.now()}`,
    appliedAt: new Date().toISOString(),
    status: "applied",
    interviewAt: null,
    archived: false,
  }
  applications.unshift(application)
  return { application, duplicate: false }
}

export function getApplicationsForJob(jobId: string) {
  return applications.filter(application => application.jobId === jobId)
}

export function getSubmittedApplicationCountThisMonth() {
  const now = new Date()
  return applications.filter(application => Boolean(application.jobId) && !application.archived && new Date(application.appliedAt).getMonth() === now.getMonth() && new Date(application.appliedAt).getFullYear() === now.getFullYear()).length
}

export function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const application = applications.find(item => item.id === applicationId)
  if (!application) return null
  application.status = status
  return application
}

export function queryApplications(options: {
  tab?: ApplicationTab
  q?: string
  page?: number
}): ApplicationsResponse {
  const tab = options.tab === "archived" ? "archived" : "active"
  const query = (options.q ?? "").trim().toLowerCase()

  const matching = applications.filter((application) => {
    const inTab =
      tab === "archived" ? application.archived : !application.archived
    const matchesQuery =
      !query ||
      [application.title, application.company].some((field) =>
        field.toLowerCase().includes(query)
      )
    return inTab && matchesQuery
  })

  const total = matching.length
  const page = Math.max(1, options.page ?? 1)
  const start = (page - 1) * APPLICATIONS_PAGE_SIZE

  // Stats always describe the whole active pipeline, never the current page.
  const active = applications.filter((application) => !application.archived)
  const interviews = active.filter(
    (application) => application.interviewAt
  ).length

  return {
    items: matching.slice(start, start + APPLICATIONS_PAGE_SIZE),
    page,
    pageSize: APPLICATIONS_PAGE_SIZE,
    total,
    stats: {
      total: active.length,
      shortlisted: active.filter(
        (application) => application.status === "shortlisted"
      ).length,
      interviews,
      successRate: active.length
        ? Math.floor((interviews / active.length) * 100)
        : 0,
    },
  }
}

/* ------------------------------------------------------------------ *
 * Overview
 * ------------------------------------------------------------------ */

const ACTIVITY_SEED: Omit<ActivityItem, "id" | "createdAt">[] = [
  {
    kind: "application",
    message:
      "Application for Senior Product Designer at TechFlow updated to 'Under Review'",
  },
  {
    kind: "alert",
    message:
      "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
  },
  {
    kind: "message",
    message:
      "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
  },
  {
    kind: "application",
    message:
      "Your application for Staff Software Engineer at Nvidia moved to 'Shortlisted'",
  },
  {
    kind: "message",
    message:
      "Interview scheduled for Wednesday with the hiring team at Wayne Enterprises.",
  },
  {
    kind: "alert",
    message:
      "Design Systems Lead at Spotify closed — 4 more design roles match your profile.",
  },
]

const ACTIVITY_AGO = [h(2), h(5), d(1), d(1), d(2), d(2)]

export function getOverview(): OverviewResponse {
  const active = applications.filter((application) => !application.archived)

  return {
    stats: {
      savedJobs: savedJobs.length,
      applications: active.length,
      interviews: active.filter((application) => application.interviewAt)
        .length,
      offers: active.filter((application) => application.status === "offered")
        .length,
    },
    activity: ACTIVITY_SEED.map((item, index) => ({
      ...item,
      id: `activity-${index + 1}`,
      createdAt: at(-ACTIVITY_AGO[index]),
    })),
    statusDistribution: (["applied", "under_review", "shortlisted", "rejected", "offered"] as const).map(status => ({
      status,
      count: active.filter(application => application.status === status).length,
    })),
  }
}

/* ------------------------------------------------------------------ *
 * Billing
 * ------------------------------------------------------------------ */

const TRANSACTION_IDS = ["948102", "771928", "331085", "220199"]

export function getBilling(query?: string): BillingResponse {
  const now = new Date()
  const nextBillingDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  )

  const history: BillingInvoice[] = TRANSACTION_IDS.map(
    (transaction, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - index,
        now.getDate()
      )
      const olderPlan = index === TRANSACTION_IDS.length - 1
      return {
        id: `invoice-${index + 1}`,
        date: date.toISOString(),
        plan: olderPlan ? "Free" : "Pro",
        amount: olderPlan ? 0 : 19,
        transactionId: `TRX-${transaction}-HL`,
        status: "paid" as const,
      }
    }
  )

  const needle = (query ?? "").trim().toLowerCase()

  return {
    plan: {
      name: "Pro",
      price: 19,
      interval: "mo",
      description: "Unlock global job insights and unlimited applications.",
      features: ["30 applications per month", "Unlimited saved jobs", "Application tracking", "Salary insights"],
      nextBillingDate: nextBillingDate.toISOString(),
    },
    paymentMethod: {
      brand: "VISA",
      last4: "4242",
      holder: "ALEXANDER SEEKER",
      expires: "12/25",
    },
    history: needle
      ? history.filter((invoice) =>
          [invoice.plan, invoice.transactionId].some((field) =>
            field.toLowerCase().includes(needle)
          )
        )
      : history,
    applicationsUsed: applications.filter(application => !application.archived && new Date(application.appliedAt).getMonth() === now.getMonth() && new Date(application.appliedAt).getFullYear() === now.getFullYear()).length,
    applicationLimit: 30,
  }
}

/* ------------------------------------------------------------------ *
 * Profile (Settings)
 * ------------------------------------------------------------------ */

const DEMO_PROFILE: SeekerProfile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: null,
  headline: "Senior UX/UI Designer",
  bio: "Passionate designer with 5+ years of experience crafting user-centric digital experiences.",
  skills: ["Figma", "UI Design", "Prototyping"],
  resume: {
    fileName: "Jane_Doe_Resume_2023.pdf",
    updatedAt: at(-d(2)),
    sizeMb: 1.2,
  },
}

// Keyed by better-auth user id; "demo" while signed out.
const profiles = new Map<string, SeekerProfile>()

export function getProfile(
  userId: string,
  account?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
): SeekerProfile {
  const stored = profiles.get(userId)
  if (stored) return stored

  const profile: SeekerProfile = {
    ...DEMO_PROFILE,
    ...(account?.name ? { name: account.name } : null),
    ...(account?.email ? { email: account.email } : null),
    ...(account?.image !== undefined ? { avatarUrl: account.image } : null),
  }
  profiles.set(userId, profile)
  return profile
}

export function updateProfile(
  userId: string,
  patch: ProfilePatch
): SeekerProfile {
  const current = getProfile(userId)
  const next: SeekerProfile = {
    name: patch.name?.trim() || current.name,
    email: patch.email?.trim() || current.email,
    avatarUrl:
      "avatarUrl" in patch ? (patch.avatarUrl ?? null) : current.avatarUrl,
    headline: patch.headline?.trim() || current.headline,
    bio: patch.bio ?? current.bio,
    skills: patch.skills ?? current.skills,
    resume: patch.resume !== undefined ? patch.resume : current.resume,
  }
  profiles.set(userId, next)
  return next
}
