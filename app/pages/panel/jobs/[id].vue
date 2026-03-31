<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const route = useRoute()
const $api = useApi()
const { can } = usePermissions()

const job = ref<{ id: string; jobNumber: string; status: string; customerName: string; vehicle: string; services: string[]; notes?: string } | null>(null)

onMounted(async () => {
  try {
    job.value = await $api(`/api/v1/jobs/${route.params.id}`) as typeof job.value
  } catch {}
})

async function updateStatus(status: string) {
  if (!job.value) return
  job.value = await $api(`/api/v1/jobs/${job.value.id}/status`, { method: 'PATCH', body: { status } }) as typeof job.value
}
</script>

<template>
  <div>
    <NuxtLink to="/panel/jobs" class="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← Jobs</NuxtLink>
    <div v-if="job">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold">Job {{ job.jobNumber }}</h1>
        <Badge variant="outline">{{ job.status }}</Badge>
      </div>
      <Card class="p-6 mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><p class="text-[var(--color-text-muted)]">Customer</p><p class="font-medium">{{ job.customerName }}</p></div>
          <div><p class="text-[var(--color-text-muted)]">Vehicle</p><p class="font-medium">{{ job.vehicle }}</p></div>
        </div>
        <div class="mt-4">
          <p class="text-[var(--color-text-muted)] text-sm mb-2">Services</p>
          <div class="flex gap-2 flex-wrap">
            <Badge v-for="s in job.services" :key="s" variant="secondary">{{ s }}</Badge>
          </div>
        </div>
      </Card>
      <div v-if="can('job', 'edit')" class="flex gap-3">
        <Button v-if="job.status === 'NEW'" class="bg-[var(--color-primary)] text-white" @click="updateStatus('ASSIGNED')">Assign</Button>
        <Button v-if="job.status === 'ACCEPTED'" class="bg-[var(--color-primary)] text-white" @click="updateStatus('IN_PROGRESS')">Start</Button>
        <Button v-if="job.status === 'IN_PROGRESS'" class="bg-[var(--color-primary)] text-white" @click="updateStatus('COMPLETED')">Complete</Button>
        <Button v-if="!['COMPLETED','CANCELLED'].includes(job.status)" variant="outline" @click="updateStatus('CANCELLED')">Cancel</Button>
      </div>
    </div>
  </div>
</template>
