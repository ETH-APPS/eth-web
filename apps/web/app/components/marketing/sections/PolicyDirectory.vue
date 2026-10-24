<script setup lang="ts">
import {
  ChevronRight,
  ClipboardList,
  Package,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-vue-next'

type PolicyIcon = 'document' | 'package' | 'privacy' | 'shopping'

interface PolicyDirectoryGroup {
  title: string
  items: readonly {
    label: string
    icon: PolicyIcon
    featured?: boolean
  }[]
}

const props = withDefaults(defineProps<{
  title?: string
  description: string
  groups: readonly PolicyDirectoryGroup[]
}>(), {
  title: 'Legalities',
})

const policyIcons = {
  document: ClipboardList,
  package: Package,
  privacy: ShieldCheck,
  shopping: ShoppingBag,
}

function policyIcon(icon: PolicyIcon) {
  return policyIcons[icon]
}
</script>

<template>
  <section class="bg-bg-100 py-10 sm:py-14">
    <UiContainer>
      <div class="rounded-[20px] bg-bg-0 px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-[11px] text-text-disable">
          <span>Home</span>
          <ChevronRight :size="13" aria-hidden="true" />
          <span>Information</span>
          <ChevronRight :size="13" aria-hidden="true" />
          <span class="font-medium text-primary-500">Legals</span>
        </nav>

        <header class="mx-auto mt-12 max-w-[760px] text-center">
          <h1 class="text-[30px] font-semibold leading-tight text-primary-500 sm:text-[34px]">
            {{ title }}
          </h1>
          <p class="mt-5 text-[16px] leading-[1.55] text-text-tertiary sm:text-[18px]">
            {{ description }}
          </p>
        </header>

        <div class="mx-auto mt-12 max-w-[980px] space-y-8">
          <section
            v-for="(group, groupIndex) in groups"
            :key="group.title"
            :aria-labelledby="`legalities-group-${groupIndex}`"
          >
            <h2
              :id="`legalities-group-${groupIndex}`"
              class="mb-4 text-[18px] font-medium text-text-secondary"
            >
              {{ group.title }}
            </h2>

            <div class="grid gap-x-7 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="(item, itemIndex) in group.items"
                :key="`${groupIndex}-${itemIndex}-${item.label}`"
                class="flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-[13px]"
                :class="item.featured
                  ? 'border border-border-200 bg-bg-0 text-primary-500 shadow-[0_5px_12px_rgba(15,23,42,0.10)]'
                  : 'text-text-secondary'"
              >
                <span class="flex min-w-0 items-center gap-3">
                  <component
                    :is="policyIcon(item.icon)"
                    :size="17"
                    :stroke-width="1.7"
                    aria-hidden="true"
                    class="shrink-0 text-text-tertiary"
                  />
                  <span>{{ item.label }}</span>
                </span>
                <ChevronRight
                  v-if="item.featured"
                  :size="15"
                  aria-hidden="true"
                  class="shrink-0"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
