"use client"

import { useMemo, useState } from "react"
import { AdminHeading, MetricCard, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"
import { Search, Users } from "lucide-react"

const initialUsers = [
  { name: "Jordan Davis", email: "jordan.davis@example.com", role: "Seeker", joined: "Oct 12, 2026", status: "Active" },
  { name: "Elena Rodriguez", email: "elena.r@talentflow.io", role: "Recruiter", joined: "Sep 28, 2026", status: "Active" },
  { name: "Marcus Webb", email: "m.webb@outlook.com", role: "Seeker", joined: "Aug 05, 2026", status: "Suspended" },
  { name: "Tom Hiddleston", email: "t.hiddles@loki-tech.com", role: "Recruiter", joined: "Nov 01, 2026", status: "Active" },
]

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState("")
  const [role, setRole] = useState("All Roles")
  const filtered = useMemo(() => users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()) && (role === "All Roles" || user.role === role)), [users, query, role])
  function changeStatus(email: string) { setUsers(current => current.map(user => user.email === email ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user)) }
  function changeRole(email: string) {
    const user = users.find(item => item.email === email)
    if (!user || !window.confirm(`Change ${user.name}'s role to ${user.role === "Seeker" ? "Recruiter" : "Seeker"}?`)) return
    setUsers(current => current.map(item => item.email === email ? { ...item, role: item.role === "Seeker" ? "Recruiter" : "Seeker" } : item))
  }
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="User Management" description="Review, filter, and manage platform access for all users." action={<div className="flex gap-2"><select value={role} onChange={e => setRole(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-xs"><option>All Roles</option><option>Seeker</option><option>Recruiter</option></select><button onClick={() => { const csv = ["Name,Email,Role,Joined,Status", ...filtered.map(u => `${u.name},${u.email},${u.role},${u.joined},${u.status}`)].join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "hireloop-users.csv"; link.click(); URL.revokeObjectURL(link.href) }} className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black">Export List</button></div>} />
    <label className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-border bg-card px-3"><Search className="size-4 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or email..." className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
    <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Active Users" value="12,842" change="+12% vs last month" icon={<Users className="size-4" />} /><MetricCard label="Recruiter Growth" value="843" change="High demand" icon={<Users className="size-4" />} /><MetricCard label="Suspended Accounts" value="124" icon={<Users className="size-4" />} /><MetricCard label="New Signups (24h)" value="42" change="Steady activity" icon={<Users className="size-4" />} /></section>
    <TableFrame><TableHead><tr>{["USER NAME", "EMAIL ADDRESS", "ROLE", "JOIN DATE", "STATUS", "ACTIONS"].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></TableHead><tbody>{filtered.map(user => <tr key={user.email}><TableCell className="font-medium">{user.name}</TableCell><TableCell className="text-xs text-muted-foreground">{user.email}</TableCell><TableCell><StatusPill tone={user.role === "Recruiter" ? "blue" : "gray"}>{user.role}</StatusPill></TableCell><TableCell className="text-xs text-muted-foreground">{user.joined}</TableCell><TableCell><StatusPill tone={user.status === "Active" ? "green" : "red"}>{user.status}</StatusPill></TableCell><TableCell><div className="flex gap-3"><button onClick={() => changeRole(user.email)} className="text-xs text-violet-300 hover:underline">Make {user.role === "Seeker" ? "Recruiter" : "Seeker"}</button><button onClick={() => changeStatus(user.email)} className={`text-xs hover:underline ${user.status === "Active" ? "text-red-400" : "text-emerald-400"}`}>{user.status === "Active" ? "Suspend" : "Activate"}</button></div></TableCell></tr>)}</tbody></TableFrame>
  </main>
}
