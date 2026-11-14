/** Roles an account can hold, picked on the sign-up form.
 *
 *  Lives in its own module because the browser form and the better-auth
 *  server config both need this list — keeping it in one place stops the
 *  two from drifting apart. */
export const ROLES = ["seeker", "recruiter", "admin"] as const

export type Role = (typeof ROLES)[number]

/** Used when sign-up doesn't send a role — Google sign-up has no form. */
export const DEFAULT_ROLE: Role = "seeker"

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  )
}
