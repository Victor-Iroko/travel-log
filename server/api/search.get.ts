import { FetchError } from 'ofetch'
import z from 'zod'
import { SearchSchema } from '~~/shared/validation/zod-schemas'
import type { SearchPlaces } from '../types/search-places'

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const search = await getValidatedQuery(event, SearchSchema.safeParse)
    if (!search.success) {
      return sendError(event, createError({
        statusCode: 422,
        statusMessage: z.prettifyError(search.error),
      }))
    }

    try {
      const result = await $fetch<SearchPlaces>(`https://nominatim.openstreetmap.org/search?q=${search.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'travel-log | irokovictor7@gmail.com',
        },
      })

      return result
    }
    catch (error) {
      if (error instanceof FetchError) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: error.data?.statusMessage || error.statusMessage,
        }))
      }

      return sendError(event, createError({
        statusCode: 500,
        statusMessage: error instanceof Error ? error.message : 'An unexpected error has occurred',
      }))
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: 'search-nominatim',
    getKey: async (event) => {
      const query = await getQuery(event)
      return query.q?.toString() || ''
    },
  }))
