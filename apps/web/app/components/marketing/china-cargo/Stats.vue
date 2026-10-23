<script setup lang="ts">
const stats = [
  { value: '+10.000', label: 'Pengiriman Sukses' },
  { value: '98%', label: 'Ketepatan Waktu' },
  { value: '+5', label: 'Cakupan Rute Impor' },
]
</script>

<template>
  <section
    aria-label="Statistik layanan ETH Cargo"
    class="bg-bg-100 py-20"
  >
    <UiContainer>
      <dl class="mx-auto grid grid-cols-3 gap-12 text-center">
        <div
          v-for="stat in stats"
          :key="stat.label"
        >
          <dt class="text-[46px] font-bold leading-none text-primary-500">
            {{ stat.value }}
          </dt>
          <dd class="mt-3 text-[24px] font-semibold text-slate-800">
            {{ stat.label }}
          </dd>
        </div>
      </dl>
    </UiContainer>
  </section>
</template>
