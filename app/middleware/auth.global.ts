const GUEST_ROUTES = ['/login', '/forgot-password', '/reset-password']
const PUBLIC_ROUTES = ['/setup-password', '/unauthorized']
const PROTECTED_PREFIXES = ['/panel', '/partner']

function resolveAuth(to: { path: string; meta: { auth?: string | boolean } }): string | false {
  // Explicit page meta takes priority
  if (to.meta.auth !== undefined) {
    return to.meta.auth as string | false
  }
  if (GUEST_ROUTES.includes(to.path)) return 'guest'
  if (PUBLIC_ROUTES.some(r => to.path.startsWith(r))) return false
  if (PROTECTED_PREFIXES.some(p => to.path.startsWith(p))) return 'user'
  return false
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, ready, fetchSession } = useUserSession()

  if (!ready.value) {
    await fetchSession()
  }

  const auth = resolveAuth(to)
  if (auth === false) return

  if (auth === 'guest') {
    if (loggedIn.value) {
      const { dashboardPath } = usePortal()
      return navigateTo(dashboardPath.value)
    }
    return
  }

  if (!loggedIn.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // Portal guard: redirect users to their correct portal
  const { user } = useUserSession()
  if (user.value) {
    const role = user.value.role as string
    const isPartner = ['partner_manager', 'partner_technician'].includes(role)
    if (to.path.startsWith('/panel') && isPartner) {
      return navigateTo('/partner/dashboard')
    }
    if (to.path.startsWith('/partner') && !isPartner) {
      return navigateTo('/panel/dashboard')
    }
  }
})
