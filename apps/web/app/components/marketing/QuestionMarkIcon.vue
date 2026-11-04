<script setup lang="ts">
import questionMarkIconUrl from '~/assets/images/marketing/question-mark.png'

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 20,
})
</script>

<template>
  <img
    :src="questionMarkIconUrl"
    alt=""
    width="512"
    height="512"
    decoding="async"
    aria-hidden="true"
    class="question-mark-icon shrink-0 object-contain transition-[filter] duration-200 motion-reduce:transition-none group-hover/item:brightness-0 group-hover/item:invert group-focus-visible/item:brightness-0 group-focus-visible/item:invert group-active/item:brightness-0 group-active/item:invert"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
</template>

<style scoped>
.question-mark-icon {
  image-rendering: -webkit-optimize-contrast;
}
</style>
