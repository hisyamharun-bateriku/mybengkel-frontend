<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const $api = useApi()
const bookings = ref<{ id: string; bookingNumber: string; customerName: string; vehicle: string; status: string; date: string }[]>([])
const pagination = ref({ page: 1, total: 0, limit: 10 })
const statusFilter = ref('ALL')

async function fetchBookings() {
  try {
    const params = new URLSearchParams({ page: String(pagination.value.page), limit: String(pagination.value.limit) })
    if (statusFilter.value !== 'ALL') params.set('status', statusFilter.value)
    const res = await $api(`/api/v1/bookings?${params}`) as { data: typeof bookings.value; meta: { total: number } }
    bookings.value = res.data
    pagination.value.total = res.meta.total
  } catch {}
}

onMounted(fetchBookings)
watch(statusFilter, fetchBookings)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold">Booking</h1>
        <p class="text-sm text-[var(--color-text-muted)]">Manage customer bookings</p>
      </div>
    </div>
    <Card class="p-6">
      <div class="flex gap-2 mb-4 flex-wrap">
        <Button
          v-for="s in ['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'REJECTED']"
          :key="s"
          :variant="statusFilter === s ? 'default' : 'outline'"
          size="sm"
          @click="statusFilter = s"
        >{{ s }}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="b in bookings" :key="b.id">
            <TableCell>
              <NuxtLink :to="`/panel/bookings/${b.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ b.bookingNumber }}</NuxtLink>
            </TableCell>
            <TableCell>{{ b.customerName }}</TableCell>
            <TableCell>{{ b.vehicle }}</TableCell>
            <TableCell>{{ b.date }}</TableCell>
            <TableCell><Badge variant="outline">{{ b.status }}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
