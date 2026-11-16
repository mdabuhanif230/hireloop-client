import type { NextRequest } from "next/server"

import { queryJobs } from "@/lib/jobs/store"

/** Public job board list behind /jobs.
 *
 *  GET  ?q=<search> &types=Full-time,Contract &sort=recent|salary|closing
 *       &page=<n>            → one page window plus counts for the sidebar */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const page = Number(params.get("page"))

  return Response.json(
    queryJobs({
      q: params.get("q") ?? "",
      types: params.get("types")?.split(",") ?? [],
      sort: params.get("sort") ?? "recent",
      page: Number.isFinite(page) ? page : 1,
    })
  )
}
