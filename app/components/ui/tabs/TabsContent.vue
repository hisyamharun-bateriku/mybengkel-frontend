<script setup lang="ts">
const props = defineProps<{ value: string; class?: string }>()
const activeTab = inject<Ref<string>>('tabs-active')!
const isActive = computed(() => activeTab.value === props.value)
</script>
<template>
  <div v-if="isActive" :class="props.class"><slot /></div>
</template>
