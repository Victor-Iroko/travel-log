import { DrizzleQueryError } from 'drizzle-orm'
import { InsertLocationSchema } from '~~/shared/validation/location-schema'
import { location } from '../database/schema'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }),
    )
  }

  const result = await readValidatedBody(event, InsertLocationSchema.safeParse)
  if (!result.success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: formatZodError(result.error),

    }))
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      userId: Number(event.context.user?.id),
      slug: result.data.name.replaceAll(' ', '-').toLowerCase(),
    }).returning()
    return created
  }
  catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause?.message === 'duplicate key value violates unique constraint "location_slug_unique"') {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'Slug must be unique (the location name is used to generate the slug).',
        }))
      }
    }
  }
})
