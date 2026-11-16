"use client"

import { useState, type FormEvent } from "react"
import { postJson } from "@/hooks/use-api"
import type { JobListItem } from "@/lib/jobs/types"
import { Check, X } from "lucide-react"

export function ApplicationDialog({ job, onClose }: { job: JobListItem; onClose: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [resume, setResume] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)

  function selectResume(file?: File) {
    if (!file) return
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF resume.")
      setResume("")
      return
    }
    setError("")
    setResume(file.name)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const storedPlan = window.localStorage.getItem("hireloop:seeker-plan")
      const plan = storedPlan ? JSON.parse(storedPlan) as string : "Pro"
      await postJson("/api/seeker/applications", { jobId: job.id, applicantName: name, applicantEmail: email, resumeName: resume, coverLetter, plan })
      setSent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Application could not be submitted.")
    } finally {
      setSaving(false)
    }
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-labelledby="apply-title" className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#141417] p-5 text-white shadow-2xl sm:p-7">{sent ? <div className="py-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Check /></span><h2 className="mt-4 text-xl font-semibold">Application submitted</h2><p className="mt-2 text-sm text-white/60">Your application for {job.title} at {job.company} is now in your applications list.</p><button onClick={onClose} className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black">Done</button></div> : <><div className="mb-5 flex items-start justify-between"><div><p className="text-xs text-violet-300">Apply to {job.company}</p><h2 id="apply-title" className="mt-1 text-xl font-semibold">{job.title}</h2></div><button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-white/60 hover:bg-white/5"><X className="size-4" /></button></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm">Full name<input required value={name} onChange={event => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 outline-none focus:border-violet-500" /></label><label className="block text-sm">Email address<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 outline-none focus:border-violet-500" /></label><label className="block text-sm">Resume (PDF)<input required type="file" accept="application/pdf,.pdf" onChange={event => selectResume(event.target.files?.[0])} className="mt-1.5 block w-full rounded-lg border border-white/10 bg-black/20 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" /><span className="mt-1 block text-xs text-white/40">{resume ? `Selected: ${resume}` : "Choose a PDF resume. The demo submission stores its file name."}</span></label><label className="block text-sm">Cover letter (optional)<textarea rows={4} value={coverLetter} onChange={event => setCoverLetter(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-violet-500" /></label>{error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}<div className="flex justify-end gap-2 border-t border-white/10 pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65">Cancel</button><button disabled={saving || !resume} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold disabled:opacity-50">{saving ? "Submitting…" : "Submit application"}</button></div></form></>}</section></div>
}
