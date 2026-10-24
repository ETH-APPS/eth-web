<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import FeaturesMenu from './header-menus/FeaturesMenu.vue'
import InformationMenu from './header-menus/InformationMenu.vue'
import InsightsMenu from './header-menus/InsightsMenu.vue'
import ServicesMenu from './header-menus/ServicesMenu.vue'
import logoUrl from '~/assets/images/brand/logo.png'
import logoWhiteUrl from '~/assets/images/brand/logo-white.png'
import { marketingNavigation, quoteNavigation } from '~/constants/navigation'

const props = withDefaults(defineProps<{
  variant?: 'overlay' | 'light'
}>(), {
  variant: 'overlay',
})

type NavigationLabel = typeof marketingNavigation[number]['label']

const menuComponents: Partial<Record<NavigationLabel, Component>> = {
  Layanan: ServicesMenu,
  Fitur: FeaturesMenu,
  Informasi: InformationMenu,
  Insights: InsightsMenu,
}

const route = useRoute()

const isLight = computed(() => props.variant === 'light')
const isScrolled = ref(false)
const activeMenu = ref<NavigationLabel | null>(null)
let closeMenuTimer: ReturnType<typeof setTimeout> | undefined
let scrollAnimationFrame: number | undefined

const isMenuOpen = computed(() => activeMenu.value !== null)
const useLightStyle = computed(() => (
  isLight.value || isScrolled.value || isMenuOpen.value
))

function updateHeaderStyle() {
  isScrolled.value = window.scrollY > 24
}

function handleScroll() {
  if (scrollAnimationFrame !== undefined) return

  scrollAnimationFrame = requestAnimationFrame(() => {
    updateHeaderStyle()
    scrollAnimationFrame = undefined
  })
}

function getMenuComponent(label: NavigationLabel) {
  return menuComponents[label]
}

function clearCloseMenuTimer() {
  if (!closeMenuTimer) return

  clearTimeout(closeMenuTimer)
  closeMenuTimer = undefined
}

function openMenu(label: NavigationLabel) {
  if (!getMenuComponent(label)) return

  clearCloseMenuTimer()
  activeMenu.value = label
}

function closeMenu(label: NavigationLabel) {
  if (!getMenuComponent(label) || activeMenu.value !== label) return

  clearCloseMenuTimer()

  closeMenuTimer = setTimeout(() => {
    if (activeMenu.value === label) {
      activeMenu.value = null
    }

    closeMenuTimer = undefined
  }, 180)
}

function closeAllMenus() {
  clearCloseMenuTimer()
  activeMenu.value = null
}

function handleMenuClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null

  if (target?.closest('a')) {
    closeAllMenus()
  }
}

function handleMenuFocusOut(label: NavigationLabel, event: FocusEvent) {
  if (!getMenuComponent(label)) return

  const wrapper = event.currentTarget as HTMLElement | null
  const nextTarget = event.relatedTarget as Node | null

  if (wrapper && nextTarget && wrapper.contains(nextTarget)) return

  closeMenu(label)
}

watch(() => route.fullPath, closeAllMenus)

onMounted(() => {
  updateHeaderStyle()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  clearCloseMenuTimer()

  if (scrollAnimationFrame !== undefined) {
    cancelAnimationFrame(scrollAnimationFrame)
  }
})
</script>

<template>
  <header
    class="sticky inset-x-0 top-0 z-30 h-[70px] transition-colors duration-300"
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

      <nav
        aria-label="Navigasi utama"
        class="h-full"
      >
        <ul class="flex h-full items-center gap-8">
          <li
            v-for="item in marketingNavigation"
            :key="item.label"
            class="flex h-full items-center"
            @mouseleave="closeMenu(item.label)"
            @focusout="handleMenuFocusOut(item.label, $event)"
          >
            <NuxtLink
              :to="item.to"
              class="group flex items-center gap-2 rounded-md px-2 py-2 text-sm font-regular transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              :class="activeMenu === item.label
                ? 'text-primary-500 focus-visible:outline-primary-500'
                : useLightStyle
                  ? 'text-slate-700 hover:text-primary-500 focus-visible:outline-primary-500'
                  : 'text-white hover:text-primary-200 focus-visible:outline-white'"
              :aria-haspopup="getMenuComponent(item.label) ? 'true' : undefined"
              :aria-expanded="getMenuComponent(item.label) ? activeMenu === item.label : undefined"
              @mouseenter="openMenu(item.label)"
              @focus="openMenu(item.label)"
            >
              <span>{{ item.label }}</span>

              <svg
                v-if="'hasMenu' in item && item.hasMenu"
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                class="size-4 transition-transform duration-200 group-hover:rotate-180"
                :class="activeMenu === item.label ? 'rotate-180' : ''"
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

            <div
              v-if="getMenuComponent(item.label)"
              class="absolute inset-x-0 top-full border-y border-border-200 bg-white shadow-[0_22px_34px_-12px_rgba(15,23,42,0.28)] transition-[visibility] duration-0 [contain:layout]"
              :class="activeMenu === item.label
                ? 'visible delay-0'
                : 'invisible delay-300'"
              @mouseenter="openMenu(item.label)"
              @focusin="openMenu(item.label)"
              @click="handleMenuClick"
            >
              <div
                class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                :class="activeMenu === item.label
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'"
              >
                <div class="min-h-0 overflow-hidden">
                  <component :is="getMenuComponent(item.label)" />
                </div>
              </div>
            </div>
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
