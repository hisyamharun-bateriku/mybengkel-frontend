interface AuthUser {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  status: string
  baOrganizationId?: string
  staffId?: string
  avatar?: string
  mfaEnabled: boolean
  [key: string]: unknown
}

interface AuthSession {
  token: string
  userId: string
}

const TOKEN_COOKIE = 'auth_token'

export function useUserSession() {
  const config = useRuntimeConfig()
  const session = useState<AuthSession | null>('auth:session', () => null)
  const user = useState<AuthUser | null>('auth:user', () => null)
  const authReady = useState('auth:ready', () => false)

  const loggedIn = computed(() => Boolean(session.value && user.value))
  const ready = computed(() => authReady.value)

  const tokenCookie = useCookie(TOKEN_COOKIE, { maxAge: 60 * 60 * 24 * 7 })

  async function fetchSession() {
    const token = tokenCookie.value
    if (!token) {
      session.value = null
      user.value = null
      authReady.value = true
      return
    }
    try {
      const res = await $fetch<{
        success: boolean
        data: {
          id: string
          email: string
          name: string
          firstName: string
          lastName: string
          phoneNumber?: string
          role: string
          orgId?: string
          staffId?: string
          mfaEnabled: boolean
        }
      }>(`${config.public.apiBase}/api/v1/auth/session`, {
        headers: { authorization: `Bearer ${token}` },
      })
      if (res.success && res.data) {
        const u = res.data
        user.value = {
          id: u.id,
          email: u.email,
          name: u.name,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phoneNumber,
          role: u.role.toLowerCase(),
          status: 'active',
          baOrganizationId: u.orgId,
          staffId: u.staffId,
          mfaEnabled: u.mfaEnabled,
        }
        session.value = { token, userId: u.id }
      } else {
        clearSession()
      }
    } catch {
      clearSession()
    } finally {
      authReady.value = true
    }
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{
      success: boolean
      data: {
        accessToken: string
        mfaRequired: boolean
        user: {
          id: string
          email: string
          name: string
          firstName: string
          lastName: string
          phoneNumber?: string
          role: string
          orgId?: string
          orgName?: string
          staffId?: string
          mfaEnabled: boolean
          redirectUrl?: string
        }
      }
    }>(`${config.public.apiBase}/api/v1/auth/login`, {
      method: 'POST',
      body: { email, password },
    })
    return res
  }

  function setSession(token: string, userData: AuthUser) {
    tokenCookie.value = token
    session.value = { token, userId: userData.id }
    user.value = userData
    authReady.value = true
  }

  function clearSession() {
    tokenCookie.value = null
    session.value = null
    user.value = null
  }

  async function signOut(options?: { redirect?: string }) {
    const token = tokenCookie.value
    clearSession()
    if (options?.redirect) {
      await navigateTo(options.redirect, { replace: true })
    }
    // Fire-and-forget backend logout after redirect
    if (token) {
      $fetch(`${config.public.apiBase}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
  }

  return { session, user, loggedIn, ready, fetchSession, login, setSession, clearSession, signOut }
}
