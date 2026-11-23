<script setup lang="ts">
const props = defineProps<{
  title: string
  author: string
  authorTo?: string
  updatedAt: string
  releasedAt: string
  image: string
  imageAlt: string
}>()
</script>

<template>
  <section
    aria-labelledby="article-detail-title"
    class="relative min-h-[220px] overflow-hidden bg-slate-900 lg:min-h-[540px]"
  >
    <img
      :src="props.image"
      :alt="props.imageAlt"
      class="absolute inset-0 size-full object-cover"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,26,0.56)_0%,rgba(8,15,26,0.3)_50%,rgba(8,15,26,0.18)_100%)]" />
    <div class="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,15,26,0.34)_0%,transparent_58%)]" />

    <UiContainer class="relative flex min-h-[220px] items-end pb-4 pt-5 lg:min-h-[540px] lg:pb-14 lg:pt-[110px]">
      <div class="max-w-[720px] text-white">
        <h1
          id="article-detail-title"
          class="text-[20px] font-bold leading-[1.2] lg:text-[32px]"
        >
          {{ props.title }}
        </h1>

        <dl class="mt-3 space-y-0 text-[14px] lg:mt-7 lg:space-y-3 lg:text-[16px]">
          <!-- <div class="grid grid-cols-[70px_18px_1fr] items-center gap-2">
            <dt class="text-white/90">
              Author
            </dt>
            <span class="h-px bg-white/55" aria-hidden="true" />
            <dd class="font-medium">
              <NuxtLink
                v-if="props.authorTo"
                :to="props.authorTo"
                class="inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:min-h-0"
              >
                {{ props.author }}
              </NuxtLink>
              <span v-else>{{ props.author }}</span>
            </dd>
          </div> -->

          <div class="grid grid-cols-[max-content_18px_minmax(0,1fr)] items-center gap-2">
            <dt class="whitespace-nowrap text-white/90">
              Terakhir Diperbarui
            </dt>
            <span class="h-px bg-white/55" aria-hidden="true" />
            <dd class="font-medium">
              {{ props.updatedAt }}
            </dd>
          </div>

          <div class="grid grid-cols-[max-content_18px_minmax(0,1fr)] items-center gap-2">
            <dt class="whitespace-nowrap text-white/90">
              Diterbitkan
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
