<template>
  <main class="flex min-h-dvh items-center justify-center bg-bg-0 px-4 py-8 sm:px-6">
    <div class="w-full max-w-[440px] rounded-2xl border border-border-200 bg-bg-0 px-5 py-7 sm:px-8 sm:py-9">
      <header class="flex justify-center">
        <img src="/logo.png" alt="ETH Cargo" width="192" height="58" class="h-auto w-48">
      </header>
      <slot />
    </div>
  </main>
</template>
