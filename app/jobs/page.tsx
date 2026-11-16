import { BrowseJobsPage } from "@/components/jobs/browse-jobs"

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string; query?: string; location?: string }> }) {
  const params = await searchParams
  return <BrowseJobsPage initialQuery={params.q ?? params.query ?? ""} initialLocation={params.location ?? ""} />
}
