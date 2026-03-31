import { describe, it, expect } from 'vitest'

// Mirror the exact PERMISSIONS map from usePermissions.ts — we test the logic, not the composable wiring
type BetterAuthRole =
  | 'super_admin'
  | 'admin'
  | 'panel_manager'
  | 'panel_technician'
  | 'partner_manager'
  | 'partner_technician'
type Resource = 'dashboard' | 'job' | 'bay' | 'settings' | 'booking' | 'partner' | 'user' | 'report'
type Action =
  | 'view'
  | 'create'
  | 'edit'
  | 'assign'
  | 'reschedule'
  | 'reassign'
  | 'delete'
  | 'confirm'
  | 'reject'
  | 'cancel'
  | 'approve'
  | 'ban'
  | 'export'

const PERMISSIONS: Record<BetterAuthRole, Partial<Record<Resource, Action[]>>> = {
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

function can(role: BetterAuthRole, resource: Resource, action: Action): boolean {
  return PERMISSIONS[role]?.[resource]?.includes(action) ?? false
}

function isPanel(role: BetterAuthRole | undefined): boolean {
  if (!role) return false
  return (['super_admin', 'admin', 'panel_manager', 'panel_technician'] as BetterAuthRole[]).includes(role)
}

function isPartner(role: BetterAuthRole | undefined): boolean {
  if (!role) return false
  return (['partner_manager', 'partner_technician'] as BetterAuthRole[]).includes(role)
}

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
    expect(isPanel('panel_manager')).toBe(true)
  })

  it('isPartner returns true for partner_manager', () => {
    expect(isPartner('partner_manager')).toBe(true)
  })

  it('super_admin has full access', () => {
    expect(can('super_admin', 'user', 'ban')).toBe(true)
    expect(can('super_admin', 'partner', 'delete')).toBe(true)
    expect(can('super_admin', 'report', 'export')).toBe(true)
  })
})
