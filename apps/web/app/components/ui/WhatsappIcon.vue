<script setup lang="ts">
import whatsappIcon from '~/assets/images/marketing/whatsapp.png'
</script>

<template>
  <span
    aria-hidden="true"
    class="inline-block shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
    :style="{ maskImage: `url(${whatsappIcon})`, WebkitMaskImage: `url(${whatsappIcon})` }"
  />
</template>
