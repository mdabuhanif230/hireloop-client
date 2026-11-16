"use client"

import { useMemo, useState } from "react"
import { AdminHeading, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RegisteredCompany } from "@/lib/companies"

export function CompanyApprovals() {
  const [companies, setCompanies] = useDemoStorage<RegisteredCompany[]>("hireloop:companies", [])
  const [filter, setFilter] = useState("All")
  const visible = useMemo(() => companies.filter(company => filter === "All" || company.status === filter), [companies, filter])
  function setStatus(slug: string, status: RegisteredCompany["status"]) { setCompanies(current => current.map(company => company.slug === slug ? { ...company, status } : company)) }
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Manage Companies" description="Review recruiter company registrations and public listing status." action={<select value={filter} onChange={event => setFilter(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm"><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>} /><TableFrame><TableHead><tr>{["COMPANY NAME", "RECRUITER EMAIL", "INDUSTRY", "STATUS", "DATE SUBMITTED", "ACTIONS"].map(value => <th key={value} className="px-4 py-3">{value}</th>)}</tr></TableHead><tbody>{visible.map(company => <tr key={company.slug}><TableCell className="font-medium">{company.name}</TableCell><TableCell className="text-xs text-muted-foreground">{company.recruiterEmail}</TableCell><TableCell>{company.industry}</TableCell><TableCell><StatusPill tone={company.status === "Approved" ? "green" : company.status === "Rejected" ? "red" : "yellow"}>{company.status}</StatusPill></TableCell><TableCell className="text-xs text-muted-foreground">{new Date(company.submittedAt).toLocaleDateString()}</TableCell><TableCell><div className="flex gap-2">{company.status !== "Approved" ? <button onClick={() => setStatus(company.slug, "Approved")} className="text-xs text-emerald-400 hover:underline">Approve</button> : null}{company.status !== "Rejected" ? <button onClick={() => setStatus(company.slug, "Rejected")} className="text-xs text-red-400 hover:underline">Reject</button> : null}</div></TableCell></tr>)}</tbody></TableFrame>{visible.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No company registrations yet. Recruiter submissions will appear here.</p> : null}</main>
}
