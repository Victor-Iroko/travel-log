import { and, eq } from 'drizzle-orm'
import { location } from '~~/server/database/schema'

// Find an existing location by name and user
export async function findLocationByNameAndUser(name: string, userId: number) {
  return await db.query.location.findFirst({
    where: and(eq(location.name, name), eq(location.userId, userId)),
  })
}

// Find a location by slug
export async function findLocationBySlug(slug: string) {
  return await db.query.location.findFirst({
    where: eq(location.slug, slug),
  })
}

// Insert a new location
export async function insertLocation(data: typeof location.$inferInsert) {
  const [created] = await db.insert(location).values(data).returning()
  return created
}

export async function findLocations(userId: number) {
  return await db.query.location.findMany({
    where: eq(location.userId, userId),
  })
}
