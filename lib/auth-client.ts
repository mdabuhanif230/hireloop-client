import { createAuthClient } from "better-auth/react"

/**
 * Exactly one client for the whole app. better-auth builds a fresh session
 * atom on every `createAuthClient()` call, so a second instance would never
 * learn about a sign-in performed through this one — `useSession` and the
 * `signIn`/`signUp`/`signOut` actions have to share this instance or the
 * navbar stays stuck on "Sign In" after logging in.
 */
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
})

export const { signIn, signUp, useSession } = authClient
