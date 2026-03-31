<script setup lang="ts">
definePageMeta({ layout: 'partner' })

const $api = useApi()
const jobs = ref<{ id: string; jobNumber: string; vehicle: string; services: string[]; status: string }[]>([])
const statusFilter = ref('ALL')

async function fetchJobs() {
  try {
    const params = statusFilter.value !== 'ALL' ? `?status=${statusFilter.value}` : ''
    const res = await $api(`/api/v1/jobs${params}`) as { data: typeof jobs.value }
    jobs.value = res.data
  } catch {}
}

onMounted(fetchJobs)
watch(statusFilter, fetchJobs)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Jobs</h1>
    </div>
    <Card class="p-6">
      <div class="flex gap-2 mb-4 flex-wrap">
        <Button v-for="s in ['ALL','ASSIGNED','ACCEPTED','IN_PROGRESS','COMPLETED']" :key="s" :variant="statusFilter === s ? 'default' : 'outline'" size="sm" @click="statusFilter = s">{{ s }}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job #</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="job in jobs" :key="job.id">
            <TableCell>
              <NuxtLink :to="`/partner/jobs/${job.id}`" class="text-[var(--color-primary)] hover:underline font-medium">{{ job.jobNumber }}</NuxtLink>
            </TableCell>
            <TableCell>{{ job.vehicle }}</TableCell>
            <TableCell>
              <div class="flex gap-1 flex-wrap">
                <Badge v-for="s in job.services.slice(0,2)" :key="s" variant="secondary" class="text-xs">{{ s }}</Badge>
              </div>
            </TableCell>
            <TableCell><Badge variant="outline">{{ job.status }}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
