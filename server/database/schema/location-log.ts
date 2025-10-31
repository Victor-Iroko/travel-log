import { relations } from 'drizzle-orm'
import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { location } from './location'
import { locationLogImage } from './location-log-image'

export const locationLog = pgTable('locationLog', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  startedAt: timestamp().notNull(),
  endedAt: timestamp().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: integer().notNull().references(() => location.id),
  userId: integer().notNull().references(() => user.id),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImage),
}))
