<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: 'guest' })

const route = useRoute()
const config = useRuntimeConfig()
const token = computed(() => route.query.token as string)

const form = reactive({ password: '', confirmPassword: '' })
const otpStep = ref(false)
const otp = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleReset() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/api/v1/auth/reset-password`, {
      method: 'POST',
      body: { token: token.value, newPassword: form.password, confirmPassword: form.confirmPassword },
      credentials: 'include',
    })
    otpStep.value = true
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Reset failed. Please try again.'
  }
  loading.value = false
}

async function handleOtpVerify() {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/api/v1/auth/verify-otp`, {
      method: 'POST',
      body: { code: otp.value, purpose: 'PASSWORD_RESET' },
      credentials: 'include',
    })
    success.value = true
    setTimeout(() => navigateTo('/login'), 2000)
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Invalid OTP'
  }
  loading.value = false
}
</script>

<template>
  <Card class="p-8 shadow-sm">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-[var(--color-text)]">
        {{ otpStep ? 'Verify your identity' : 'Set new password' }}
      </h1>
    </div>

    <div v-if="success" class="p-4 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
      Password reset successfully. Redirecting to login…
    </div>

    <form v-else-if="!otpStep" class="space-y-4" @submit.prevent="handleReset">
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">New password</label>
        <Input v-model="form.password" type="password" required class="w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Confirm password</label>
        <Input v-model="form.confirmPassword" type="password" required class="w-full" />
      </div>
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Saving…' : 'Set password' }}
      </Button>
    </form>

    <form v-else class="space-y-4" @submit.prevent="handleOtpVerify">
      <p class="text-sm text-[var(--color-text-muted)]">Enter the 6-digit code sent to your email.</p>
      <Input
        v-model="otp"
        type="text"
        placeholder="000000"
        maxlength="6"
        class="w-full text-center tracking-widest text-lg"
      />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Verifying…' : 'Verify' }}
      </Button>
    </form>
  </Card>
</template>
