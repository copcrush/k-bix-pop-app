export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server)
    return
  const { hydrate, isLoggedIn } = useAuth()
  hydrate()
  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: useRoute().fullPath },
    })
  }
})
