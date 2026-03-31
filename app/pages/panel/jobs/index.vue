<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const $api = useApi()
const { can } = usePermissions()
const jobs = ref<{ id: string; jobNumber: string; customerName: string; vehicle: string; status: string; services: string[] }[]>([])
const statusFilter = ref('ALL')
const pagination = ref({ page: 1, total: 0, limit: 10 })

async function fetchJobs() {
  try {
    const params = new URLSearchParams({ page: String(pagination.value.page), limit: String(pagination.value.limit) })
    if (statusFilter.value !== 'ALL') params.set('status', statusFilter.value)
    const res = await $api(`/api/v1/jobs?${params}`) as { data: typeof jobs.value; meta: { total: number } }
    jobs.value = res.data
    pagination.value.total = res.meta.total
  } catch {}
}

onMounted(fetchJobs)
watch(statusFilter, fetchJobs)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold">Job</h1>
        <p class="text-sm text-[var(--color-text-muted)]">Manage workshop jobs</p>
      </div>
      <Button v-if="can('job', 'create')" class="bg-[var(--color-primary)] text-white">+ Create Job</Button>
    </div>
    <Card class="p-6">
      <div class="flex gap-2 mb-4 flex-wrap">
        <Button v-for="s in ['ALL','NEW','ASSIGNED','ACCEPTED','IN_PROGRESS','COMPLETED']" :key="s" :variant="statusFilter === s ? 'default' : 'outline'" size="sm" @click="statusFilter = s">{{ s }}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="job in jobs" :key="job.id">
            <TableCell>
              <NuxtLink :to="`/panel/jobs/${job.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ job.jobNumber }}</NuxtLink>
            </TableCell>
            <TableCell>{{ job.customerName }}</TableCell>
            <TableCell>{{ job.vehicle }}</TableCell>
            <TableCell>
              <div class="flex gap-1 flex-wrap">
                <Badge v-for="s in job.services.slice(0,2)" :key="s" variant="secondary" class="text-xs">{{ s }}</Badge>
                <Badge v-if="job.services.length > 2" variant="outline" class="text-xs">+{{ job.services.length - 2 }}</Badge>
              </div>
            </TableCell>
            <TableCell><Badge variant="outline">{{ job.status }}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
