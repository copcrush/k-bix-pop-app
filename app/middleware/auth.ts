export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server)
    return
  const auth = useAuth()
  auth.hydrate()
  if (!auth.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: useRoute().fullPath },
    })
  }
})
