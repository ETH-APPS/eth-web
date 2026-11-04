<script setup lang="ts">
import contractIconUrl from '~/assets/images/marketing/contract.png'

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 20,
})
</script>

<template>
  <img
    :src="contractIconUrl"
    alt=""
    width="512"
    height="512"
    decoding="async"
    aria-hidden="true"
    class="contract-icon shrink-0 object-contain transition-[filter] duration-200 motion-reduce:transition-none group-hover/item:brightness-0 group-hover/item:invert group-focus-visible/item:brightness-0 group-focus-visible/item:invert group-active/item:brightness-0 group-active/item:invert"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
</template>

<style scoped>
.contract-icon {
  image-rendering: -webkit-optimize-contrast;
}
</style>
