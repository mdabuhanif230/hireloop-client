import { getApplicationsForJob, updateApplicationStatus } from "@/lib/seeker/store"
import type { ApplicationStatus } from "@/lib/seeker/types"

const STATUSES: ApplicationStatus[] = ["applied", "under_review", "shortlisted", "rejected", "offered"]

export async function GET(_request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  return Response.json({ items: getApplicationsForJob(jobId) })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  let body: { applicationId?: string; status?: ApplicationStatus }
  try { body = await request.json() } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }) }
  if (!body.applicationId || !body.status || !STATUSES.includes(body.status)) return Response.json({ error: "Choose a valid application status." }, { status: 400 })
  const application = getApplicationsForJob(jobId).find(item => item.id === body.applicationId)
  if (!application) return Response.json({ error: "Application not found" }, { status: 404 })
  const updated = updateApplicationStatus(application.id, body.status)
  return Response.json({ application: updated })
}
