export type BetterAuthRole =
  | 'super_admin'
  | 'admin'
  | 'panel_manager'
  | 'panel_technician'
  | 'partner_manager'
  | 'partner_technician'

export type PortalType = 'panel' | 'partner'

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

// Augment Better Auth user with backend additional fields
declare module '#nuxt-better-auth' {
  interface AuthUser {
    firstName: string
    lastName: string
    phone?: string
    role: BetterAuthRole
    status: string
    baOrganizationId?: string
    staffId?: string
    avatar?: string
    mfaEnabled: boolean
  }
}
