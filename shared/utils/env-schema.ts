import { z } from 'zod'

// we're validating the runtime config not process.env directly
export const envSchema = z.object({
  databaseUrl: z.string().nonempty(),
  public: z.object({

  }),
})

export type UseRuntimeConfigType = z.infer<typeof envSchema>

export default envSchema
