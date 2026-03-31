<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: 'guest' })

const config = useRuntimeConfig()
const email = ref('')
const sent = ref(false)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/api/v1/auth/forgot-password`, {
      method: 'POST',
      body: { email: email.value },
      credentials: 'include',
    })
  } catch {
    // Always show success to prevent email enumeration
  }
  sent.value = true
  loading.value = false
}
</script>

<template>
  <Card class="p-8 shadow-sm">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-[var(--color-text)]">Reset your password</h1>
      <p class="text-sm text-[var(--color-text-muted)] mt-1">Enter your email and we'll send you a reset link.</p>
    </div>
    <div v-if="sent" class="p-4 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
      If that email exists, you'll receive a reset link shortly.
    </div>
    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
        <Input v-model="email" type="email" placeholder="you@example.com" required class="w-full" />
      </div>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Sending…' : 'Send reset link' }}
      </Button>
      <div class="text-center pt-2">
        <NuxtLink to="/login" class="text-sm text-[var(--color-primary)] hover:underline">Back to login</NuxtLink>
      </div>
    </form>
  </Card>
</template>
