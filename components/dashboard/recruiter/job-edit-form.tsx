"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useDemoStorage } from "@/hooks/use-demo-storage"
import type { RecruiterJob } from "@/lib/recruiter"

export function JobEditForm({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [jobs, setJobs, ready] = useDemoStorage<RecruiterJob[]>("hireloop:recruiter-jobs", [])
  const job = jobs.find(item => item.id === jobId)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!job) return
    const form = new FormData(event.currentTarget)
    setJobs(current => current.map(item => item.id === jobId ? { ...item, title: String(form.get("title")), description: String(form.get("description")), responsibilities: String(form.get("responsibilities")), requirements: String(form.get("requirements")) } : item))
    router.push("/deshboard/recruiter/jobs")
  }

  return <main className="mx-auto w-full max-w-3xl flex-1 p-5 sm:p-8"><h1 className="text-2xl font-semibold">Edit job post</h1>{!ready ? <div className="mt-6 h-48 animate-pulse rounded-xl border border-border bg-card" /> : !job ? <p className="mt-4 text-sm text-muted-foreground">Job post not found.</p> : <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6"><label className="block text-sm">Job title<input name="title" required defaultValue={job.title} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-black/20 px-3" /></label><label className="block text-sm">Overview<textarea name="description" required rows={4} defaultValue={job.description} className="mt-1.5 w-full rounded-lg border border-border bg-black/20 px-3 py-2" /></label><label className="block text-sm">Responsibilities<textarea name="responsibilities" required rows={5} defaultValue={job.responsibilities} className="mt-1.5 w-full rounded-lg border border-border bg-black/20 px-3 py-2" /></label><label className="block text-sm">Requirements<textarea name="requirements" required rows={5} defaultValue={job.requirements} className="mt-1.5 w-full rounded-lg border border-border bg-black/20 px-3 py-2" /></label><div className="flex justify-end gap-2 border-t border-border pt-4"><Link href="/deshboard/recruiter/jobs" className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</Link><button className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium">Save changes</button></div></form>}</main>
}
