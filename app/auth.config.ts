import { createAuthClient } from 'better-auth/vue'
import { organizationClient, twoFactorClient } from 'better-auth/client/plugins'

export function createAppAuthClient(_baseURL: string) {
  const apiBase = import.meta.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3000'

  return createAuthClient({
    baseURL: `${apiBase}/api/v1/better-auth`,
    plugins: [organizationClient(), twoFactorClient()],
  })
}

export default createAppAuthClient
