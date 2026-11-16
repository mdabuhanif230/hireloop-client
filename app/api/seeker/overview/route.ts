import { getOverview } from "@/lib/seeker/store"

/** Stats row + recent-activity feed for /deshboard/seeker.
 *
 *  Not gated on a session yet — see the note in lib/seeker/store.ts. When the
 *  Mongo collections land, scope `getOverview()` by the better-auth user and
 *  return 401 here instead of serving the seed data. */
export async function GET() {
  return Response.json(getOverview())
}
