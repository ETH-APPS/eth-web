<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const props = withDefaults(defineProps<{
  sectionId?: string
  title: string
  description: string
  emailLabel?: string
  email: string
  ctaLabel?: string
  ctaTo?: string
  image: string
  imageAlt: string
}>(), {
  sectionId: 'quote',
  emailLabel: 'via Email',
  ctaLabel: 'Get A Quote',
  ctaTo: '#quote',
})

const titleId = computed(() => `${props.sectionId}-title`)
const emailHref = computed(() => `mailto:${props.email}`)
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-primary-600 py-10 text-bg-0 sm:py-12"
  >
    <div class="mx-auto grid w-[calc(100%-2rem)] max-w-[1250px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,532px)]">
      <div>
        <h2
          :id="titleId"
          class="text-[32px] font-bold leading-tight"
        >
          {{ title }}
        </h2>
        <p class="mt-3 text-[20px] font-medium leading-relaxed text-bg-0/95">
          {{ description }}
        </p>

        <div class="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[16px] font-medium text-bg-0/90">
              {{ emailLabel }}
            </p>
            <a
              :href="emailHref"
              class="mt-1.5 inline-flex items-center gap-2 text-[14px] text-bg-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
            >
              <Mail :size="18" :stroke-width="1.8" aria-hidden="true" />
              <span>{{ email }}</span>
            </a>
          </div>

          <NuxtLink
            :to="ctaTo"
            class="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#22c55e] px-6 text-[16px] font-medium text-bg-0 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0 sm:self-auto"
          >
            <span>{{ ctaLabel }}</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="20"
              height="20"
              class="size-5 shrink-0 object-contain"
            >
          </NuxtLink>
        </div>
      </div>

      <div class="aspect-[532/230] overflow-hidden bg-bg-100">
        <img
          :src="image"
          :alt="imageAlt"
          loading="lazy"
          class="size-full object-cover"
        >
      </div>
    </div>
  </section>
</template>