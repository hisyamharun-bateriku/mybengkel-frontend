<script setup lang="ts">
const model = defineModel<string>()
defineProps<{ class?: string }>()
</script>
<template>
  <select v-model="model" v-bind="$attrs" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
    <slot />
  </select>
</template>
