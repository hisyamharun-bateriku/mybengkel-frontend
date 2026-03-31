<script setup lang="ts">
defineProps<{ value: string }>()
</script>
<template><option :value="value"><slot /></option></template>
