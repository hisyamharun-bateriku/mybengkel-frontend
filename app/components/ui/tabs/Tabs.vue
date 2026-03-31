<script setup lang="ts">
const props = defineProps<{ defaultValue?: string; class?: string }>()
const activeTab = ref(props.defaultValue ?? '')
provide('tabs-active', activeTab)
</script>
<template>
  <div :class="props.class"><slot /></div>
</template>
