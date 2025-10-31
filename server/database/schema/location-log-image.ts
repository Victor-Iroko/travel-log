import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { locationLog } from './location-log'

export const locationLogImage = pgTable('locationLogImage', {
  id: serial().primaryKey(),
  key: text().notNull(),
  locationLogId: integer().notNull().references(() => locationLog.id),
  userId: integer().notNull().references(() => user.id),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const locationLogImageRelations = relations(locationLogImage, ({ one }) => ({
  locationLog: one(locationLog, {
    fields: [locationLogImage.locationLogId],
    references: [locationLog.id],
  }),
}))
