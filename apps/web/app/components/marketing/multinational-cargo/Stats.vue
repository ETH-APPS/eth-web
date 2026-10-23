<script setup lang="ts">
const stats = [
  { value: '+10.000', label: 'Shipment\nCompleted', uppercase: true },
  { value: '98%', label: 'Completion\nRate', uppercase: true },
  { value: '+7', label: 'Countries\nShipping', uppercase: true },
  { value: '+10', label: 'Years of\nExperiences', uppercase: false },
]
</script>

<template>
  <section
    aria-label="Multinational cargo service statistics"
    class="bg-bg-100 py-12"
  >
    <UiContainer>
      <dl class="mx-auto grid max-w-[865px] grid-cols-4 gap-12 text-center">
        <div
          v-for="stat in stats"
          :key="stat.label"
        >
          <dt class="text-[30px] font-semibold leading-none text-primary-500">
            {{ stat.value }}
          </dt>

          <dd
            class="mt-3 whitespace-pre-line text-[14px] font-semibold leading-[1.35] text-slate-800"
            :class="stat.uppercase ? 'uppercase' : ''"
          >
            {{ stat.label }}
          </dd>
        </div>
      </dl>
    </UiContainer>
  </section>
</template>
