import type { PortalType, BetterAuthRole } from '~/types/auth'
import { PARTNER_ROLES } from '~/types/auth'

export function usePortal() {
  const { user } = useUserSession()

  const portalType = computed<PortalType>(() => {
    if (!user.value?.role) return 'panel'
    return PARTNER_ROLES.includes(user.value.role as BetterAuthRole) ? 'partner' : 'panel'
  })

  const dashboardPath = computed(() =>
    portalType.value === 'partner' ? '/partner/dashboard' : '/panel/dashboard',
  )

  return { portalType, dashboardPath }
}
