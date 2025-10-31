import { z } from 'zod'

// we're validating the runtime config not process.env directly
export const envSchema = z.object({
  NUXT_DATABASE_URL: z.string().nonempty(),
  NUXT_GITHUB_CLIENT_ID: z.string().nonempty(),
  NUXT_GITHUB_CLIENT_SECRET: z.string().nonempty(),
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BETTER_AUTH_URL: z.string().nonempty(),
})

export default envSchema
