export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const publicRoutes = ['/', '/login', '/signup', '/error']

  const isPublic = publicRoutes.includes(to.path)
  const isDashboard = to.path.startsWith('/dashboard')

  // If user tries to visit /dashboard/* and isn't logged in
  if (isDashboard && !session.value) {
    return navigateTo('/')
  }

  // If they try to visit a non-public route and aren't logged in
  if (!isPublic && !session.value) {
    return navigateTo('/')
  }
})
