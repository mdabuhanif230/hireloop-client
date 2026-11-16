import { headers } from "next/headers"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"
import { getProfile, updateProfile } from "@/lib/seeker/store"
import type { ProfilePatch, ResumeFile } from "@/lib/seeker/types"

/** Seeker profile behind /deshboard/seeker/settings.
 *
 *  GET   → the signed-in better-auth user merged with the seeker extras
 *          (headline, bio, skills, resume) kept in the store
 *  PATCH → partial update of the same
 *
 *  Reading the session is best-effort: Mongo may be unreachable in dev, and a
 *  hung session lookup must not take the Settings page down with it — after
 *  SESSION_TIMEOUT_MS (or on any error) we fall back to the demo identity. */

const SESSION_TIMEOUT_MS = 2000

type Account = {
  name?: string | null
  email?: string | null
  image?: string | null
}

async function getAccount(): Promise<Account | undefined> {
  try {
    const session = await Promise.race([
      auth.api.getSession({ headers: await headers() }),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), SESSION_TIMEOUT_MS)
      ),
    ])

    if (!session?.user) return undefined
    return {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  } catch {
    return undefined
  }
}

/** userId → store key. Same account keeps its edits across requests;
 *  signed-out visitors share the "demo" profile. */
async function getUserId(account: Account | undefined) {
  return account ? `user:${account.email ?? "anonymous"}` : "demo"
}

export async function GET() {
  const account = await getAccount()
  return Response.json(getProfile(await getUserId(account), account))
}

export async function PATCH(request: NextRequest) {
  let body: ProfilePatch
  try {
    body = (await request.json()) as ProfilePatch
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // `null`, a bare number or an array are valid JSON but not a patch object;
  // `key in body` would throw on them.
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Body must be a JSON object" },
      { status: 400 }
    )
  }

  const allowed: (keyof ProfilePatch)[] = [
    "name",
    "email",
    "avatarUrl",
    "headline",
    "bio",
    "skills",
    "resume",
  ]
  const patch: ProfilePatch = {}
  for (const key of allowed) {
    if (key in body) {
      Object.assign(patch, { [key]: body[key] })
    }
  }

  // Coerce the scalars: everything here reaches the Settings form, which
  // renders them directly.
  for (const key of ["name", "email", "headline", "bio"] as const) {
    if (key in patch && typeof patch[key] !== "string") delete patch[key]
  }
  if ("avatarUrl" in patch && typeof patch.avatarUrl !== "string") {
    if (patch.avatarUrl !== null) delete patch.avatarUrl
  }

  // Skills must arrive as an array — the form calls .map() on it. Anything
  // else (null, an object) is dropped, not stored.
  if ("skills" in patch) {
    const raw: unknown = patch.skills
    if (Array.isArray(raw)) {
      patch.skills = raw
        .map((skill) => String(skill).trim())
        .filter(Boolean)
        .slice(0, 20)
    } else if (typeof raw === "string") {
      patch.skills = raw
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .slice(0, 20)
    } else {
      delete patch.skills
    }
  }

  if (patch.resume) {
    const resume = patch.resume as ResumeFile
    if (!resume.fileName) {
      return Response.json(
        { error: "resume.fileName is required" },
        { status: 400 }
      )
    }
    patch.resume = {
      fileName: resume.fileName,
      updatedAt: resume.updatedAt || new Date().toISOString(),
      sizeMb: Number(resume.sizeMb) || 0,
    }
  }

  const account = await getAccount()
  return Response.json(updateProfile(await getUserId(account), patch))
}
