<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import logoUrl from '~/assets/images/brand/logo.png'
import logoWhiteUrl from '~/assets/images/brand/logo-white.png'
import { marketingNavigation, quoteNavigation } from '~/constants/navigation'

const props = withDefaults(defineProps<{
  variant?: 'overlay' | 'light'
}>(), {
  variant: 'overlay',
})

const isLight = computed(() => props.variant === 'light')
const isScrolled = ref(false)
const useLightStyle = computed(() => isLight.value || isScrolled.value)

function updateHeaderStyle() {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  updateHeaderStyle()
  window.addEventListener('scroll', updateHeaderStyle, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeaderStyle)
})
</script>

<template>
  <header
    class="sticky inset-x-0 top-0 z-30 h-[70px] transition-[background-color,box-shadow,backdrop-filter] duration-300"
    :class="[
      props.variant === 'overlay' ? '-mb-[70px]' : '',
      useLightStyle
        ? 'bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]'
        : 'bg-[rgba(17,17,17,0.12)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[3px]',
    ]"
  >
    <UiContainer class="flex h-full items-center justify-between">
      <NuxtLink
        to="/"
        aria-label="ETH Cargo home"
        class="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        :class="useLightStyle ? 'focus-visible:outline-primary-500' : 'focus-visible:outline-white'"
      >
        <img
          :src="useLightStyle ? logoWhiteUrl : logoUrl"
          width="160"
          height="48"
          alt="ETH Cargo"
          class="h-12 w-40 object-contain"
        >
      </NuxtLink>

      <nav aria-label="Navigasi utama">
        <ul class="flex items-center gap-8">
          <li
            v-for="item in marketingNavigation"
            :key="item.label"
          >
            <NuxtLink
              :to="item.to"
              class="group flex items-center gap-2 rounded-sm text-sm font-regular transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              :class="useLightStyle
                ? 'text-slate-700 hover:text-primary-500 focus-visible:outline-primary-500'
                : 'text-white hover:text-primary-200 focus-visible:outline-white'"
            >
              <span>{{ item.label }}</span>

              <svg
                v-if="'hasMenu' in item && item.hasMenu"
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                class="size-4 transition-transform group-hover:translate-y-0.5"
              >
                <path
                  d="m3 6 5 5 5-5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <NuxtLink
        :to="quoteNavigation.to"
        class="flex h-9 shrink-0 items-center gap-1 rounded-lg bg-primary-500 px-3 text-sm text-white shadow-lg shadow-black/10 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4"
        :class="useLightStyle ? 'focus-visible:outline-primary-500' : 'focus-visible:outline-white'"
      >
        <span>{{ quoteNavigation.label }}</span>

        <ArrowUpRight
          aria-hidden="true"
          :size="20"
          :stroke-width="2"
          absolute-stroke-width
        />
      </NuxtLink>
    </UiContainer>
  </header>
</template>
