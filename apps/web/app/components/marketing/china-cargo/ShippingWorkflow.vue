<script setup lang="ts">
import { ArrowUpRight, Layers3 } from 'lucide-vue-next'

const steps = [
  {
    title: 'Konsultasi & Hitung Estimasi',
    description:
      'Kirim detail kargo (volume/CBM atau berat) dan jenis layanan yang diinginkan. Tim kami akan memberikan penawaran biaya All-In yang transparan.',
  },
  {
    title: 'Pengiriman ke Gudang China',
    description:
      'Supplier Anda mengirimkan barang ke gudang konsolidasi ETH Cargo di China (Guangzhou/Yiwu) lengkap dengan Kode Marking Anda.',
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description:
      'Kami melakukan verifikasi barang, pemuatan ke kontainer/pesawat, dan pengurusan seluruh proses bea cukai serta dokumen kepabeanan.',
  },
  {
    title: 'Tiba di Gudang Indonesia',
    description:
      'Kargo tiba di gudang penyortiran ETH Cargo di Indonesia. Tim logistik melakukan pemeriksaan kondisi barang, pengukuran ulang, dan penimbangan akhir demi kepastian data.',
  },
  {
    title: 'Pengiriman Akhir ke Alamat Anda',
    description:
      'Barang langsung didistribusikan ke alamat gudang, pabrik, atau toko Anda secara aman dan tepat waktu.',
  },
]

// Durasi ini HARUS sama dengan durasi transisi CSS di template:
// garis  -> duration-[400ms]
// bulatan -> duration-300
const LINE_DURATION = 400
const CIRCLE_DURATION = 300

// activeStep  = step yang paling dekat dengan tengah layar (langsung berubah saat scroll)
// lineStep    = jumlah garis yang sudah terisi (garis ke-i terisi kalau i < lineStep)
// circleStep  = bulatan terakhir yang sudah merah (bulatan ke-i merah kalau i <= circleStep)
const activeStep = ref(2)
const lineStep = ref(activeStep.value)
const circleStep = ref(activeStep.value)
const sectionRef = ref<HTMLElement | null>(null)
const stepRefs = ref<(HTMLElement | null)[]>([])
let animationFrame: number | undefined
let isAnimating = false
let isUnmounted = false

function setStepRef(element: unknown, index: number) {
  stepRefs.value[index] = (element as HTMLElement | null) ?? null
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

// Mengejar activeStep satu langkah demi satu langkah.
// Hanya ada SATU loop yang jalan, jadi scroll cepat tidak bisa melewati jeda animasi.
async function syncDisplayToActive() {
  if (isAnimating) {
    return
  }

  isAnimating = true

  while (!isUnmounted && circleStep.value !== activeStep.value) {
    if (circleStep.value < activeStep.value) {
      // Maju: garis terisi dulu, bulatan baru merah setelah garisnya selesai
      lineStep.value = circleStep.value + 1
      await wait(LINE_DURATION)
      circleStep.value += 1
      await wait(CIRCLE_DURATION)
    } else {
      // Mundur: bulatan kembali pudar dulu, baru garisnya menyusut
      circleStep.value -= 1
      await wait(CIRCLE_DURATION)
      lineStep.value = circleStep.value
      await wait(LINE_DURATION)
    }
  }

  isAnimating = false
}

watch(activeStep, syncDisplayToActive)

function updateActiveStep() {
  const section = sectionRef.value

  if (!section) {
    return
  }

  const sectionRect = section.getBoundingClientRect()

  if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
    return
  }

  const viewportCenter = window.innerHeight / 2
  let closestStep = activeStep.value
  let closestDistance = Number.POSITIVE_INFINITY

  stepRefs.value.forEach((step, index) => {
    if (!step) {
      return
    }

    const rect = step.getBoundingClientRect()
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)

    if (distance < closestDistance) {
      closestDistance = distance
      closestStep = index
    }
  })

  activeStep.value = closestStep
}

function handleScroll() {
  cancelAnimationFrame(animationFrame ?? 0)
  animationFrame = requestAnimationFrame(updateActiveStep)
}

function selectStep(index: number) {
  activeStep.value = index
  stepRefs.value[index]?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
  updateActiveStep()
})

onBeforeUnmount(() => {
  isUnmounted = true
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  cancelAnimationFrame(animationFrame ?? 0)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="shipping-workflow"
    aria-labelledby="shipping-workflow-title"
    class="bg-white py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="shipping-workflow-title"
          class="text-[30px] font-semibold leading-tight text-primary-500"
        >
          Cara Kerja Layanan Kargo
        </h2>
        <p class="mx-auto mt-4 max-w-[590px] text-[14px] leading-[1.5] text-slate-500">
          Proses pengiriman kargo yang simpel, transparan, dan terukur dari awal hingga barang tiba
          di gudang Anda.
        </p>
      </div>

      <ol class="mx-auto mt-10 max-w-[610px]">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          :ref="(element) => setStepRef(element, index)"
          class="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 pb-4 last:pb-0"
        >
          <div class="relative flex justify-center">
            <span
              v-if="index < steps.length - 1"
              aria-hidden="true"
              class="absolute left-1/2 top-8 h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 overflow-hidden bg-primary-100"
            >
              <span
                class="block size-full origin-top bg-primary-500 transition-transform duration-[400ms] ease-linear"
                :class="index < lineStep ? 'scale-y-100' : 'scale-y-0'"
              />
            </span>
            <button
              type="button"
              :aria-label="`Tampilkan langkah ${index + 1}: ${step.title}`"
              :aria-pressed="activeStep === index"
              class="relative z-10 flex size-8 items-center justify-center rounded-full text-[15px] font-semibold transition-[background-color,color,transform] duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              :class="index <= circleStep
                ? 'bg-primary-500 text-white'
                : 'bg-primary-50 text-primary-500'"
              @click="selectStep(index)"
            >
              {{ index + 1 }}
            </button>
          </div>

          <button
            type="button"
            class="w-full rounded-xl border p-3 text-left transition-[border-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            :class="activeStep === index
              ? 'border-primary-500 shadow-[0_5px_12px_rgba(15,23,42,0.08)]'
              : 'border-transparent hover:border-primary-100'"
            :aria-pressed="activeStep === index"
            @click="selectStep(index)"
          >
            <span class="flex items-center gap-2.5">
              <Layers3
                :size="21"
                :stroke-width="1.8"
                aria-hidden="true"
                class="shrink-0 text-primary-500"
              />
              <span class="text-[16px] font-medium text-slate-800">
                {{ step.title }}
              </span>
            </span>
            <span class="mt-3 block text-[12px] leading-[1.5] text-slate-700">
              {{ step.description }}
            </span>
          </button>
        </li>
      </ol>

      <div class="mt-10 text-center">
        <p class="text-[12px] text-slate-400">
          Siap memulai pengiriman kargo bisnis Anda hari ini?
        </p>
        <NuxtLink
          to="#quote"
          class="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-[12px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Konsultasi Gratis</span>
          <ArrowUpRight
            :size="16"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>