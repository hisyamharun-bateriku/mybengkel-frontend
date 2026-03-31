<script setup lang="ts">
definePageMeta({ layout: 'panel' })

const route = useRoute()
const $api = useApi()
const { can } = usePermissions()

const service = ref<{ id: string; name: string; category: string; price: number; markupPrice: number; description?: string; status: string } | null>(null)
const saving = ref(false)

onMounted(async () => {
  try {
    service.value = await $api(`/api/v1/service-catalog/${route.params.id}`) as typeof service.value
  } catch {}
})

async function handleSave() {
  if (!service.value) return
  saving.value = true
  try {
    await $api(`/api/v1/service-catalog/${service.value.id}`, { method: 'PATCH', body: service.value })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/panel/service-catalogue" class="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← Service Catalogue</NuxtLink>
    <div v-if="service">
      <h1 class="text-xl font-semibold mb-6">{{ service.name }}</h1>
      <Card class="p-6">
        <div class="space-y-4 max-w-2xl">
          <div class="flex items-center gap-3">
            <Switch :checked="service.status === 'ACTIVE'" :disabled="!can('settings', 'edit')" @update:checked="service!.status = $event ? 'ACTIVE' : 'INACTIVE'" />
            <span class="text-sm font-medium">{{ service.status === 'ACTIVE' ? 'Active' : 'Inactive' }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Service Name</label>
            <Input v-model="service.name" class="w-full" :disabled="!can('settings', 'edit')" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Service Price (RM)</label>
              <Input v-model="service.price" type="number" class="w-full" :disabled="!can('settings', 'edit')" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Markup Price (RM)</label>
              <Input v-model="service.markupPrice" type="number" class="w-full" :disabled="!can('settings', 'edit')" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <Textarea v-model="service.description" class="w-full" :disabled="!can('settings', 'edit')" />
          </div>
          <div v-if="can('settings', 'edit')" class="flex gap-3 justify-end pt-4">
            <NuxtLink to="/panel/service-catalogue"><Button variant="outline">Cancel</Button></NuxtLink>
            <Button class="bg-[var(--color-primary)] text-white" :disabled="saving" @click="handleSave">
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
