<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside class="border-b border-border-200 bg-bg-0 px-4 py-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5">
      <NuxtLink to="/dashboard" class="text-base font-semibold text-primary-600">
        ETH Cargo CMS
      </NuxtLink>
      <div class="mt-5 lg:mt-8">
        <CmsNavigation />
      </div>
    </aside>

    <main class="min-w-0 p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>
