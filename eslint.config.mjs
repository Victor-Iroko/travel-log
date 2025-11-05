// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['**/migrations/*'],
  rules: {
    'no-console': 'error',
  },
})
