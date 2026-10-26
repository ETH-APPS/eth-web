<script setup lang="ts">
const props = defineProps<{
  title: string
  author: string
  updatedAt: string
  releasedAt: string
  image: string
  imageAlt: string
}>()
</script>

<template>
  <section
    aria-labelledby="article-detail-title"
    class="relative min-h-[430px] overflow-hidden bg-slate-900 sm:min-h-[500px]"
  >
    <img
      :src="props.image"
      :alt="props.imageAlt"
      class="absolute inset-0 size-full object-cover"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,26,0.72)_0%,rgba(8,15,26,0.42)_50%,rgba(8,15,26,0.3)_100%)]" />
    <div class="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,15,26,0.5)_0%,transparent_58%)]" />

    <UiContainer class="relative flex min-h-[430px] items-end pb-10 pt-[110px] sm:min-h-[500px] sm:pb-14">
      <div class="max-w-[560px] text-white">
        <h1
          id="article-detail-title"
          class="text-[28px] font-semibold leading-[1.2] sm:text-[34px] lg:text-[38px]"
        >
          {{ props.title }}
        </h1>

        <dl class="mt-7 space-y-3 text-[13px] sm:text-[14px]">
          <div class="grid grid-cols-[70px_18px_1fr] items-center gap-2">
            <dt class="text-white/90">
              Author
            </dt>
            <span class="h-px bg-white/55" aria-hidden="true" />
            <dd class="font-medium">
              {{ props.author }}
            </dd>
          </div>

          <div class="grid grid-cols-[70px_18px_1fr] items-center gap-2">
            <dt class="text-white/90">
              Updated
            </dt>
            <span class="h-px bg-white/55" aria-hidden="true" />
            <dd class="font-medium">
              {{ props.updatedAt }}
            </dd>
          </div>

          <div class="grid grid-cols-[70px_18px_1fr] items-center gap-2">
            <dt class="text-white/90">
              Released
            </dt>
            <span class="h-px bg-white/55" aria-hidden="true" />
            <dd class="font-medium">
              {{ props.releasedAt }}
            </dd>
          </div>
        </dl>
      </div>
    </UiContainer>
  </section>
</template>
