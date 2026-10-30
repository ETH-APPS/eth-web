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
  }>(),
  {
    ariaLabel: 'Statistik layanan ETH Cargo',
    tone: 'muted',
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
    <UiContainer>
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