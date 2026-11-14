import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

import { DEFAULT_ROLE, ROLES, isRole } from "@/lib/roles"

// .env is per-machine (and gitignored), so fall back to a local Mongo instead
// of throwing during import when BETTER_AUTH_MONGODB_URL isn't set.
const client = new MongoClient(
  process.env.BETTER_AUTH_MONGODB_URL ?? "mongodb://localhost:27017"
)
const db = client.db("hireloopdb")

/** better-auth runs this on every write that carries a role. The array type
 *  on the field below is only a TypeScript constraint — nothing at runtime
 *  enforces it, so anything outside ROLES has to be rejected here. */
const roleMessage = `role must be one of: ${ROLES.join(", ")}`
const roleValidator = {
  "~standard": {
    version: 1,
    vendor: "hireloop",
    validate: (value: unknown) => {
      if (isRole(value)) return { value }
      return { issues: [{ message: roleMessage }] }
    },
  },
} as const

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        // Array-of-literals type, so better-auth types
        // `session.user.role` as "seeker" | "recruiter" | "admin".
        type: [...ROLES],
        // Lets the sign-up form send the role. The flip side is that
        // /update-user would accept it too, so databaseHooks below
        // freezes the role after sign-up.
        input: true,
        // Google sign-ups never see the form — default them to seeker.
        defaultValue: DEFAULT_ROLE,
        validator: { input: roleValidator },
      },
    },
  },

  // Role is decided once, at sign-up. Without this, any signed-in user
  // could POST { role: "admin" } to /update-user and escalate.
  databaseHooks: {
    user: {
      update: {
        before: async (user) => ("role" in user ? false : undefined),
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
})
