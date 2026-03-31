import type { BetterAuthRole, Resource, Action } from '~/types/auth'
import { PARTNER_ROLES } from '~/types/auth'

export const PERMISSIONS: Record<BetterAuthRole, Partial<Record<Resource, Action[]>>> = {
  super_admin: {
    dashboard: ['view', 'create', 'edit', 'assign'],
    job: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    bay: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    settings: ['view', 'create', 'edit', 'assign'],
    booking: ['view', 'confirm', 'reject', 'cancel'],
    partner: ['view', 'create', 'edit', 'approve', 'reject', 'delete'],
    user: ['view', 'create', 'edit', 'ban', 'delete'],
    report: ['view', 'export'],
  },
  admin: {
    dashboard: ['view', 'create', 'edit', 'assign'],
    job: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    bay: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    settings: ['view', 'create', 'edit', 'assign'],
    booking: ['view', 'confirm', 'reject', 'cancel'],
    partner: ['view'],
    user: ['view', 'create', 'edit'],
    report: ['view', 'export'],
  },
  panel_manager: {
    dashboard: ['view', 'create', 'edit', 'assign'],
    job: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    bay: ['view', 'create', 'edit', 'assign', 'reschedule', 'reassign', 'delete'],
    settings: ['view', 'edit'],
    booking: ['view', 'confirm', 'reject', 'cancel'],
    report: ['view'],
  },
  panel_technician: {
    dashboard: ['view'],
    job: ['view', 'edit'],
    bay: ['view'],
    settings: ['view'],
    booking: ['view'],
  },
  partner_manager: {
    dashboard: ['view'],
    job: ['view', 'edit', 'assign'],
    bay: ['view', 'edit'],
    settings: ['view', 'edit'],
    report: ['view'],
  },
  partner_technician: {
    dashboard: ['view'],
    job: ['view', 'edit'],
    bay: ['view'],
    settings: ['view'],
  },
}

export function usePermissions() {
  const { user } = useUserSession()

  const role = computed(() => user.value?.role as BetterAuthRole | undefined)

  function can(resource: Resource, action: Action): boolean {
    if (!role.value) return false
    return PERMISSIONS[role.value]?.[resource]?.includes(action) ?? false
  }

  function canAny(resource: Resource, actions: Action[]): boolean {
    return actions.some(a => can(resource, a))
  }

  function isRole(...roles: BetterAuthRole[]): boolean {
    if (!role.value) return false
    return roles.includes(role.value)
  }

  function isPanel(): boolean {
    return isRole('super_admin', 'admin', 'panel_manager', 'panel_technician')
  }

  function isPartner(): boolean {
    return isRole(...PARTNER_ROLES)
  }

  return { can, canAny, isRole, isPanel, isPartner, role }
}
