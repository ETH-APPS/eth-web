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
  }>(),
  {
    ariaLabel: 'Statistik layanan ETH Cargo',
  },
)

const gridClass = computed(() => {
  if (props.stats.length === 4) return 'grid-cols-4'
  if (props.stats.length === 3) return 'grid-cols-3'

  return 'grid-cols-2'
})
</script>

<template>
  <section
    :aria-label="ariaLabel"
    class="bg-bg-100 py-20"
  >
    <UiContainer>
      <dl
        class="mx-auto grid gap-12 text-center"
        :class="gridClass"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
        >
          <dt class="text-[46px] font-bold leading-none text-primary-500">
            {{ stat.value }}
          </dt>

          <dd
            class="mt-3 whitespace-pre-line text-[24px] font-semibold text-slate-800"
            :class="stat.uppercase ? 'uppercase' : ''"
          >
            {{ stat.label }}
          </dd>
        </div>
      </dl>
    </UiContainer>
  </section>
</template>
