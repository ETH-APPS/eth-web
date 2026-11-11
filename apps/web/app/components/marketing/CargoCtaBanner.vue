<script setup lang="ts">
import backgroundImage from '~/assets/images/marketing/cargo-cta-background.png'
import containerImage from '~/assets/images/marketing/cargo-cta-container.png'

const props = defineProps<{
  title: string
  description: string
  email: string
  ctaLabel: string
  ctaTo: string
  estimateTo?: string
}>()
</script>

<template>
  <MarketingIllustratedCtaBanner
    v-bind="props"
    variant="background"
    :background-image="backgroundImage"
    :image="containerImage"
    :image-width="369"
    :image-height="349"
    :image-right-offset="24"
    shift-image-left-on-wide-screens
    image-alt="Kontainer kargo yang diangkat forklift"
  />
</template>
