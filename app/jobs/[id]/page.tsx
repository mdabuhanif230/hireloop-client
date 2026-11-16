import { notFound } from "next/navigation"

import { CompanyOverview } from "@/components/company-overview/company-overview"
import { JobDescription } from "@/components/job-description/job-description"
import { JobHero } from "@/components/job-hero/job-hero"
import { JobHighlights } from "@/components/job-highlights/job-highlights"
import { allJobIds, getJob, getJob as findJob } from "@/lib/jobs/store"
import { JobCard } from "@/components/job-card/job-card"

/** /jobs/[id] — server-rendered from the same store the API exposes, so an
 *  unknown id gets a real 404 instead of a client-side "not found" flash. */

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const job = getJob(id)

  return {
    title: job ? `${job.title} at ${job.company} — HireLoop` : "Job — HireLoop",
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const job = getJob(id)

  if (!job) notFound()

  const suggestions = allJobIds().flatMap(jobId => { const item = findJob(jobId); return item && item.id !== id && item.category === job.category ? [item] : [] }).slice(0, 3)

  return (
    <div className="min-h-svh bg-[#010103] text-white">
      <main className="mx-auto w-full max-w-[1200px] px-4 pt-8 pb-20 sm:px-6">
        <JobHero job={job} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-6">
            <JobHighlights job={job} />
            <JobDescription job={job} />
          </div>

          <CompanyOverview company={job.companyProfile} />
        </div>
        {suggestions.length ? <section className="mt-12"><h2 className="font-manrope text-2xl font-semibold">Similar opportunities</h2><div className="mt-5 grid gap-4 lg:grid-cols-3">{suggestions.map(item => <JobCard key={item.id} job={item} />)}</div></section> : null}
      </main>
    </div>
  )
}
