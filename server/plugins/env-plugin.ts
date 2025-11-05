import z from 'zod'

export default defineNitroPlugin(() => {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const message = z.prettifyError(parsed.error)

    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.error(message)
    }
    else {
      // eslint-disable-next-line no-console
      console.error(message)
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid runtime configuration',
        message,
      })
    }
  }
})
