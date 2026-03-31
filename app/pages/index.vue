<script setup lang="ts">
definePageMeta({ auth: false })

const { user, ready } = useUserSession()
const { dashboardPath } = usePortal()

watchEffect(() => {
  if (ready.value) {
    navigateTo(user.value ? dashboardPath.value : '/login')
  }
})
</script>

<template>
  <div />
</template>
