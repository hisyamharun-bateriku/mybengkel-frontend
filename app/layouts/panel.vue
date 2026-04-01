<script setup lang="ts">
const { ready } = useUserSession()
</script>

<template>
  <div v-if="!ready" class="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
    <div class="text-[var(--color-text-muted)] text-sm">Loading…</div>
  </div>
  <div v-else class="flex min-h-screen bg-[var(--color-bg)]">
    <AppSidebar portal="panel" />
    <div class="flex-1 ml-[232px] flex flex-col min-h-screen">
      <AppTopBar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
