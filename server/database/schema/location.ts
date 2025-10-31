import { relations } from 'drizzle-orm'
import { integer, pgTable, real, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { locationLog } from './location-log'

export const location = pgTable('location', {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: integer().notNull().references(() => user.id),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).notNull().defaultNow().$onUpdate(() => new Date()),
},
table => [
  unique().on(table.name, table.userId),
],
)

export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}))
