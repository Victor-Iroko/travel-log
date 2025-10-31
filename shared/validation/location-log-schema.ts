import { createInsertSchema } from 'drizzle-zod'
import { locationLog } from '~~/server/database/schema'
import { DateSchema, DescriptionSchema, LatSchema, LongSchema, NameSchema } from './zod-schemas'

export const InsertLocationLogSchema = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
  startedAt: DateSchema,
  endedAt: DateSchema,
}).omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((val, ctx) => {
  if (val.startedAt > val.endedAt || val.endedAt < val.startedAt) {
    ctx.addIssue({
      code: 'custom',
      message: 'Start Date must be before End Date',
      path: ['startedAt'],
    })
    ctx.addIssue({
      code: 'custom',
      message: 'End Date must be after Start Date',
      path: ['endedAt'],
    })
  }
})
