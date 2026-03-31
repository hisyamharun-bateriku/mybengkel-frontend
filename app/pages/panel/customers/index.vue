<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const $api = useApi()
const search = ref('')
const customers = ref<{ id: string; name: string; phone: string; email: string; totalVehicles: number }[]>([])

async function fetchCustomers() {
  try {
    const res = await $api(`/api/v1/customers${search.value ? `?search=${encodeURIComponent(search.value)}` : ''}`) as { data: typeof customers.value }
    customers.value = res.data
  } catch {}
}

let debounceTimer: ReturnType<typeof setTimeout>
onMounted(fetchCustomers)
watch(search, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchCustomers, 400)
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Customer</h1>
    </div>
    <Card class="p-6">
      <Input v-model="search" placeholder="Search customer name, phone…" class="mb-4 max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vehicles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="c in customers" :key="c.id">
            <TableCell>
              <NuxtLink :to="`/panel/customers/${c.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ c.name }}</NuxtLink>
            </TableCell>
            <TableCell>{{ c.phone }}</TableCell>
            <TableCell>{{ c.email }}</TableCell>
            <TableCell>{{ c.totalVehicles }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
