<script setup lang="ts">
import { LayoutDashboard, Briefcase, Settings } from 'lucide-vue-next'

const { can } = usePermissions()
const route = useRoute()

const navItems = computed(() => [
  { label: 'Dashboard', to: '/partner/dashboard', icon: LayoutDashboard, show: can('dashboard', 'view') },
  { label: 'Job', to: '/partner/jobs', icon: Briefcase, show: can('job', 'view') },
  { label: 'Settings', to: '/partner/settings', icon: Settings, show: can('settings', 'view') },
].filter(item => item.show))

function isActive(to: string) {
  return route.path === to || (to !== '/partner/dashboard' && route.path.startsWith(to))
}
</script>

<template>
  <nav class="flex flex-col gap-0.5 px-3 flex-1">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      :class="isActive(item.to) ? 'text-white bg-white/10' : ''"
    >
      <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
