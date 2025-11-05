import { customAlphabet } from 'nanoid'
import slugify from 'slug'
import { findLocationBySlug } from '../database/queries/location'

// Generate a unique slug
export async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name)
  let slug = baseSlug
  let existing = await findLocationBySlug(slug)

  while (existing) {
    const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)
    const newSlug = `${baseSlug}-${nanoId()}`
    existing = await findLocationBySlug(newSlug)
    if (!existing) slug = newSlug
  }

  return slug
}
