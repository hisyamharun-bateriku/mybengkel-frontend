<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: false })
const { dashboardPath } = usePortal()
</script>

<template>
  <Card class="p-8 shadow-sm text-center">
    <div class="mb-6">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <span class="text-[var(--color-danger)] text-xl font-bold">!</span>
      </div>
      <h1 class="text-xl font-semibold text-[var(--color-danger)]">Access Denied</h1>
      <p class="text-sm text-[var(--color-text-muted)] mt-2">You don't have permission to view this page.</p>
    </div>
    <NuxtLink :to="dashboardPath">
      <Button class="w-full">Back to dashboard</Button>
    </NuxtLink>
  </Card>
</template>
