"use client"

import { useState } from "react"
import { AdminHeading, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"
import { patchJson, useApi } from "@/hooks/use-api"
import type { Application, ApplicationStatus } from "@/lib/seeker/types"

const statuses: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "offered", label: "Offered" },
]

export function RecruiterApplicants({ jobId }: { jobId: string }) {
  const { data, loading, error, refetch } = useApi<{ items: Application[] }>(`/api/recruiter/jobs/${encodeURIComponent(jobId)}/applicants`)
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState<string | null>(null)

  async function changeStatus(applicationId: string, status: ApplicationStatus) {
    setBusy(applicationId)
    setNotice("")
    try {
      await patchJson(`/api/recruiter/jobs/${encodeURIComponent(jobId)}/applicants`, { applicationId, status })
      setNotice(`Application status updated to ${statuses.find(item => item.value === status)?.label}. Email notification is simulated in this client demo.`)
      refetch()
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Could not update this application.")
    } finally { setBusy(null) }
  }

  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Job Applicants" description={`Review candidates and update application status · ${jobId}`} />{notice ? <p role="status" className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">{notice}</p> : null}{error ? <p role="alert" className="mb-4 text-sm text-red-400">{error}</p> : null}{loading && !data ? <div className="h-48 animate-pulse rounded-xl border border-border bg-card" /> : data?.items.length ? <TableFrame><TableHead><tr>{["APPLICANT", "EMAIL", "DATE APPLIED", "RESUME", "STATUS"].map(value => <th key={value} className="px-4 py-3">{value}</th>)}</tr></TableHead><tbody>{data.items.map(application => <tr key={application.id}><TableCell className="font-medium">{application.applicantName ?? application.title}</TableCell><TableCell className="text-xs text-muted-foreground">{application.applicantEmail ?? "—"}</TableCell><TableCell className="text-xs text-muted-foreground">{new Date(application.appliedAt).toLocaleDateString()}</TableCell><TableCell>{application.resumeName ? <span className="text-xs text-violet-300">{application.resumeName}</span> : "—"}</TableCell><TableCell><select disabled={busy === application.id} value={application.status} onChange={event => void changeStatus(application.id, event.target.value as ApplicationStatus)} className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs">{statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}</select></TableCell></tr>)}</tbody></TableFrame> : <div className="rounded-xl border border-border bg-card px-5 py-14 text-center"><p className="font-medium">No applicants yet</p><p className="mt-1 text-sm text-muted-foreground">New applications for this job will show here.</p></div>}</main>
}
