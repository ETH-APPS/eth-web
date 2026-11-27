<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="rounded-xl border border-border-200 bg-bg-0 p-5 sm:p-6">
    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
      Placeholder UI
    </p>
    <h1 class="mt-2 text-2xl font-semibold text-text-secondary">
      {{ title }}
    </h1>
    <p class="mt-2 max-w-2xl text-sm leading-6 text-text-tertiary">
      {{ description }}
    </p>
    <div class="mt-6 border-t border-border-200 pt-4 text-sm text-text-disable">
      Area ini siap diisi pada fase desain.
    </div>
  </section>
</template>
