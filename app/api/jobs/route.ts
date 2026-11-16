import type { NextRequest } from "next/server"

import { createJob, queryJobs } from "@/lib/jobs/store"

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
      category: params.get("category") ?? "all",
      location: params.get("location") ?? "",
      minSalary: Number(params.get("minSalary") ?? 0),
      sort: params.get("sort") ?? "recent",
      page: Number.isFinite(page) ? page : 1,
    })
  )
}

export async function POST(request: NextRequest) {
  let body: { title?: string; company?: string; companyLogo?: string; category?: string; type?: string; mode?: string; location?: string; currency?: string; minSalary?: number; maxSalary?: number; experience?: string; deadline?: string; description?: string; responsibilities?: string; requirements?: string; benefits?: string; website?: string; size?: string; industry?: string }
  try { body = await request.json() } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }) }
  if (!body.title?.trim() || !body.company?.trim() || !body.description?.trim() || !body.responsibilities?.trim() || !body.requirements?.trim()) return Response.json({ error: "Complete all required job fields." }, { status: 400 })
  const categories = ["design", "engineering", "research", "data", "marketing"] as const
  const category = categories.includes(body.category as typeof categories[number]) ? body.category as typeof categories[number] : "engineering"
  const validTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship", "Freelance"]
  const type = validTypes.includes(body.type ?? "") ? body.type as "Full-time" | "Part-time" | "Remote" | "Contract" | "Internship" | "Freelance" : "Full-time"
  const job = createJob({ title: body.title.trim(), company: body.company.trim(), companyLogo: body.companyLogo, category, type, mode: body.mode ?? "On-site", location: body.location ?? "Remote", salary: `${body.currency ?? "USD"} ${body.minSalary ?? 0}–${body.maxSalary ?? 0}`, experience: body.experience ?? "", website: body.website, size: body.size, industry: body.industry, description: body.description.trim(), responsibilities: body.responsibilities.split("\n").map(value => value.trim()).filter(Boolean), requirements: body.requirements.split("\n").map(value => value.trim()).filter(Boolean), benefits: body.benefits?.split("\n").filter(Boolean), deadline: body.deadline })
  return Response.json({ job }, { status: 201 })
}
