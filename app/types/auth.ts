export type BetterAuthRole =
  | 'super_admin'
  | 'admin'
  | 'panel_manager'
  | 'panel_technician'
  | 'partner_manager'
  | 'partner_technician'

export type PortalType = 'panel' | 'partner'

export const PARTNER_ROLES: BetterAuthRole[] = ['partner_manager', 'partner_technician']

export type Resource =
  | 'dashboard'
  | 'job'
  | 'bay'
  | 'settings'
  | 'booking'
  | 'partner'
  | 'user'
  | 'report'

export type Action =
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

