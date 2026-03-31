<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const $api = useApi()
const { can } = usePermissions()

const services = ref<{ id: string; name: string; category: string; price: number; status: string; vehicleBrand?: string; modelCount?: number }[]>([])
const pagination = ref({ page: 1, total: 0, limit: 10 })
const categoryFilter = ref('')
const search = ref('')

async function fetchServices() {
  try {
    const params = new URLSearchParams({ page: String(pagination.value.page), limit: String(pagination.value.limit) })
    if (categoryFilter.value) params.set('category', categoryFilter.value)
    if (search.value) params.set('search', search.value)
    const res = await $api(`/api/v1/service-catalog?${params}`) as { data: typeof services.value; meta: { total: number } }
    services.value = res.data
    pagination.value.total = res.meta.total
  } catch {}
}

let debounceTimer: ReturnType<typeof setTimeout>
onMounted(fetchServices)
watch(categoryFilter, fetchServices)
watch(search, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchServices, 400)
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold">Service Catalogue</h1>
        <p class="text-sm text-[var(--color-text-muted)]">Centralized price catalogue for all services</p>
      </div>
      <Button v-if="can('settings', 'create')" class="bg-[var(--color-primary)] text-white">+ Create Service Plan</Button>
    </div>

    <Card class="p-6">
      <div class="flex gap-3 mb-4 flex-wrap">
        <Input v-model="search" placeholder="Search service name…" class="max-w-sm" />
        <select v-model="categoryFilter" class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Types</option>
          <option value="GENERAL_MAINTENANCE">General Maintenance</option>
          <option value="AIR_CONDITIONING">Air-Conditioning</option>
          <option value="SPECIALIST_DIAGNOSTIC">Specialist Diagnostics</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Card v-for="s in services" :key="s.id" class="p-4">
          <div class="flex items-center justify-between mb-2">
            <Badge variant="outline" class="text-xs">{{ s.category }}</Badge>
            <span :class="s.status === 'ACTIVE' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'" class="text-xs font-medium">● {{ s.status }}</span>
          </div>
          <NuxtLink :to="`/panel/service-catalogue/${s.id}`" class="font-semibold text-[var(--color-primary)] hover:underline block">{{ s.name }}</NuxtLink>
          <p v-if="s.vehicleBrand" class="text-sm text-[var(--color-text-muted)] mt-1">{{ s.vehicleBrand }}</p>
          <p class="font-bold mt-2">RM {{ s.price.toFixed(2) }}</p>
        </Card>
      </div>
    </Card>
  </div>
</template>
