<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: 'guest' })

const { login, setSession } = useUserSession()
const { dashboardPath } = usePortal()

const form = reactive({ email: '', password: '' })
const otp = ref('')
const mfaStep = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const res = await login(form.email, form.password)

    if (res.data.mfaRequired) {
      mfaStep.value = true
      loading.value = false
      return
    }

    const u = res.data.user
    setSession(res.data.accessToken, {
      id: u.id,
      email: u.email,
      name: u.name,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phoneNumber,
      role: u.role.toLowerCase(),
      status: 'active',
      baOrganizationId: u.orgId,
      staffId: u.staffId,
      mfaEnabled: u.mfaEnabled,
    })

    navigateTo(u.redirectUrl ?? dashboardPath.value)
  } catch (e: unknown) {
    const msg = (e as { data?: { error?: { message?: string } } })?.data?.error?.message
    error.value = msg ?? 'Invalid credentials'
  }
  loading.value = false
}

async function handleOtpVerify() {
  loading.value = true
  error.value = ''
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/api/v1/auth/verify-otp`, {
      method: 'POST',
      body: { email: form.email, code: otp.value },
    })
    navigateTo(dashboardPath.value)
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message ?? 'Invalid OTP'
  }
  loading.value = false
}
</script>

<template>
  <Card class="p-8 shadow-sm">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-[var(--color-text)]">
        {{ mfaStep ? 'Enter verification code' : 'Sign in to your account' }}
      </h1>
      <p class="text-sm text-[var(--color-text-muted)] mt-1">
        {{ mfaStep ? 'Enter the 6-digit code sent to your email' : 'Enter your email and password to continue' }}
      </p>
    </div>

    <form v-if="!mfaStep" class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
        <Input v-model="form.email" type="email" placeholder="you@example.com" required class="w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Password</label>
        <Input v-model="form.password" type="password" placeholder="••••••••" required class="w-full" />
      </div>
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </Button>
      <div class="text-center pt-2">
        <NuxtLink to="/forgot-password" class="text-sm text-[var(--color-primary)] hover:underline">
          Forgot password?
        </NuxtLink>
      </div>
    </form>

    <form v-else class="space-y-4" @submit.prevent="handleOtpVerify">
      <div>
        <label class="block text-sm font-medium text-[var(--color-text)] mb-1">Verification code</label>
        <Input
          v-model="otp"
          type="text"
          placeholder="000000"
          maxlength="6"
          class="w-full text-center tracking-widest text-lg"
        />
      </div>
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Verifying…' : 'Verify' }}
      </Button>
      <button
        type="button"
        class="w-full text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] pt-1"
        @click="mfaStep = false"
      >
        ← Back to login
      </button>
    </form>
  </Card>
</template>
