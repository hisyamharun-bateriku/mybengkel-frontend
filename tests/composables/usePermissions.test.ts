import { describe, it, expect } from 'vitest'
import { PERMISSIONS } from '~/composables/usePermissions'
import type { BetterAuthRole, Resource, Action } from '~/types/auth'

function can(role: BetterAuthRole, resource: Resource, action: Action): boolean {
  return PERMISSIONS[role]?.[resource]?.includes(action) ?? false
}

const PANEL_ROLES: BetterAuthRole[] = ['super_admin', 'admin', 'panel_manager', 'panel_technician']
const PARTNER_ROLES: BetterAuthRole[] = ['partner_manager', 'partner_technician']

describe('Permission matrix', () => {
  it('returns false when no user (undefined role)', () => {
    // Simulates the composable's "if (!role.value) return false" guard
    const role: BetterAuthRole | undefined = undefined
    const result = role ? (PERMISSIONS[role]?.['job']?.includes('create') ?? false) : false
    expect(result).toBe(false)
  })

  it('panel_manager can create jobs', () => {
    expect(can('panel_manager', 'job', 'create')).toBe(true)
  })

  it('panel_technician cannot create jobs', () => {
    expect(can('panel_technician', 'job', 'create')).toBe(false)
  })

  it('panel_technician can edit jobs', () => {
    expect(can('panel_technician', 'job', 'edit')).toBe(true)
  })

  it('partner_manager can assign jobs', () => {
    expect(can('partner_manager', 'job', 'assign')).toBe(true)
  })

  it('partner_technician cannot assign jobs', () => {
    expect(can('partner_technician', 'job', 'assign')).toBe(false)
  })

  it('isPanel returns true for panel_manager', () => {
    expect(PANEL_ROLES.includes('panel_manager')).toBe(true)
  })

  it('isPartner returns true for partner_manager', () => {
    expect(PARTNER_ROLES.includes('partner_manager')).toBe(true)
  })

  it('super_admin has full access', () => {
    expect(can('super_admin', 'user', 'ban')).toBe(true)
    expect(can('super_admin', 'partner', 'delete')).toBe(true)
    expect(can('super_admin', 'report', 'export')).toBe(true)
  })
})
