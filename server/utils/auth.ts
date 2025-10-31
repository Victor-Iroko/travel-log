import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, env } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  socialProviders: {
    github: {
      clientId: env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: env.NUXT_GITHUB_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      useNumberId: true,
    },
  },
})
