import type { User } from 'better-auth'
import type { H3Event } from 'h3'

export interface AuthenticatedEvent extends H3Event {
  context: H3Event['context'] & {
    user: User
  }
}

export default function defineAuthenticatedEventHandler<T>(handler: (event: AuthenticatedEvent) => Promise<T> | T) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        status: 401,
        statusMessage: 'Unauthorized',
      }))
    }

    return handler(event as AuthenticatedEvent)
  })
}
