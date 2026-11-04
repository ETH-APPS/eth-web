<script setup lang="ts">
import shippingContainerIconUrl from '~/assets/images/marketing/shipping-container.png'
</script>

<template>
  <img
    :src="shippingContainerIconUrl"
    alt=""
    width="512"
    height="512"
    decoding="async"
    aria-hidden="true"
    class="shipping-container-icon shrink-0 object-contain transition-[filter] duration-200 motion-reduce:transition-none group-hover/item:brightness-0 group-hover/item:invert group-focus-visible/item:brightness-0 group-focus-visible/item:invert group-active/item:brightness-0 group-active/item:invert"
  >
</template>

<style scoped>
.shipping-container-icon {
  image-rendering: -webkit-optimize-contrast;
}
</style>
