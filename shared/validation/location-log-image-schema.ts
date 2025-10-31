import { createInsertSchema } from 'drizzle-zod'
import { locationLogImage } from '~~/server/database/schema'

export const InsertLocationLogImageSchema = createInsertSchema(locationLogImage, {
  key: field => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, 'Invalid key'),
}).omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})
