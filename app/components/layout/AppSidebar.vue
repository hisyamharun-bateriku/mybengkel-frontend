<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

defineProps<{ portal: 'panel' | 'partner' }>()

const { signOut } = useUserSession()

async function handleLogout() {
  await signOut({ redirect: '/login' })
}

</script>

<template>
  <aside class="w-[232px] min-h-screen bg-[var(--color-sidebar-bg)] flex flex-col fixed left-0 top-0 z-30">
    <!-- Logo -->
    <div class="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-white font-bold text-lg tracking-tight">U! woksop</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4">
      <PanelNav v-if="portal === 'panel'" />
      <PartnerNav v-else />
    </div>

    <!-- Logout -->
    <div class="p-3 border-t border-white/10 flex-shrink-0">
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4 flex-shrink-0" />
        Logout
      </button>
    </div>
  </aside>
</template>
