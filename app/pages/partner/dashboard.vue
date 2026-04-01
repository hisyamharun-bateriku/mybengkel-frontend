<script setup lang="ts">
definePageMeta({ layout: 'partner' })

const $api = useApi()
const stats = ref({ totalAssigned: 0, inProgress: 0, completed: 0 })
const recentJobs = ref<{ id: string; jobNumber: string; vehicle: { make?: string; model?: string; registration?: string; year?: number }; status: string }[]>([])

onMounted(async () => {
  try {
    const [statsRes, jobsRes] = await Promise.all([
      $api<{ success: boolean; data: typeof stats.value }>('/api/v1/dashboard/stats'),
      $api<{ success: boolean; data: { data: typeof recentJobs.value } }>('/api/v1/jobs'),
    ])
    stats.value = statsRes.data
    recentJobs.value = jobsRes.data.data
  } catch {}
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold">Dashboard Overview</h1>
      <p class="text-sm text-[var(--color-text-muted)]">Your assigned jobs and activity</p>
    </div>
    <div class="grid grid-cols-3 gap-4 mb-6">
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">Total Assigned</p>
        <p class="text-3xl font-bold mt-1">{{ stats.totalAssigned }}</p>
      </Card>
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">In Progress</p>
        <p class="text-3xl font-bold mt-1">{{ stats.inProgress }}</p>
      </Card>
      <Card class="p-5">
        <p class="text-sm text-[var(--color-text-muted)]">Completed</p>
        <p class="text-3xl font-bold mt-1">{{ stats.completed }}</p>
      </Card>
    </div>
    <Card class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold">Recent Jobs</h2>
        <NuxtLink to="/partner/jobs" class="text-sm text-[var(--color-primary)] hover:underline">View all →</NuxtLink>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job #</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="job in recentJobs" :key="job.id">
            <TableCell>
              <NuxtLink :to="`/partner/jobs/${job.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ job.jobNumber }}</NuxtLink>
            </TableCell>
            <TableCell>{{ job.vehicle?.make }} {{ job.vehicle?.model }} · {{ job.vehicle?.registration }}</TableCell>
            <TableCell><Badge variant="outline">{{ job.status }}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
