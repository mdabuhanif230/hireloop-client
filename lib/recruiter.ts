export type RecruiterJobStatus = "Active" | "Closed" | "Draft"
export type RecruiterJob = {
  id: string
  title: string
  category: string
  type: string
  salary: string
  currency: string
  location: string
  mode: string
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
  description: string
  company: string
  status: RecruiterJobStatus
  applicants: number
  postedAt: string
}
