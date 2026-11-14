import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

// .env is per-machine (and gitignored), so fall back to a local Mongo instead
// of throwing during import when BETTER_AUTH_MONGODB_URL isn't set.
const client = new MongoClient(
  process.env.BETTER_AUTH_MONGODB_URL ?? "mongodb://localhost:27017"
)
const db = client.db("hireloopdb")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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
