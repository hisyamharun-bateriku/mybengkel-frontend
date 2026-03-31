import type { PortalType, BetterAuthRole } from '~/types/auth'

const PARTNER_ROLES: BetterAuthRole[] = ['partner_manager', 'partner_technician']

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
