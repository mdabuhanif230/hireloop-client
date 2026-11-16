import type { NextRequest } from "next/server"

import type { SavedSort } from "@/lib/seeker/types"
import { SAVED_PAGE_SIZE } from "@/lib/seeker/types"
import { querySavedJobs, removeSavedJob } from "@/lib/seeker/store"

/** Bookmarked jobs behind /deshboard/seeker/saved.
 *
 *  GET    ?category=all|design|engineering|product &sort=recent|closing|salary
 *         &q=<search> &limit=<rows>   → one window plus the header stats/counts
 *  DELETE ?id=saved-3                 → un-bookmark */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const sortParam = params.get("sort")
  const sort: SavedSort =
    sortParam === "closing" || sortParam === "salary" ? sortParam : "recent"
  const limit = Number(params.get("limit"))

  return Response.json(
    querySavedJobs({
      category: params.get("category") ?? "all",
      sort,
      q: params.get("q") ?? "",
      limit:
        Number.isFinite(limit) && limit > 0
          ? Math.min(limit, SAVED_PAGE_SIZE * 4)
          : undefined,
    })
  )
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 })
  }

  if (!removeSavedJob(id)) {
    return Response.json({ error: "Saved job not found" }, { status: 404 })
  }

  return Response.json({ removed: true })
}
