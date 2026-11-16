import type {
  BenefitKey,
  JobDetail,
  JobFamily,
  JobListItem,
  JobSort,
  JobsResponse,
  JobType,
} from "./types"
import { JOB_TYPES } from "./types"

/** Seed store for the public job board.
 *
 *  This is the MongoDB seam: `queryJobs`/`getJob` are the only read paths the
 *  route handlers use, so swapping in a real collection means replacing these
 *  two functions and the seed below — the API contract (lib/jobs/types.ts)
 *  stays put. Counts, page windows and totals are all derived from the rows,
 *  never hard-coded. */

export const JOBS_PAGE_SIZE = 4

const DAY_MS = 86_400_000

function ago(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString()
}

function inDays(days: number) {
  return new Date(Date.now() + days * DAY_MS).toISOString()
}

/* ------------------------------------------------------------------ *
 * Copy families — one description/responsibilities set per family so
 * 16 seeded jobs don't repeat the same paragraphs 16 times.
 * ------------------------------------------------------------------ */

const DESCRIPTIONS: Record<JobFamily, (company: string) => string> = {
  design: (company) =>
    `${company} is looking for a designer who can hold both the forest and the trees: framing the problem with product, then carrying the answer all the way to shipped, accessible UI. You'll work in a tight loop with engineering, own flows end to end, and keep our design system honest as the product grows.`,
  engineering: (company) =>
    `${company} is hiring a hands-on engineer to build the services our customers depend on daily. You'll ship to production in your first week, own what you build end to end, and work directly with product and design to turn a roadmap into reliable, well-tested software.`,
  research: (company) =>
    `At ${company} you'll turn messy questions into evidence the whole team can act on. From recruiting and screening to synthesis and readouts, you'll run the studies that shape the roadmap — and you'll be in the room when those findings are debated, not sending them from the sidelines.`,
  data: (company) =>
    `${company} needs someone who can take a pile of data and make a decision obvious. You'll build and validate models against real production signals, partner with engineering on what is actually measurable, and explain your conclusions to people who don't share your vocabulary.`,
  marketing: (company) =>
    `${company} is growing and this role owns the loop between what we ship and who hears about it. You'll plan campaigns, write and test the messaging, and stay close to the numbers — attribution, retention and payback — so budget goes where it works.`,
}

const RESPONSIBILITIES: Record<JobFamily, string[]> = {
  design: [
    "Lead the design process for major product features, from discovery to high-fidelity delivery.",
    "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
    "Maintain and evolve our design system, ensuring consistency and accessibility across the product.",
    "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
  ],
  engineering: [
    "Design, build and ship production features across the stack with your team.",
    "Own the reliability of your services: monitoring, on-call rotation and incident follow-up.",
    "Review code and design docs, and raise the bar for how the team writes software.",
    "Work with product to scope work into small, shippable slices instead of one big release.",
  ],
  research: [
    "Plan and run qualitative and quantitative studies across the product lifecycle.",
    "Recruit, screen and schedule participants; manage consent and research ops.",
    "Synthesise findings into clear narratives and share them with product and design.",
    "Pair with data teams to keep our behavioural signals trustworthy.",
  ],
  data: [
    "Build, train and evaluate models against production data sets.",
    "Ship reproducible pipelines and keep the metric definitions honest.",
    "Partner with engineering to move models from notebook to production.",
    "Communicate trade-offs and results to technical and non-technical stakeholders.",
  ],
  marketing: [
    "Plan and run campaigns across paid, lifecycle and partner channels.",
    "Own messaging and landing pages; test them against real conversion data.",
    "Report on CAC, activation and payback every week with a point of view.",
    "Work with design and content to keep the brand consistent in every channel.",
  ],
}

const REQUIREMENT_TAGS: Record<JobFamily, string[]> = {
  design: ["Figma Expertise", "Design Systems", "User Research", "Prototyping"],
  engineering: ["TypeScript", "System Design", "Testing", "CI/CD"],
  research: [
    "Qualitative Research",
    "Survey Design",
    "Usability Testing",
    "Synthesis",
  ],
  data: ["Python", "SQL", "Model Evaluation", "Experimentation"],
  marketing: [
    "Paid Acquisition",
    "Lifecycle Email",
    "Analytics",
    "Copywriting",
  ],
}

const REQUIREMENTS: Record<JobFamily, string[]> = {
  design: [
    "3+ years of experience designing complex B2B SaaS products or data-heavy applications.",
    "A strong portfolio showcasing design process and problem-solving skills.",
  ],
  engineering: [
    "3+ years building production services in a modern typed language.",
    "Experience debugging systems you did not write, under real traffic.",
  ],
  research: [
    "2+ years planning and running studies that changed a roadmap.",
    "Comfort with both moderated interviews and quantitative survey data.",
  ],
  data: [
    "3+ years working with real, messy production data — not just benchmarks.",
    "A track record of shipping models that survived contact with users.",
  ],
  marketing: [
    "3+ years owning a channel budget end to end, with numbers to show for it.",
    "Fluency in experimentation: hypotheses, holdouts and honest read-outs.",
  ],
}

const BENEFITS: BenefitKey[] = ["health", "retirement", "hardware", "pto"]

/* ------------------------------------------------------------------ *
 * Seed rows
 * ------------------------------------------------------------------ */

type JobSeed = {
  id: string
  title: string
  company: string
  logo?: string
  location: string
  salary: string
  type: JobType
  mode: string
  family: JobFamily
  badges?: JobListItem["badges"]
  postedDaysAgo: number
  closesInDays?: number
  verified?: boolean
  experience: string
  size: string
  industry: string
  website: string
  /** Overrides for the featured row (the one in the detail design). */
  description?: string
  responsibilities?: string[]
  requirementTags?: string[]
  requirements?: string[]
}

const JOB_SEEDS: JobSeed[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    company: "CloudScale AI",
    location: "San Francisco, CA (Remote)",
    salary: "$140k – $180k",
    type: "Full-time",
    mode: "Remote",
    family: "design",
    badges: ["Easy Apply"],
    postedDaysAgo: 2,
    verified: true,
    experience: "5+ Years",
    size: "250 - 500 Employees",
    industry: "SaaS / Artificial Intelligence",
    website: "https://cloudscale.ai",
    description:
      "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical concepts into intuitive, elegant user experiences. You will own the design of our core platform, working closely with engineering and product leadership to define the vision for our core platform experience.",
    responsibilities: [
      "Lead the design process for major product features, from discovery to high-fidelity delivery.",
      "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
      "Maintain and evolve our design system, ensuring consistency and accessibility across the product.",
      "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
    ],
    requirementTags: [
      "Figma Expertise",
      "System Thinking",
      "UI/UX Design",
      "Basic Frontend",
    ],
    requirements: [
      "3+ years of experience designing complex B2B SaaS products or data-heavy applications.",
      "A strong portfolio showcasing design process and problem-solving skills.",
    ],
  },
  {
    id: "job-2",
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    location: "New York, NY",
    salary: "$155k – $210k",
    type: "Full-time",
    mode: "Hybrid",
    family: "engineering",
    postedDaysAgo: 1,
    closesInDays: 12,
    experience: "6+ Years",
    size: "51 - 200 Employees",
    industry: "Fintech / Energy Markets",
    website: "https://fingrid.solutions",
  },
  {
    id: "job-3",
    title: "UX Researcher",
    company: "CreativeStudio Inc",
    location: "Austin, TX",
    salary: "$110k – $145k",
    type: "Contract",
    mode: "On-site",
    family: "research",
    postedDaysAgo: 4,
    experience: "3+ Years",
    size: "11 - 50 Employees",
    industry: "Design Agency",
    website: "https://creativestudio.co",
  },
  {
    id: "job-4",
    title: "Machine Learning Engineer",
    company: "HealthAI Corp",
    location: "Boston, MA (Remote)",
    salary: "$180k – $250k",
    type: "Full-time",
    mode: "Remote",
    family: "data",
    badges: ["Senior", "Hot Job"],
    postedDaysAgo: 3,
    verified: true,
    experience: "5+ Years",
    size: "201 - 500 Employees",
    industry: "Healthcare / Artificial Intelligence",
    website: "https://healthai.corp",
  },
  {
    id: "job-5",
    title: "Senior Backend Engineer",
    company: "Amazon",
    logo: "/logos/amazon.png",
    location: "Seattle, WA (Hybrid)",
    salary: "$170k – $230k",
    type: "Full-time",
    mode: "Hybrid",
    family: "engineering",
    postedDaysAgo: 5,
    closesInDays: 9,
    experience: "5+ Years",
    size: "10,000+ Employees",
    industry: "E-commerce / Cloud Computing",
    website: "https://amazon.com",
  },
  {
    id: "job-6",
    title: "Product Marketing Manager",
    company: "Spotify",
    logo: "/logos/spotify.png",
    location: "Stockholm (Remote)",
    salary: "$120k – $160k",
    type: "Full-time",
    mode: "Remote",
    family: "marketing",
    badges: ["Easy Apply"],
    postedDaysAgo: 6,
    experience: "4+ Years",
    size: "5,001 - 10,000 Employees",
    industry: "Music Streaming",
    website: "https://spotify.com",
  },
  {
    id: "job-7",
    title: "Frontend Developer (React)",
    company: "Uber",
    logo: "/logos/uber.png",
    location: "Remote, Global",
    salary: "$90k – $130k",
    type: "Contract",
    mode: "Remote",
    family: "engineering",
    postedDaysAgo: 7,
    experience: "3+ Years",
    size: "10,000+ Employees",
    industry: "Mobility / Logistics",
    website: "https://uber.com",
  },
  {
    id: "job-8",
    title: "Data Analyst",
    company: "Meta",
    logo: "/logos/meta.png",
    location: "Menlo Park, CA",
    salary: "$105k – $140k",
    type: "Full-time",
    mode: "On-site",
    family: "data",
    postedDaysAgo: 9,
    closesInDays: 5,
    experience: "2+ Years",
    size: "10,000+ Employees",
    industry: "Social Media / Technology",
    website: "https://meta.com",
  },
  {
    id: "job-9",
    title: "Motion Designer",
    company: "Netflix",
    logo: "/logos/netflix.png",
    location: "Los Angeles, CA (Remote)",
    salary: "$95k – $125k",
    type: "Freelance",
    mode: "Remote",
    family: "design",
    postedDaysAgo: 11,
    experience: "3+ Years",
    size: "5,001 - 10,000 Employees",
    industry: "Entertainment / Streaming",
    website: "https://netflix.com",
  },
  {
    id: "job-10",
    title: "DevOps Engineer",
    company: "Microsoft",
    logo: "/logos/microsoft.png",
    location: "Redmond, WA",
    salary: "$160k – $215k",
    type: "Full-time",
    mode: "Hybrid",
    family: "engineering",
    postedDaysAgo: 13,
    experience: "4+ Years",
    size: "10,000+ Employees",
    industry: "Software / Cloud",
    website: "https://microsoft.com",
  },
  {
    id: "job-11",
    title: "UX Writer",
    company: "Airbnb",
    logo: "/logos/airbnb.png",
    location: "Remote (US)",
    salary: "$85k – $115k",
    type: "Freelance",
    mode: "Remote",
    family: "design",
    badges: ["Easy Apply"],
    postedDaysAgo: 15,
    experience: "2+ Years",
    size: "5,001 - 10,000 Employees",
    industry: "Travel / Marketplace",
    website: "https://airbnb.com",
  },
  {
    id: "job-12",
    title: "Cloud Architect",
    company: "NVIDIA",
    logo: "/logos/nvidia.png",
    location: "Santa Clara, CA",
    salary: "$185k – $245k",
    type: "Full-time",
    mode: "On-site",
    family: "engineering",
    badges: ["Senior", "Hot Job"],
    postedDaysAgo: 18,
    verified: true,
    experience: "7+ Years",
    size: "5,001 - 10,000 Employees",
    industry: "Semiconductors / AI",
    website: "https://nvidia.com",
  },
  {
    id: "job-13",
    title: "Growth Marketing Lead",
    company: "Adobe",
    logo: "/logos/adobe.png",
    location: "San Jose, CA (Remote)",
    salary: "$130k – $175k",
    type: "Full-time",
    mode: "Remote",
    family: "marketing",
    postedDaysAgo: 21,
    closesInDays: 6,
    experience: "5+ Years",
    size: "5,001 - 10,000 Employees",
    industry: "Software / Creative Tools",
    website: "https://adobe.com",
  },
  {
    id: "job-14",
    title: "QA Engineer",
    company: "Apple",
    logo: "/logos/apple.png",
    location: "Cupertino, CA",
    salary: "$110k – $150k",
    type: "Contract",
    mode: "Hybrid",
    family: "engineering",
    postedDaysAgo: 24,
    experience: "3+ Years",
    size: "10,000+ Employees",
    industry: "Consumer Electronics",
    website: "https://apple.com",
  },
  {
    id: "job-15",
    title: "Junior Graphic Designer",
    company: "Tesla",
    logo: "/logos/tesla.png",
    location: "Austin, TX",
    salary: "$60k – $85k",
    type: "Freelance",
    mode: "On-site",
    family: "design",
    postedDaysAgo: 27,
    experience: "1+ Years",
    size: "10,000+ Employees",
    industry: "Automotive / Energy",
    website: "https://tesla.com",
  },
  {
    id: "job-16",
    title: "Research Scientist",
    company: "Google",
    logo: "/logos/google.png",
    location: "Mountain View, CA",
    salary: "$190k – $260k",
    type: "Contract",
    mode: "Hybrid",
    family: "data",
    badges: ["Senior"],
    postedDaysAgo: 30,
    verified: true,
    experience: "5+ Years",
    size: "10,000+ Employees",
    industry: "Internet / Cloud",
    website: "https://google.com",
  },
]

const jobs: JobDetail[] = JOB_SEEDS.map((seed) => {
  const copy = DESCRIPTIONS[seed.family](seed.company)
  return {
    id: seed.id,
    title: seed.title,
    company: seed.company,
    companyLogo: seed.logo ?? null,
    location: seed.location,
    salary: seed.salary,
    type: seed.type,
    mode: seed.mode,
    badges: seed.badges ?? [],
    postedAt: ago(seed.postedDaysAgo),
    verified: seed.verified ?? false,
    experience: seed.experience,
    closesAt:
      seed.closesInDays === undefined ? null : inDays(seed.closesInDays),
    description: seed.description ?? copy,
    responsibilities: seed.responsibilities ?? RESPONSIBILITIES[seed.family],
    requirementTags: seed.requirementTags ?? REQUIREMENT_TAGS[seed.family],
    requirements: seed.requirements ?? REQUIREMENTS[seed.family],
    benefits: BENEFITS,
    companyProfile: {
      name: seed.company,
      logo: seed.logo ?? null,
      size: seed.size,
      industry: seed.industry,
      website: seed.website,
    },
  }
})

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */

/** Top of the range: "$140k – $180k" → 180000, "$70 – $95/hour" → 95. */
function salaryTop(salary: string) {
  const numbers = salary.match(/\d+(\.\d+)?/g)
  if (!numbers?.length) return 0
  const top = Math.max(...numbers.map(Number))
  return /k\b/i.test(salary) ? top * 1000 : top
}

function isType(value: string): value is JobType {
  return (JOB_TYPES as readonly string[]).includes(value)
}

export function queryJobs(options: {
  q?: string
  types?: string[]
  sort?: string
  page?: number
}): JobsResponse {
  const q = (options.q ?? "").trim().toLowerCase()
  const types = (options.types ?? []).filter(isType)
  const sort: JobSort =
    options.sort === "salary" || options.sort === "closing"
      ? options.sort
      : "recent"
  const page = Math.max(1, options.page ?? 1)

  const matching = jobs.filter((job) => {
    const inTypes = types.length === 0 || types.includes(job.type)
    const matchesQuery =
      !q ||
      [job.title, job.company, job.location, job.salary].some((field) =>
        field.toLowerCase().includes(q)
      )
    return inTypes && matchesQuery
  })

  const sorted = [...matching].sort((a, b) => {
    if (sort === "salary") return salaryTop(b.salary) - salaryTop(a.salary)
    if (sort === "closing") {
      // Listings without a deadline sort last.
      const aTime = a.closesAt ? new Date(a.closesAt).getTime() : Infinity
      const bTime = b.closesAt ? new Date(b.closesAt).getTime() : Infinity
      return aTime - bTime
    }
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  })

  const start = (page - 1) * JOBS_PAGE_SIZE

  const typeCounts = Object.fromEntries(
    JOB_TYPES.map((type) => [
      type,
      jobs.filter((job) => job.type === type).length,
    ])
  ) as Record<JobType, number>

  return {
    items: sorted.slice(start, start + JOBS_PAGE_SIZE),
    page,
    pageSize: JOBS_PAGE_SIZE,
    total: sorted.length,
    totalAll: jobs.length,
    typeCounts,
    sort,
    q: options.q ?? "",
    types,
  }
}

export function getJob(id: string): JobDetail | null {
  return jobs.find((job) => job.id === id) ?? null
}

export function allJobIds() {
  return jobs.map((job) => job.id)
}
