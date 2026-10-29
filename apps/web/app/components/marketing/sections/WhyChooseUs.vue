<script setup lang="ts">
import { ChevronLeft, ChevronRight, Cuboid } from 'lucide-vue-next'

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

const carouselRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
let observer: IntersectionObserver | undefined

function getStep() {
  const items = carouselRef.value?.children

  if (!items || items.length < 2)
    return 0

  return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft
}

function goToBenefit(index: number) {
  const carousel = carouselRef.value
  const step = getStep()

  if (!carousel || !step)
    return

  const targetIndex = Math.min(Math.max(index, 0), benefits.length - 1)

  carousel.scrollTo({
    left: targetIndex * step,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  const carousel = carouselRef.value

  if (!carousel)
    return

  const items = Array.from(carousel.children)

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting)
        activeIndex.value = items.indexOf(entry.target)
    }
  }, { root: carousel, threshold: 0.6 })

  items.forEach(item => observer?.observe(item))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    id="why-us"
    aria-labelledby="why-us-title"
    class="bg-white"
  >
    <div class="bg-primary-500 py-12 text-white">
      <UiContainer>
        <dl class="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
          >
            <dt class="text-[46px] font-bold leading-none tracking-tight lg:text-[56px]">
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
          class="text-[24px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
        >
          Mengapa Memilih ETH Cargo?
        </h2>
        <p class="mx-auto mt-4 hidden max-w-[850px] text-[16px] leading-[1.5] text-text-secondary md:block lg:text-lg">
          Kami memahami bahwa efisiensi biaya dan kepastian pengiriman adalah kunci
          keberlanjutan bisnis Anda. ETH Cargo menghadirkan solusi pengiriman B2B yang
          transparan, aman, dan tepat waktu.
        </p>
      </div>

      <div
        ref="carouselRef"
        role="group"
        aria-roledescription="carousel"
        aria-label="Keunggulan ETH Cargo"
        class="-mx-1 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:none] md:mx-auto md:mt-9 md:grid md:snap-none md:grid-cols-2 md:gap-x-6 md:gap-y-6 md:overflow-visible md:p-0 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-7 [&::-webkit-scrollbar]:hidden"
      >
        <article
          v-for="(benefit, index) in benefits"
          :key="benefit.title"
          :aria-label="`${index + 1} dari ${benefits.length}`"
          class="w-full shrink-0 snap-center rounded-2xl border border-border-200 px-5 pb-6 pt-5 shadow-md md:w-auto md:shrink lg:px-4 lg:pb-8 lg:pt-4"
        >
          <div class="flex items-center gap-3">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 lg:size-9">
              <Cuboid
                :size="20"
                :stroke-width="2"
                aria-hidden="true"
                class="size-6 lg:size-5"
              />
            </span>
            <h3 class="text-[20px] font-medium leading-tight text-text-secondary lg:text-[17px]">
              {{ benefit.title }}
            </h3>
          </div>

          <p class="mt-4 border-t border-border-200 pt-4 text-[16px] leading-[1.5] text-slate-600 lg:text-[11.5px] lg:leading-[1.45]">
            {{ benefit.description }}
          </p>
        </article>
      </div>

      <div class="mt-6 flex items-center justify-center gap-8 md:hidden">
        <button
          type="button"
          aria-label="Keunggulan sebelumnya"
          :disabled="activeIndex === 0"
          class="grid size-11 place-items-center rounded-xl bg-primary-500 text-white transition-[background-color,opacity] hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
          @click="goToBenefit(activeIndex - 1)"
        >
          <ChevronLeft :size="22" :stroke-width="2" aria-hidden="true" />
        </button>

        <p
          class="min-w-[64px] text-center text-[20px] font-normal tabular-nums text-text-tertiary"
          aria-live="polite"
        >
          <span class="font-semibold text-primary-500">{{ activeIndex + 1 }}</span>
          / {{ benefits.length }}
        </p>

        <button
          type="button"
          aria-label="Keunggulan berikutnya"
          :disabled="activeIndex === benefits.length - 1"
          class="grid size-11 place-items-center rounded-xl bg-primary-500 text-white transition-[background-color,opacity] hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
          @click="goToBenefit(activeIndex + 1)"
        >
          <ChevronRight :size="22" :stroke-width="2" aria-hidden="true" />
        </button>
      </div>
    </UiContainer>
  </section>
</template>