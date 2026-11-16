"use client"

import { useMemo, useState } from "react"
import { AdminHeading, MetricCard, StatusPill, TableCell, TableFrame, TableHead } from "@/components/dashboard/admin/admin-ui"
import { CalendarDays, CreditCard, Users } from "lucide-react"

const rows = [
  ["jordan.daniels@enterprise.co", "Enterprise", "$4,500.00", "May 19, 2026", "TXN-882910443", "Success"],
  ["sarah.k@techflow.io", "Pro", "$299.00", "May 18, 2026", "TXN-773410291", "Success"],
  ["marcus.lee@gmail.com", "Starter", "$49.00", "May 17, 2026", "TXN-110294857", "Pending"],
  ["e.lopez@globalfoundries.com", "Enterprise", "$12,000.00", "May 10, 2026", "TXN-889435712", "Failed"],
]

export function PaymentManagement() {
  const [filter, setFilter] = useState("All")
  const visible = useMemo(() => rows.filter(row => filter === "All" || row[5] === filter), [filter])
  function exportCsv() {
    const csv = ["Email,Plan,Amount,Date,Transaction,Status", ...visible.map(row => row.join(","))].join("\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    link.download = "hireloop-transactions.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return <main className="flex-1 p-5 sm:p-8"><AdminHeading title="Payments & Subscriptions" description="Comprehensive overview of platform revenue and active subscriptions." action={<select value={filter} onChange={event => setFilter(event.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm"><option>All</option><option>Success</option><option>Pending</option><option>Failed</option></select>} />
    <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Revenue" value="$1,284,500" change="+12.4%" icon={<CreditCard className="size-4" />} /><MetricCard label="Monthly Revenue" value="$94,210" change="+8.1%" icon={<CalendarDays className="size-4" />} /><MetricCard label="Active Seeker Subscriptions" value="12,408" change="+2.3%" icon={<Users className="size-4" />} /><MetricCard label="Active Recruiter Subscriptions" value="842" change="+15.7%" icon={<Users className="size-4" />} /></section>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold">Recent Transactions</h2><button onClick={exportCsv} className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black">Export CSV</button></div>
    <TableFrame><TableHead><tr>{["USER EMAIL", "PLAN", "AMOUNT", "DATE", "TRANSACTION ID", "STATUS"].map(value => <th key={value} className="px-4 py-3">{value}</th>)}</tr></TableHead><tbody>{visible.map(row => <tr key={row[4]}>{row.slice(0, 5).map((cell, index) => <TableCell key={index} className={index === 0 || index === 4 ? "text-xs text-muted-foreground" : ""}>{index === 3 ? `${cell} · ${relativeDate(String(cell))}` : cell}</TableCell>)}<TableCell><StatusPill tone={row[5] === "Success" ? "green" : row[5] === "Pending" ? "yellow" : "red"}>{row[5]}</StatusPill></TableCell></tr>)}</tbody></TableFrame>
  </main>
}

function relativeDate(value: string) {
  const date = new Date(value)
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000))
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-days, "day")
}
