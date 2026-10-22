<script setup lang="ts">
import { Cuboid } from 'lucide-vue-next'

const stats = [
  { value: '+10.000', label: 'Pengiriman\nSelesai' },
  { value: '98%', label: 'Tingkat Ketepatan\nWaktu' },
  { value: '+5', label: 'Rute Pengiriman\nInternasional' },
  { value: '+10', label: 'Tahun\nPengalaman' },
]

const benefits = [
  {
    title: 'Biaya Transparan',
    description:
      'Tarif All-In yang ditawarkan di awal bersifat final. Tidak ada biaya siluman, surcharge mendadak, atau komisi tersembunyi saat barang tiba di Indonesia.',
  },
  {
    title: 'Asuransi & Garansi',
    description:
      'Setiap pengiriman kargo dilindungi asuransi menyeluruh. Kami memberikan jaminan ganti rugi 100% untuk keamanan aset dan stok barang bisnis Anda.',
  },
  {
    title: 'Bea Cukai Bebas Repot',
    description:
      'Tim ahli clearance kami mengurus seluruh administrasi, pajak import, hingga dokumen kepabeanan resmi sehingga kargo Anda masuk dengan aman dan legal.',
  },
  {
    title: 'Gudang Strategis',
    description:
      'Fasilitas gudang konsolidasi di titik-titik strategis China untuk mempermudah penerimaan barang dari supplier, inspeksi QC, serta konsolidasi kargo.',
  },
  {
    title: 'Live Tracking 24/7',
    description:
      'Pantau status keberangkatan kapal, posisi kontainer, hingga estimasi waktu tiba secara real-time melalui sistem tracking terintegrasi kami.',
  },
  {
    title: 'Dukungan Tim Profesional',
    description:
      'Nikmati layanan personal dari tim kami yang siap memberikan update berkala dan solusi cepat untuk setiap kebutuhan impor bisnis Anda.',
  },
]
</script>

<template>
  <section
    id="why-us"
    aria-labelledby="why-us-title"
    class="bg-white"
  >
    <div class="bg-primary-500 py-12 text-white">
      <UiContainer>
        <dl class="grid grid-cols-4 gap-8 text-center">
          <div
            v-for="stat in stats"
            :key="stat.label"
          >
            <dt class="text-[56px] font-bold leading-none tracking-tight">
              {{ stat.value }}
            </dt>
            <dd class="mt-4 whitespace-pre-line text-xl font-semibold leading-[1.3]">
              {{ stat.label }}
            </dd>
          </div>
        </dl>
      </UiContainer>
    </div>

    <UiContainer class="py-12">
      <div class="text-center">
        <h2
          id="why-us-title"
          class="text-[32px] font-semibold leading-tight text-primary-500"
        >
          Mengapa Memilih ETH Cargo?
        </h2>
        <p class="mx-auto mt-4 max-w-[850px] text-lg leading-[1.5] text-text-secondary">
          Kami memahami bahwa efisiensi biaya dan kepastian pengiriman adalah kunci
          keberlanjutan bisnis Anda. ETH Cargo menghadirkan solusi pengiriman B2B yang
          transparan, aman, dan tepat waktu.
        </p>
      </div>

      <div class="mx-auto mt-9 grid grid-cols-3 gap-x-9 gap-y-7">
        <article
          v-for="benefit in benefits"
          :key="benefit.title"
          class="rounded-2xl border border-border-200 px-4 pb-8 pt-4 shadow-md"
        >
          <div class="flex items-center gap-3">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Cuboid 
                :size="20"
                :stroke-width="2"
                aria-hidden="true"
              />
            </span>
            <h3 class="text-[17px] font-medium leading-tight text-text-secondary">
              {{ benefit.title }}
            </h3>
          </div>

          <p class="mt-4 border-t border-border-200 pt-4 text-[11.5px] leading-[1.45] text-slate-600">
            {{ benefit.description }}
          </p>
        </article>
      </div>
    </UiContainer>
  </section>
</template>