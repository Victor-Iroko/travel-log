export const useAuthStore = defineStore('useAuthStore', () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)

  async function init() {
    const data = await authClient.useSession(useFetch)
    session.value = data
  }

  const user = computed(() => session.value?.data?.user)

  const loading = computed(() => session.value?.isPending)
  const signIn = async () => {
    // also get and attach the csrf token
    const { csrf } = useCsrf()
    const headers = new Headers()
    headers.append('csrf-token', csrf)
    await authClient.signIn.social({ provider: 'github', callbackURL: '/dashboard',
      errorCallbackURL: '/error', fetchOptions: {
        headers,
      } })
  }

  const signOut = async () => {
    // also get and attach the csrf token
    const { csrf } = useCsrf()
    const headers = new Headers()
    headers.append('csrf-token', csrf)
    await authClient.signOut({ fetchOptions: { headers } })
    navigateTo('/')
  }

  return {
    init,
    signIn,
    signOut,
    loading,
    user,
  }
})
