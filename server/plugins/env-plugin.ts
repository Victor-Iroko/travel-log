export default defineNitroPlugin(() => {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const message
      = '❌ Invalid environment variables:\n'
        + parsed.error.issues
          .map(issue => `  • ${issue.path.join('.')} — ${issue.message}`)
          .join('\n')

    if (import.meta.dev) {
      console.error(message)
    }
    else {
      console.error(message)
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid runtime configuration',
        message,
      })
    }
  }
})
