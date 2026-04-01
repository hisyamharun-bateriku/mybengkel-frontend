<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const $api = useApi()

const stats = ref({ totalBookings: 0, myInProgressJobs: 0, availableBays: 0, totalCustomers: 0 })
const bays = ref<{ id: string; name: string; status: string; vehicleReg?: string }[]>([])
const recentJobs = ref<{ id: string; jobNumber: string; customerName: string; vehicleDetails: string; status: string }[]>([])

onMounted(async () => {
  try {
    const [statsRes, baysRes, jobsRes] = await Promise.all([
      $api<{ success: boolean; data: typeof stats.value }>('/api/v1/dashboard/stats'),
      $api<{ success: boolean; data: { data: typeof bays.value } }>('/api/v1/bays'),
      $api<{ success: boolean; data: { data: typeof recentJobs.value } }>('/api/v1/jobs'),
    ])
    stats.value = statsRes.data
    bays.value = baysRes.data.data
    recentJobs.value = jobsRes.data.data
  } catch {}
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-[var(--color-text)]">Dashboard Overview</h1>
      <p class="text-sm text-[var(--color-text-muted)]">A quick summary of your workshop operations</p>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-6">
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">Total Bookings</p>
        <p class="text-3xl font-bold mt-1">{{ stats.totalBookings }}</p>
        <p class="text-xs text-[var(--color-text-muted)] mt-1">bookings</p>
      </Card>
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">In Progress Jobs</p>
        <p class="text-3xl font-bold mt-1">{{ stats.myInProgressJobs }}</p>
        <p class="text-xs text-[var(--color-text-muted)] mt-1">jobs</p>
      </Card>
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">Available Bays</p>
        <p class="text-3xl font-bold mt-1">{{ stats.availableBays }}</p>
        <p class="text-xs text-[var(--color-text-muted)] mt-1">bays</p>
      </Card>
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">Total Customers</p>
        <p class="text-3xl font-bold mt-1">{{ stats.totalCustomers }}</p>
        <p class="text-xs text-[var(--color-text-muted)] mt-1">customers</p>
      </Card>
    </div>

    <Card class="p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-semibold">Bay Overview</h2>
          <p class="text-sm text-[var(--color-text-muted)]">Monitor bay availability and occupancy</p>
        </div>
        <NuxtLink to="/panel/settings" class="text-sm text-[var(--color-primary)] hover:underline">View all bays →</NuxtLink>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="bay in bays" :key="bay.id" class="border border-[var(--color-border)] rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="bay.status === 'AVAILABLE' ? 'bg-[var(--color-success)]' : bay.status === 'DISABLED' ? 'bg-[var(--color-neutral)]' : 'bg-[var(--color-danger)]'"
            />
            <span class="text-xs text-[var(--color-text-muted)]">{{ bay.status }}</span>
          </div>
          <p class="font-semibold text-[var(--color-primary)]">{{ bay.name }}</p>
          <p v-if="bay.vehicleReg" class="text-xs mt-1 font-mono bg-gray-800 text-white px-2 py-0.5 rounded inline-block">{{ bay.vehicleReg }}</p>
          <p v-else class="text-xs text-[var(--color-text-muted)] mt-1">Ready for task</p>
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-semibold">Recent Jobs</h2>
          <p class="text-sm text-[var(--color-text-muted)]">Latest job activity</p>
        </div>
        <NuxtLink to="/panel/jobs" class="text-sm text-[var(--color-primary)] hover:underline">View all →</NuxtLink>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="job in recentJobs" :key="job.id">
            <TableCell>
              <NuxtLink :to="`/panel/jobs/${job.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ job.jobNumber }}</NuxtLink>
            </TableCell>
            <TableCell>{{ job.customerName }}</TableCell>
            <TableCell>{{ job.vehicleDetails }}</TableCell>
            <TableCell><Badge variant="outline">{{ job.status }}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
