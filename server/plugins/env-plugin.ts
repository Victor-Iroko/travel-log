export default defineNitroPlugin(() => {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const message
      = '❌ Invalid environment variables:\n'
        + parsed.error.issues
          .map(issue => `  • ${issue.path.join('.')} — ${issue.message}`)
          .join('\n')

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
