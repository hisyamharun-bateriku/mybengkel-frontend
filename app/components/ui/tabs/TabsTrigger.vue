<script setup lang="ts">
import { cn } from '~/lib/utils'
const props = defineProps<{ value: string; class?: string }>()
const activeTab = inject<Ref<string>>('tabs-active')!
function activate() { activeTab.value = props.value }
const isActive = computed(() => activeTab.value === props.value)
</script>
<template>
  <button
    type="button"
    :class="cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', isActive ? 'bg-background text-foreground shadow-sm' : '', props.class)"
    @click="activate"
  >
    <slot />
  </button>
</template>
