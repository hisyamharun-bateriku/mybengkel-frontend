<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const route = useRoute()
const $api = useApi()
const { can } = usePermissions()

const booking = ref<{ id: string; bookingNumber: string; status: string; customerName: string; vehicle: string; notes?: string } | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    booking.value = await $api(`/api/v1/bookings/${route.params.id}`) as typeof booking.value
  } finally { loading.value = false }
})

async function updateStatus(status: string) {
  if (!booking.value) return
  booking.value = await $api(`/api/v1/bookings/${booking.value.id}/status`, { method: 'PATCH', body: { status } }) as typeof booking.value
}
</script>

<template>
  <div>
    <NuxtLink to="/panel/bookings" class="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← Bookings</NuxtLink>
    <div v-if="loading" class="text-[var(--color-text-muted)]">Loading…</div>
    <div v-else-if="booking">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold">Booking {{ booking.bookingNumber }}</h1>
        <Badge variant="outline">{{ booking.status }}</Badge>
      </div>
      <Card class="p-6 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><p class="text-[var(--color-text-muted)]">Customer</p><p class="font-medium">{{ booking.customerName }}</p></div>
          <div><p class="text-[var(--color-text-muted)]">Vehicle</p><p class="font-medium">{{ booking.vehicle }}</p></div>
          <div v-if="booking.notes" class="col-span-2"><p class="text-[var(--color-text-muted)]">Notes</p><p>{{ booking.notes }}</p></div>
        </div>
      </Card>
      <div class="flex gap-3">
        <Button v-if="can('booking', 'confirm') && booking.status === 'PENDING'" class="bg-[var(--color-primary)] text-white" @click="updateStatus('CONFIRMED')">Confirm</Button>
        <Button v-if="can('booking', 'reject') && booking.status === 'PENDING'" variant="destructive" @click="updateStatus('REJECTED')">Reject</Button>
        <Button v-if="can('booking', 'cancel') && ['PENDING','CONFIRMED'].includes(booking.status)" variant="outline" @click="updateStatus('CANCELLED')">Cancel</Button>
      </div>
    </div>
  </div>
</template>
