import { createAuthClient } from 'better-auth/vue'
import { organizationClient, twoFactorClient } from 'better-auth/client/plugins'

export function createAppAuthClient(_baseURL: string) {
  const runtimeConfig = useRuntimeConfig()
  return createAuthClient({
    baseURL: `${runtimeConfig.public.apiBase}/api/v1/better-auth`,
    plugins: [organizationClient(), twoFactorClient()],
  })
}
export default createAppAuthClient
