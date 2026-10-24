<script setup lang="ts">
const props = defineProps<{
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  titleId: string
}>()
</script>

<template>
  <section
    :aria-labelledby="props.titleId"
    class="bg-bg-0 pb-16 pt-14 sm:pb-20 sm:pt-16"
  >
    <UiContainer>
      <img
        :src="image"
        :alt="imageAlt"
        width="1080"
        height="444"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        class="aspect-[1080/444] w-full rounded-none object-cover object-center"
      >

      <div class="mx-auto mt-12 max-w-[900px] text-center sm:mt-14">
        <p class="text-[20px] leading-relaxed text-primary-700">
          {{ eyebrow }}
        </p>

        <h1
          :id="props.titleId"
          class="mt-2 text-[48px] font-semibold leading-[1.2] text-primary-500"
        >
          {{ title }}
        </h1>

        <p class="mx-auto mt-6 max-w-[900px] text-[20px] leading-[1.55] text-text-secondary sm:text-[20px]">
          {{ description }}
        </p>
      </div>
    </UiContainer>
  </section>
</template>
