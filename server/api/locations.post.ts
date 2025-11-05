import { DrizzleQueryError } from 'drizzle-orm'
import { InsertLocationSchema } from '~~/shared/validation/location-schema'
import { findLocationByNameAndUser, insertLocation } from '../database/queries/location'
import { generateUniqueSlug } from '../utils/generate-slug'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse)
  if (!result.success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: formatZodError(result.error),
    }))
  }

  const userId = Number(event.context.user?.id)

  const existingLocation = await findLocationByNameAndUser(result.data.name, userId)
  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists',
    }))
  }

  const slug = await generateUniqueSlug(result.data.name)

  try {
    const created = await insertLocation({
      ...result.data,
      userId,
      slug,
    })
    return created
  }
  catch (error) {
    if (error instanceof DrizzleQueryError && error.cause?.message) {
      const message = error.cause.message

      if (message.includes('location_slug_unique')) {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'Slug must be unique (the location name is used to generate the slug).',
        }))
      }

      if (message.includes('location_name_userId_unique')) {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'A location with that name already exists',
        }))
      }
    }

    // fallback for any other errors
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'An unexpected error has occurred',
    }))
  }
})
