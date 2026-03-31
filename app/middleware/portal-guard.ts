import type { BetterAuthRole } from '~/types/auth'
import { PARTNER_ROLES } from '~/types/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, ready } = useUserSession()

  // Wait for session to hydrate in clientOnly mode
  if (!ready.value) return

  if (!user.value) return navigateTo('/login')

  const role = user.value.role as BetterAuthRole
  const isPartner = PARTNER_ROLES.includes(role)

  // Redirect panel users away from partner routes and vice versa
  if (to.path.startsWith('/panel') && isPartner) {
    return navigateTo('/partner/dashboard')
  }

  if (to.path.startsWith('/partner') && !isPartner) {
    return navigateTo('/panel/dashboard')
  }
})
