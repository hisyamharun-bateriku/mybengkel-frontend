<script setup lang="ts">
definePageMeta({ layout: 'partner' })
const { can } = usePermissions()
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Settings</h1>
    <Tabs default-value="organisation">
      <TabsList>
        <TabsTrigger value="organisation">Organisation</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="organisation">
        <Card class="p-6 mt-4">
          <p class="text-sm text-[var(--color-text-muted)]">Partner organisation settings coming soon.</p>
        </Card>
      </TabsContent>
      <TabsContent value="members">
        <Card class="p-6 mt-4">
          <p class="text-sm text-[var(--color-text-muted)]">Member management coming soon.</p>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
