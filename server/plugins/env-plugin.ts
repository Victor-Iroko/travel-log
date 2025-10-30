export default defineNitroPlugin(() => {
  const config = useRuntimeConfig() as unknown as UseRuntimeConfigType

  const parsed = envSchema.safeParse(config)

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
