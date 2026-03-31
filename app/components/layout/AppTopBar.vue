<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'

const { user } = useUserSession()

const displayName = computed(() =>
  user.value ? `${user.value.firstName ?? ''} ${user.value.lastName ?? ''}`.trim() : ''
)

const initials = computed(() =>
  displayName.value ? displayName.value.charAt(0).toUpperCase() : '?'
)
</script>

<template>
  <header class="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-end px-6 flex-shrink-0">
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-sm font-medium text-[var(--color-text)] leading-tight">{{ displayName }}</p>
        <p class="text-xs text-[var(--color-text-muted)] leading-tight">{{ user?.name ?? '' }}</p>
      </div>
      <Avatar>
        <AvatarImage v-if="user?.image" :src="user.image" :alt="displayName" />
        <AvatarFallback class="bg-[var(--color-primary)] text-white text-sm font-semibold">
          {{ initials }}
        </AvatarFallback>
      </Avatar>
    </div>
  </header>
</template>
