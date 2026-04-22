export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server)
    return

  const { hydrate, isLoggedIn } = useAuth()

  if (isLoggedIn.value)
    return

  hydrate()

  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: useRoute().fullPath },
    })
  }
})
