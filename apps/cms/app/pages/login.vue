<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Masuk | ETH Cargo CMS' })

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })
const route = useRoute()
const { login, isLoggingIn, loginError } = useAuth()

function validate() {
  errors.email = ''
  errors.password = ''

  if (!email.value.trim()) {
    errors.email = 'Email wajib diisi'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = 'Format email tidak valid'
  }

  if (!password.value) {
    errors.password = 'Password wajib diisi'
  }

  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await login(email.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string'
      && route.query.redirect.startsWith('/')
      && !route.query.redirect.startsWith('//')
      ? route.query.redirect
      : '/dashboard'
    await navigateTo(redirect)
  } catch {
    // Pesan kegagalan disediakan oleh useAuth.
  }
}
</script>

<template>
  <div class="pt-8">
    <div class="text-center">
      <h1 class="text-xl font-semibold text-primary-500">Masuk</h1>
      <p class="mx-auto mt-2 max-w-[290px] text-[13px] leading-[1.5] text-text-tertiary sm:max-w-none">
        Masukkan email dan kata sandi Anda untuk masuk
      </p>
    </div>

    <form class="mt-6 space-y-4" novalidate @submit.prevent="handleSubmit">
      <p v-if="loginError" role="alert" class="rounded-lg border border-error-600 bg-primary-50 px-3 py-2 text-xs text-error-700">
        {{ loginError }}
      </p>
      <div>
        <label for="email" class="mb-2 block text-[13px] font-medium text-text-secondary">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="Masukkan email anda"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          class="h-11 w-full rounded-lg border bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          :class="errors.email ? 'border-error-600' : 'border-border-200'"
        >
        <p v-if="errors.email" id="email-error" class="mt-1.5 text-xs text-error-600">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label for="password" class="mb-2 block text-[13px] font-medium text-text-secondary">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Masukkan password anda"
          :aria-invalid="!!errors.password"
          :aria-describedby="errors.password ? 'password-error' : undefined"
          class="h-11 w-full rounded-lg border bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          :class="errors.password ? 'border-error-600' : 'border-border-200'"
        >
        <p v-if="errors.password" id="password-error" class="mt-1.5 text-xs text-error-600">
          {{ errors.password }}
        </p>
      </div>

      <button
        type="submit"
        :disabled="isLoggingIn"
        class="mt-1 flex min-h-11 w-full items-center justify-center rounded-full bg-primary-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          v-if="isLoggingIn"
          class="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="opacity-75" />
        </svg>
        {{ isLoggingIn ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>
    <p class="mt-5 rounded-full border border-border-200 px-4 py-2.5 text-center text-[13px] font-medium text-primary-500">
      Belum punya akun?
    </p>
    <p class="mt-5 text-center text-[11px] leading-5 text-text-tertiary">
      Akses CMS diberikan oleh tim ETH Cargo.
    </p>
  </div>
</template>
