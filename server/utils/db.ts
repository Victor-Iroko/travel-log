import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { envSchema } from '../../shared/utils/env-schema'
import * as schema from '../database/schema'

export const env = envSchema.parse(process.env)

const pool = new Pool({
  connectionString: env.NUXT_DATABASE_URL,
})
export const db = drizzle({ client: pool, schema })
