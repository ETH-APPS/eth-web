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
  }[]
}

const props = withDefaults(defineProps<{
  title?: string
  description: string
  groups: readonly PolicyDirectoryGroup[]
}>(), {
  title: 'Legalities',
})

const activeMobileItem = ref<string | null>(null)

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
  <section class="bg-bg-100 py-0 lg:py-14">
    <UiContainer>
      <div class="-mx-4 rounded-none bg-bg-0 px-4 py-8 sm:px-6 sm:py-12 lg:mx-0 lg:rounded-[20px] lg:px-16 lg:py-14">
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

            <div class="grid gap-x-7 gap-y-4 lg:grid-cols-3 lg:gap-y-3">
              <button
                v-for="(item, itemIndex) in group.items"
                :key="`${groupIndex}-${itemIndex}-${item.label}`"
                type="button"
                class="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-5 py-3 text-left text-[16px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:hidden"
                :class="activeMobileItem === `${groupIndex}-${itemIndex}`
                  ? 'bg-primary-500 text-bg-0'
                  : 'bg-bg-0 text-text-secondary'"
                :aria-pressed="activeMobileItem === `${groupIndex}-${itemIndex}`"
                @click="activeMobileItem = `${groupIndex}-${itemIndex}`"
              >
                <span class="flex min-w-0 items-center gap-3">
                  <component
                    :is="policyIcon(item.icon)"
                    :size="20"
                    :stroke-width="1.7"
                    aria-hidden="true"
                    class="shrink-0"
                    :class="activeMobileItem === `${groupIndex}-${itemIndex}` ? 'text-bg-0' : 'text-text-tertiary'"
                  />
                  <span>{{ item.label }}</span>
                </span>
                <ChevronRight
                  v-if="activeMobileItem === `${groupIndex}-${itemIndex}`"
                  :size="20"
                  aria-hidden="true"
                  class="shrink-0 text-bg-0"
                />
              </button>

              <div
                v-for="(item, itemIndex) in group.items"
                :key="`desktop-${groupIndex}-${itemIndex}-${item.label}`"
                class="group hidden min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-bg-0 px-4 py-3 text-[13px] text-text-secondary transition-[border-color,box-shadow,color] duration-200 ease-out hover:border-border-200 hover:text-primary-500 hover:shadow-[0_5px_12px_rgba(15,23,42,0.10)] motion-reduce:transition-none sm:max-w-[250px] lg:flex"
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
                  :size="15"
                  aria-hidden="true"
                  class="shrink-0 -translate-x-1 text-primary-500 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:transform-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
