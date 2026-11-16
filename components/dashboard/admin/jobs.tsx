"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { BriefcaseBusiness, Search, Trash2 } from "lucide-react"
import { AdminHeading, MetricCard, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"

const initialJobs = [
  { id: "job-1", title: "Senior Product Designer", company: "Nexus Lab", category: "Design", type: "Full-time", posted: "Oct 24, 2026", status: "Active" },
  { id: "job-2", title: "Full-stack Engineer", company: "Quantum", category: "Engineering", type: "Contract", posted: "Oct 22, 2026", status: "Active" },
  { id: "job-3", title: "Marketing Director", company: "Vanguard", category: "Marketing", type: "Full-time", posted: "Oct 15, 2026", status: "Closed" },
  { id: "job-4", title: "Backend Architect", company: "CloudScale", category: "Engineering", type: "Remote", posted: "Oct 20, 2026", status: "Active" },
  { id: "job-5", title: "UX Research Lead", company: "Humanize", category: "Design", type: "Hybrid", posted: "Oct 19, 2026", status: "Active" },
]

export function JobManagement() {
  const [jobs, setJobs] = useState(initialJobs)
  const [status, setStatus] = useState("All Statuses")
  const [category, setCategory] = useState("All Categories")
  const [tab, setTab] = useState("Active")
  const [query, setQuery] = useState("")
  const shown = useMemo(() => jobs.filter(job => (status === "All Statuses" || job.status === status) && (category === "All Categories" || job.category === category) && (tab === "All" || job.status === tab) && `${job.title} ${job.company}`.toLowerCase().includes(query.toLowerCase())), [jobs, status, category, tab, query])
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Manage Jobs" description="Oversee all active listings and historical job posts across the platform." action={<Link href="/deshboard/recruiter/jobs/new" className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black">＋ Create Job</Link>} />
    <label className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-border bg-card px-3"><Search className="size-4 text-muted-foreground" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by title or company..." className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
    <div className="mb-4 flex flex-wrap items-end gap-3"><label className="grid gap-1 text-xs text-muted-foreground">Status<select value={status} onChange={event => setStatus(event.target.value)} className="h-10 min-w-36 rounded-lg border border-border bg-card px-3 text-foreground"><option>All Statuses</option><option>Active</option><option>Closed</option></select></label><label className="grid gap-1 text-xs text-muted-foreground">Category<select value={category} onChange={event => setCategory(event.target.value)} className="h-10 min-w-36 rounded-lg border border-border bg-card px-3 text-foreground"><option>All Categories</option><option>Design</option><option>Engineering</option><option>Marketing</option></select></label><div className="flex rounded-lg border border-border p-1">{["Active", "Closed", "All"].map(item => <button key={item} onClick={() => setTab(item)} className={`rounded-md px-3 py-2 text-xs ${tab === item ? "bg-white/[0.1] text-white" : "text-muted-foreground"}`}>{item}</button>)}</div></div>
    <TableFrame><TableHead><tr>{["TITLE", "COMPANY", "CATEGORY", "TYPE", "DATE POSTED", "STATUS", "ACTIONS"].map(value => <th key={value} className="px-4 py-3">{value}</th>)}</tr></TableHead><tbody>{shown.map(job => <tr key={job.id}><TableCell className="font-medium">{job.title}<span className="mt-1 block text-[10px] text-muted-foreground">Ref: HL-{job.id.slice(-1)}90210</span></TableCell><TableCell>{job.company}</TableCell><TableCell><StatusPill tone="gray">{job.category}</StatusPill></TableCell><TableCell className="text-xs text-muted-foreground">{job.type}</TableCell><TableCell className="text-xs text-muted-foreground">{job.posted}</TableCell><TableCell><StatusPill tone={job.status === "Active" ? "green" : "gray"}>{job.status}</StatusPill></TableCell><TableCell><div className="flex gap-3"><Link aria-label={`View ${job.title}`} href={`/jobs/${job.id}`} className="text-muted-foreground hover:text-white">View</Link><button aria-label={`Remove ${job.title}`} onClick={() => { if (window.confirm(`Remove ${job.title}?`)) setJobs(current => current.filter(item => item.id !== job.id)) }} className="text-muted-foreground hover:text-red-400"><Trash2 className="size-4" /></button></div></TableCell></tr>)}</tbody></TableFrame>
    <section className="mt-5 grid gap-3 md:grid-cols-3"><MetricCard label="Engagement Rate" value="82.4%" change="+5.2% from last month" icon={<BriefcaseBusiness className="size-4" />} /><MetricCard label="Avg. Time to Fill" value="14 Days" icon={<BriefcaseBusiness className="size-4" />} /><MetricCard label="Total Applications" value="12,840" icon={<BriefcaseBusiness className="size-4" />} /></section>
  </main>
}
