<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const route = useRoute()
const $api = useApi()
const customer = ref<{ id: string; name: string; phone: string; email: string; vehicles: { id: string; registration: string; make: string; model: string }[] } | null>(null)

onMounted(async () => {
  try {
    customer.value = await $api(`/api/v1/customers/${route.params.id}`) as typeof customer.value
  } catch {}
})
</script>

<template>
  <div>
    <NuxtLink to="/panel/customers" class="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← Customers</NuxtLink>
    <div v-if="customer">
      <h1 class="text-xl font-semibold mb-6">{{ customer.name }}</h1>
      <Card class="p-6 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><p class="text-[var(--color-text-muted)]">Phone</p><p class="font-medium">{{ customer.phone }}</p></div>
          <div><p class="text-[var(--color-text-muted)]">Email</p><p class="font-medium">{{ customer.email }}</p></div>
        </div>
      </Card>
      <Card class="p-6">
        <h2 class="font-semibold mb-4">Vehicles</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="v in customer.vehicles" :key="v.id">
              <TableCell class="font-medium">{{ v.registration }}</TableCell>
              <TableCell>{{ v.make }}</TableCell>
              <TableCell>{{ v.model }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  </div>
</template>
