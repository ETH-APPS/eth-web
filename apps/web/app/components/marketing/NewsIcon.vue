<script setup lang="ts">
import newsIconUrl from '~/assets/images/marketing/news.png'

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 20,
})
</script>

<template>
  <img
    :src="newsIconUrl"
    alt=""
    width="512"
    height="512"
    decoding="async"
    aria-hidden="true"
    class="news-icon shrink-0 object-contain transition-[filter] duration-200 motion-reduce:transition-none group-hover/item:brightness-0 group-hover/item:invert group-focus-visible/item:brightness-0 group-focus-visible/item:invert group-active/item:brightness-0 group-active/item:invert"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
</template>

<style scoped>
.news-icon {
  image-rendering: -webkit-optimize-contrast;
}
</style>
