<script setup lang="ts">
interface ServiceStat {
  value: string
  label: string
  uppercase?: boolean
}

const props = withDefaults(
  defineProps<{
    stats: readonly ServiceStat[]
    ariaLabel?: string
    tone?: 'muted' | 'primary'
    mobileMarquee?: boolean
  }>(),
  {
    ariaLabel: 'Statistik layanan ETH Cargo',
    tone: 'muted',
    mobileMarquee: false,
  },
)

const gridClass = computed(() => {
  if (props.stats.length === 4) return 'grid-cols-4'
  if (props.stats.length === 3) return 'grid-cols-3'

  return 'grid-cols-2'
})

const sectionClass = computed(() => (
  props.tone === 'primary' ? 'bg-primary-500' : 'bg-bg-100'
))

const valueClass = computed(() => (
  props.tone === 'primary' ? 'text-white' : 'text-primary-500'
))

const labelClass = computed(() => (
  props.tone === 'primary' ? 'text-white' : 'text-slate-800'
))
</script>

<template>
  <section
    :aria-label="ariaLabel"
    class="py-20"
    :class="sectionClass"
  >
    <div v-if="mobileMarquee" class="stats-marquee overflow-hidden lg:hidden">
      <div class="stats-track flex w-max">
        <dl
          v-for="copy in 2"
          :key="copy"
          class="stats-group flex shrink-0 items-start gap-8 pr-8 text-center"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <div v-for="stat in stats" :key="stat.label" class="w-[200px] shrink-0">
            <dt class="text-[46px] font-bold leading-none" :class="valueClass">
              {{ stat.value }}
            </dt>
            <dd
              class="mt-3 whitespace-pre-line text-[20px] font-semibold"
              :class="[labelClass, stat.uppercase ? 'uppercase' : '']"
            >
              {{ stat.label }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <UiContainer :class="mobileMarquee ? 'hidden lg:block' : ''">
      <dl class="flex flex-col items-center justify-between gap-12 text-center lg:flex-row lg:items-start lg:gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="w-full lg:w-auto"
        >
          <dt
            class="text-[46px] font-bold leading-none"
            :class="valueClass"
          >
            {{ stat.value }}
          </dt>

          <dd
            class="mt-3 whitespace-pre-line text-[20px] font-semibold lg:text-[24px]"
            :class="[
              labelClass,
              stat.uppercase ? 'uppercase' : '',
            ]"
          >
            {{ stat.label }}
          </dd>
        </div>
      </dl>
    </UiContainer>
  </section>
</template>

<style scoped>
.stats-track {
  animation: stats-scroll 28s linear infinite;
}

.stats-marquee:hover .stats-track {
  animation-play-state: paused;
}

@keyframes stats-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stats-marquee {
    overflow-x: auto;
  }

  .stats-track {
    animation: none;
  }

  .stats-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
