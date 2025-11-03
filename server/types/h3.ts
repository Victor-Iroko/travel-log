import type { User } from 'better-auth'
// type User = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['user']
declare module 'h3' {
  interface H3EventContext {
    user?: User
  }
}
