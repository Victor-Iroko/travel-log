import { createInsertSchema } from 'drizzle-zod'
import { location } from '~~/server/database/schema'
import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from './zod-schemas'

export const InsertLocationSchema = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})
