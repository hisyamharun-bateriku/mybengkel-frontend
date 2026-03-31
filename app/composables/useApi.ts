export function useApi() {
  const { user } = useUserSession()
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      options.headers = {
        ...options.headers,
        ...(user.value?.baOrganizationId
          ? { 'x-tenant-id': user.value.baOrganizationId }
          : {}),
      }
    },
  })
}
