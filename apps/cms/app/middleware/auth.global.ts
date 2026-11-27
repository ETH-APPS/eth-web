export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  if (!auth.ready.value)
    await auth.fetch()

  if (!auth.loggedIn.value) {
    if (to.path === '/login')
      return
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  try {
    await auth.verify()
  } catch (error) {
    if (![401, 403].includes(auth.statusOf(error) ?? 0))
      throw error

    await auth.clear()
    if (to.path !== '/login')
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (to.path === '/login')
    return navigateTo('/dashboard')
})
