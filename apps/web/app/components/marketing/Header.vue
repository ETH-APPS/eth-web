<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowUpRight, Menu } from 'lucide-vue-next'
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
const isMobileMenuOpen = ref(false)
let closeMenuTimer: ReturnType<typeof setTimeout> | undefined
let scrollAnimationFrame: number | undefined

const isMenuOpen = computed(() => activeMenu.value !== null)
const useLightStyle = computed(() => (
  isLight.value || isScrolled.value || isMenuOpen.value || isMobileMenuOpen.value
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

function openMobileMenu() {
  closeAllMenus()
  isMobileMenuOpen.value = true
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
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

watch(() => route.fullPath, () => {
  closeAllMenus()
  closeMobileMenu()
})

watch(isMobileMenuOpen, (isOpen) => {
  if (!import.meta.client) return

  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => {
  updateHeaderStyle()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleEscape)
  document.documentElement.style.overflow = ''
  clearCloseMenuTimer()

  if (scrollAnimationFrame !== undefined) {
    cancelAnimationFrame(scrollAnimationFrame)
  }
})
</script>

<template>
  <header
    class="sticky inset-x-0 top-0 z-30 h-16 transition-colors duration-300 lg:h-[70px]"
    :class="[
      props.variant === 'overlay' ? 'lg:-mb-[70px]' : '',
      useLightStyle
        ? 'bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]'
        : 'bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] lg:bg-[rgba(17,17,17,0.12)] lg:shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:backdrop-blur-[3px]',
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
          :src="logoWhiteUrl"
          width="128"
          height="40"
          alt="ETH Cargo"
          class="h-10 w-32 object-contain object-left lg:hidden"
        >
        <img
          :src="useLightStyle ? logoWhiteUrl : logoUrl"
          width="160"
          height="48"
          alt="ETH Cargo"
          class="hidden h-12 w-40 object-contain lg:block"
        >
      </NuxtLink>

      <nav
        aria-label="Navigasi utama"
        class="hidden h-full lg:block"
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
        class="hidden h-9 shrink-0 items-center gap-1 rounded-lg bg-primary-500 px-3 text-sm text-white shadow-lg shadow-black/10 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 lg:flex"
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

      <button
        type="button"
        aria-label="Buka menu navigasi"
        aria-controls="mobile-navigation"
        :aria-expanded="isMobileMenuOpen"
        class="flex size-11 items-center justify-center rounded-lg text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
        @click="openMobileMenu"
      >
        <Menu :size="27" :stroke-width="2" aria-hidden="true" />
      </button>
    </UiContainer>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-250 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-if="isMobileMenuOpen"
          id="mobile-navigation"
          class="fixed inset-0 z-[100] overflow-y-auto bg-bg-0 lg:hidden"
        >
          <MarketingMobileNavigation @close="closeMobileMenu" />
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
