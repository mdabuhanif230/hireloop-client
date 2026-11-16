import { BriefcaseBusiness, FileText, MailCheck, Users } from "lucide-react"
import Link from "next/link"
import { MetricCard, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"

const applicants = [
  ["JM", "Julianne Moore", "Senior Product Designer", "Oct 24, 2026", "6 years", "Interviewing", "purple"],
  ["RD", "Robert Downey", "Backend Engineer", "Oct 23, 2026", "4 years", "New", "blue"],
  ["ES", "Emma Stone", "Marketing Lead", "Oct 22, 2026", "8 years", "Reviewing", "yellow"],
  ["CP", "Chris Pratt", "Product Manager", "Oct 21, 2026", "5 years", "Rejected", "red"],
]

export function RecruiterOverview() {
  return <main className="flex-1 p-5 sm:p-8"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Recruiter / Dashboard</p><h1 className="mt-1 text-xl font-semibold">Welcome back, Alex Sterling</h1></div><label className="hidden sm:block"><input placeholder="Search applications, jobs, or talent..." className="h-10 w-72 rounded-lg border border-border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground" /></label></div>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Job Posts" value="48" icon={<FileText className="size-4" />} /><MetricCard label="Total Applicants" value="1,284" icon={<Users className="size-4" />} /><MetricCard label="Active Jobs" value="18" icon={<BriefcaseBusiness className="size-4" />} /><MetricCard label="Jobs Closed" value="32" icon={<MailCheck className="size-4" />} /></section>
    <section className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">My Company</p><h2 className="mt-1 font-semibold">CloudScale AI</h2></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Approved</span></div><p className="mt-3 text-sm text-muted-foreground">Artificial Intelligence · San Francisco, CA</p><Link href="/deshboard/recruiter/company" className="mt-4 inline-block text-xs text-violet-300">Edit company profile →</Link></div><div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Applicants per job · last 30 days</h2><div className="mt-5 flex h-24 items-end gap-3">{[["Designer", 45], ["Engineer", 75], ["Marketing", 38], ["Research", 58], ["Product", 86]].map(([role, height]) => <div key={role} className="flex h-full min-w-0 flex-1 flex-col justify-end"><div className="rounded-t-md bg-violet-500" style={{ height: `${Number(height)}%` }} /><span className="mt-2 truncate text-[10px] text-muted-foreground">{role}</span></div>)}</div></div></section>
    <div className="mb-3 mt-7 flex items-center justify-between"><h2 className="text-base font-semibold">Recent Applications</h2><Link href="/deshboard/recruiter/applications" className="text-xs text-muted-foreground hover:text-white">View all</Link></div>
    <TableFrame><TableHead><tr>{["CANDIDATE NAME", "ROLE", "DATE APPLIED", "EXPERIENCE", "STATUS"].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></TableHead><tbody>{applicants.map(row => { const tone: "blue" | "yellow" | "red" | "green" = row[5] === "New" ? "blue" : row[5] === "Reviewing" ? "yellow" : row[5] === "Rejected" ? "red" : "green"; return <tr key={row[1]}><TableCell><span className="mr-3 inline-grid size-8 place-items-center rounded-full bg-violet-500/20 text-xs text-violet-200">{row[0]}</span>{row[1]}</TableCell>{row.slice(2, 5).map((cell, i) => <TableCell key={i} className="text-xs text-muted-foreground">{cell}</TableCell>)}<TableCell><StatusPill tone={tone}>{row[5]}</StatusPill></TableCell></tr> })}</tbody></TableFrame>
  </main>
}
