import type { NextRequest } from "next/server"

import type { ApplicationTab } from "@/lib/seeker/types"
import { queryApplications } from "@/lib/seeker/store"

/** Applications table behind /deshboard/seeker/applications.
 *
 *  GET ?tab=active|archived &q=<search> &page=<n> */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const tab: ApplicationTab =
    params.get("tab") === "archived" ? "archived" : "active"
  const page = Number(params.get("page"))

  return Response.json(
    queryApplications({
      tab,
      q: params.get("q") ?? "",
      page: Number.isFinite(page) && page > 0 ? page : 1,
    })
  )
}
