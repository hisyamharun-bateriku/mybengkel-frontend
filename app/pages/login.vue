<script setup lang="ts">
definePageMeta({ layout: 'auth', auth: 'guest' })

const { signIn, client } = useUserSession()
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
    await signIn.email(
      { email: form.email, password: form.password },
      {
        onSuccess: () => navigateTo(dashboardPath.value),
        onError: (ctx: { error: { status?: number; message?: string } }) => {
          if (ctx.error.status === 302 || ctx.error.message?.includes('two_factor')) {
            mfaStep.value = true
          } else {
            error.value = ctx.error.message ?? 'Invalid credentials'
          }
        },
      },
    )
  } catch {
    error.value = 'An unexpected error occurred'
  }
  loading.value = false
}

async function handleOtpVerify() {
  loading.value = true
  error.value = ''
  try {
    await client?.twoFactor.verifyOtp({ code: otp.value })
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
