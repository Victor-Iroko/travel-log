import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const config = useRuntimeConfig() as unknown as UseRuntimeConfigType
const pool = new Pool({
  connectionString: config.databaseUrl,
})
export const db = drizzle({ client: pool })
