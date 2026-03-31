<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: false })

const route = useRoute()
const config = useRuntimeConfig()
const token = route.params.token as string

const invitation = ref<{ name: string; email: string; role: string; organisationName: string } | null>(null)
const form = reactive({ password: '', confirmPassword: '' })
const otpStep = ref(false)
const otp = ref('')
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    invitation.value = (await $fetch(`${config.public.apiBase}/api/v1/auth/invitation/${token}`, {
      credentials: 'include',
    })) as typeof invitation.value
  } catch {
    error.value = 'Invalid or expired invitation link.'
  }
})

async function handleSetup() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/api/v1/auth/setup-password`, {
      method: 'POST',
      body: { token, password: form.password, confirmPassword: form.confirmPassword },
      credentials: 'include',
    })
    otpStep.value = true
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Setup failed'
  }
  loading.value = false
}

async function handleOtpVerify() {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${config.public.apiBase}/api/v1/auth/verify-otp`, {
      method: 'POST',
      body: { code: otp.value, purpose: 'ACCOUNT_ACTIVATION' },
      credentials: 'include',
    })
    navigateTo('/login')
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
        {{ otpStep ? 'Activate your account' : 'Set up your password' }}
      </h1>
      <p v-if="invitation && !otpStep" class="text-sm text-[var(--color-text-muted)] mt-1">
        Welcome, {{ invitation.name }}. You've been invited to
        <strong>{{ invitation.organisationName }}</strong> as {{ invitation.role }}.
      </p>
    </div>

    <div v-if="error && !invitation && !otpStep" class="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
      {{ error }}
    </div>

    <form v-else-if="!otpStep" class="space-y-4" @submit.prevent="handleSetup">
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Password</label>
        <Input v-model="form.password" type="password" required class="w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Confirm password</label>
        <Input v-model="form.confirmPassword" type="password" required class="w-full" />
      </div>
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading || !invitation">
        {{ loading ? 'Saving…' : 'Set password' }}
      </Button>
    </form>

    <form v-else class="space-y-4" @submit.prevent="handleOtpVerify">
      <p class="text-sm text-[var(--color-text-muted)]">Enter the 6-digit activation code sent to your email.</p>
      <Input
        v-model="otp"
        type="text"
        placeholder="000000"
        maxlength="6"
        class="w-full text-center tracking-widest text-lg"
      />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Activating…' : 'Activate account' }}
      </Button>
    </form>
  </Card>
</template>
