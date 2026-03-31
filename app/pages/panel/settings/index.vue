<script setup lang="ts">
definePageMeta({ layout: 'panel' })
const { can } = usePermissions()
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Settings</h1>
    <Tabs default-value="organisation">
      <TabsList>
        <TabsTrigger value="organisation">Organisation</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger v-if="can('bay', 'view')" value="bays">Bays</TabsTrigger>
      </TabsList>
      <TabsContent value="organisation">
        <Card class="p-6 mt-4">
          <p class="text-sm text-[var(--color-text-muted)]">Organisation settings coming soon.</p>
        </Card>
      </TabsContent>
      <TabsContent value="members">
        <Card class="p-6 mt-4">
          <p class="text-sm text-[var(--color-text-muted)]">Member management coming soon.</p>
        </Card>
      </TabsContent>
      <TabsContent value="bays">
        <Card class="p-6 mt-4">
          <p class="text-sm text-[var(--color-text-muted)]">Bay management coming soon.</p>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
