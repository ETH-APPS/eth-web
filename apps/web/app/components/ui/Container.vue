<script setup lang="ts">
defineProps<{ wide?: boolean }>()
</script>

<template>
  <div class="mx-auto w-[calc(100%-2rem)]" :class="wide ? 'max-w-[1250px]' : 'max-w-[1080px]'">
    <slot />
  </div>
</template>
