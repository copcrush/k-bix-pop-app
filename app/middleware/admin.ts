export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server)
    return

  const { hydrate, isLoggedIn, isAdmin } = useAuth()

  if (!isLoggedIn.value)
    hydrate()

  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: useRoute().fullPath },
    })
  }

  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
