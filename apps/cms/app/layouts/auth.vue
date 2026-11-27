<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
    <div class="w-full max-w-md">
      <NuxtLink to="/dashboard" class="mb-6 inline-block text-sm font-semibold text-primary-600">
        ETH Cargo CMS
      </NuxtLink>
      <slot />
    </div>
  </main>
</template>
