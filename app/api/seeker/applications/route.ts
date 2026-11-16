import type { NextRequest } from "next/server"

import type { ApplicationTab } from "@/lib/seeker/types"
import { queryApplications } from "@/lib/seeker/store"
import { submitApplication, getSubmittedApplicationCountThisMonth } from "@/lib/seeker/store"
import { getJob } from "@/lib/jobs/store"

/** Applications table behind /deshboard/seeker/applications.
 *
 *  GET ?tab=active|archived &q=<search> &page=<n> */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const tab: ApplicationTab =
    params.get("tab") === "archived" ? "archived" : "active"
  const page = Number(params.get("page"))

  return Response.json(
    queryApplications({
      tab,
      q: params.get("q") ?? "",
      page: Number.isFinite(page) && page > 0 ? page : 1,
    })
  )
}

export async function POST(request: NextRequest) {
  let body: { jobId?: string; applicantName?: string; applicantEmail?: string; resumeName?: string; coverLetter?: string; plan?: string }
  try { body = await request.json() } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const jobId = body.jobId?.trim()
  const applicantName = body.applicantName?.trim()
  const applicantEmail = body.applicantEmail?.trim()
  const resumeName = body.resumeName?.trim()
  if (!jobId || !applicantName || !applicantEmail || !resumeName) return Response.json({ error: "Name, email, resume, and job are required." }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail)) return Response.json({ error: "Enter a valid email address." }, { status: 400 })
  const limit = body.plan === "Free" ? 3 : body.plan === "Premium" ? null : 30
  if (limit !== null && getSubmittedApplicationCountThisMonth() >= limit) return Response.json({ error: `Your ${body.plan === "Free" ? "Free" : "Pro"} plan application limit has been reached.` }, { status: 403 })
  const job = getJob(jobId)
  if (!job) return Response.json({ error: "This job is no longer available." }, { status: 404 })
  const result = submitApplication({ jobId, title: job.title, company: job.company, companyLogo: job.companyLogo, type: job.type, mode: job.mode, applicantName, applicantEmail, resumeName, coverLetter: body.coverLetter?.trim() ?? "" })
  if (result.duplicate) return Response.json({ error: "You have already applied for this job." }, { status: 409 })
  return Response.json({ application: result.application }, { status: 201 })
}
