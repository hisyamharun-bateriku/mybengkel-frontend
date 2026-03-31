import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BetterAuthRole, PortalType } from '~/types/auth'

const PANEL_ROLES: BetterAuthRole[] = ['super_admin', 'admin', 'panel_manager', 'panel_technician']
const PARTNER_ROLES: BetterAuthRole[] = ['partner_manager', 'partner_technician']

export const useAuthStore = defineStore('auth', () => {
  const portalType = ref<PortalType | null>(null)

  function resolvePortal(role: BetterAuthRole): PortalType {
    if (PARTNER_ROLES.includes(role)) return 'partner'
    return 'panel'
  }

  function setPortalFromRole(role: BetterAuthRole) {
    portalType.value = resolvePortal(role)
  }

  function clear() {
    portalType.value = null
  }

  return { portalType, resolvePortal, setPortalFromRole, clear }
})
