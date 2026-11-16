"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RecruiterJob } from "@/lib/recruiter"
import { AdminHeading, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"

const LIMITS: Record<string, number> = { Free: 3, Growth: 10, Enterprise: 50 }

export function RecruiterJobManagement() {
  const [jobs, setJobs] = useDemoStorage<RecruiterJob[]>("hireloop:recruiter-jobs", [])
  const [plan] = useDemoStorage("hireloop:recruiter-plan", "Free")
  const [filter, setFilter] = useState("All")
  const active = jobs.filter(job => job.status === "Active").length
  const limit = LIMITS[plan] ?? 3
  const visible = useMemo(() => jobs.filter(job => filter === "All" || job.status === filter), [jobs, filter])
  function update(id: string, status: RecruiterJob["status"]) { setJobs(current => current.map(job => job.id === id ? { ...job, status } : job)) }
  function remove(id: string) { if (window.confirm("Delete this job post? This cannot be undone.")) setJobs(current => current.filter(job => job.id !== id)) }

  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Manage Jobs" description="Create listings and review applicants for your company." action={<Link href="/deshboard/recruiter/jobs/new" className={`rounded-lg px-4 py-2 text-sm font-semibold ${active >= limit ? "pointer-events-none bg-white/20 text-white/50" : "bg-white text-black"}`} aria-disabled={active >= limit}>＋ Post a Job</Link>} /><section className="mb-5 rounded-xl border border-border bg-card p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-muted-foreground">Plan usage · {plan}</p><p className="mt-1 font-semibold">{active} / {limit} active job posts</p></div><Link href="/deshboard/recruiter/billing" className="text-sm text-violet-300 hover:underline">Upgrade plan</Link></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, active / limit * 100)}%` }} /></div></section><div className="mb-4 flex gap-2">{["All", "Active", "Closed", "Draft"].map(value => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-xs ${filter === value ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5"}`}>{value}</button>)}</div><TableFrame><TableHead><tr>{["JOB TITLE", "STATUS", "APPLICANTS", "DATE POSTED", "ACTIONS"].map(value => <th key={value} className="px-4 py-3">{value}</th>)}</tr></TableHead><tbody>{visible.map(job => <tr key={job.id}><TableCell className="font-medium">{job.title}<span className="mt-1 block text-xs text-muted-foreground">{job.category} · {job.type}</span></TableCell><TableCell><StatusPill tone={job.status === "Active" ? "green" : job.status === "Draft" ? "yellow" : "gray"}>{job.status}</StatusPill></TableCell><TableCell>{job.applicants}</TableCell><TableCell className="text-xs text-muted-foreground">{new Date(job.postedAt).toLocaleDateString()}</TableCell><TableCell><div className="flex flex-wrap gap-3 text-xs"><Link href={`/deshboard/jobs/${job.id}/applicants`} className="text-violet-300 hover:underline">Applicants</Link><Link href={`/jobs/${job.id}`} className="text-white/60 hover:underline">View</Link><Link href={`/deshboard/recruiter/jobs/${job.id}/edit`} className="text-white/60 hover:underline">Edit</Link><button onClick={() => update(job.id, job.status === "Active" ? "Closed" : "Active")} className="text-amber-300">{job.status === "Active" ? "Close" : "Reopen"}</button><button onClick={() => remove(job.id)} className="text-red-300">Delete</button></div></TableCell></tr>)}</tbody></TableFrame>{visible.length === 0 ? <div className="py-14 text-center"><p className="text-sm text-muted-foreground">No job posts in this view yet.</p><Link href="/deshboard/recruiter/jobs/new" className="mt-3 inline-block text-sm text-violet-300">Post your first job</Link></div> : null}</main>
}
