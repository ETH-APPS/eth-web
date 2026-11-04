<script setup lang="ts">
import moneyRangeIconUrl from '~/assets/images/marketing/money-range.png'
</script>

<template>
  <img
    :src="moneyRangeIconUrl"
    alt=""
    width="64"
    height="64"
    decoding="async"
    aria-hidden="true"
    class="money-range-icon shrink-0 object-contain transition-[filter] duration-200 motion-reduce:transition-none group-hover/item:brightness-0 group-hover/item:invert group-focus-visible/item:brightness-0 group-focus-visible/item:invert group-active/item:brightness-0 group-active/item:invert"
  >
</template>

<style scoped>
.money-range-icon {
  image-rendering: -webkit-optimize-contrast;
}
</style>
