export function useApi() {
  const { user } = useUserSession()
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      const { session } = useUserSession()
      options.headers = {
        ...options.headers,
        ...(session.value?.token
          ? { authorization: `Bearer ${session.value.token}` }
          : {}),
        ...(user.value?.baOrganizationId
          ? { 'x-tenant-id': user.value.baOrganizationId }
          : {}),
      }
    },
  })
}
