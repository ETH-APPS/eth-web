<script setup lang="ts">
import { ChevronDown, ChevronUp, Plane, Ship } from 'lucide-vue-next'
import packageSearchIcon from '~/assets/icons/package-search.png?no-inline'

const steps = [
  {
    title: 'Konsultasi & Minta Penawaran',
    description:
      'Kirimkan detail barang, volume/berat kargo, serta alamat tujuan. Tim kami akan memberikan kalkulasi biaya All-In yang rinci dan transparan tanpa biaya tersembunyi.',
  },
  {
    title: 'Pengiriman ke Gudang China',
    description:
      'Kirim barang dari supplier ke gudang ETH Cargo di China (Guangzhou/Yiwu) menggunakan Kode Marking untuk proses pencatatan dan verifikasi.',
  },
  {
    title: 'Pengiriman Kargo & Clearance',
    description:
      'Barang dimuat ke kontainer/pesawat. Tim kami mengurus proses pengiriman internasional beserta seluruh administrasi bea cukai (customs clearance) hingga resmi masuk Indonesia.',
  },
  {
    title: 'Tiba di Gudang Indonesia',
    description:
      'Kargo tiba di gudang penyortiran ETH Cargo di Indonesia. Tim logistik melakukan pemeriksaan kondisi barang, pengukuran ulang, dan penimbangan akhir demi kepastian data.',
  },
  {
    title: 'Pengiriman ke Alamat Anda',
    description:
      'Kargo siap didistribusikan langsung sampai ke alamat gudang, pabrik, atau toko Anda secara aman dengan opsi pembayaran yang disepakati.',
  },
]

const activeStep = ref(0)
const cardRefs = ref<(HTMLElement | null)[]>([])
const stepsViewportRef = ref<HTMLElement | null>(null)
const bottomPadding = ref(0)
let scrollAnimationFrame: number | undefined
let stepsResizeObserver: ResizeObserver | undefined

function setCardRef(el: unknown, index: number) {
  cardRefs.value[index] = (el as HTMLElement | null) ?? null
}

function updateBottomPadding() {
  const viewport = stepsViewportRef.value
  const lastCard = cardRefs.value[steps.length - 1]
  if (!viewport || !lastCard)
    return

  bottomPadding.value = Math.max(0, viewport.clientHeight - lastCard.offsetHeight)
}

function selectStep(index: number) {
  const viewport = stepsViewportRef.value
  if (!viewport)
    return

  const targetStep = Math.min(Math.max(index, 0), steps.length - 1)
  const card = cardRefs.value[targetStep]
  if (!card)
    return

  activeStep.value = targetStep
  viewport.scrollTo({
    top: card.offsetTop,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

function updateStepFromLocalScroll() {
  const viewport = stepsViewportRef.value
  if (!viewport)
    return

  const nearestStep = cardRefs.value.reduce((nearest, card, index) => {
    const nearestCard = cardRefs.value[nearest]
    if (!card || !nearestCard)
      return nearest

    return Math.abs(card.offsetTop - viewport.scrollTop)
      < Math.abs(nearestCard.offsetTop - viewport.scrollTop)
      ? index
      : nearest
  }, 0)

  activeStep.value = nearestStep
}

function handleStepsScroll() {
  if (scrollAnimationFrame !== undefined)
    return

  scrollAnimationFrame = requestAnimationFrame(() => {
    updateStepFromLocalScroll()
    scrollAnimationFrame = undefined
  })
}

function handleNavigationKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectStep(activeStep.value - 1)
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectStep(activeStep.value + 1)
  }
}

onMounted(() => {
  updateBottomPadding()
  stepsResizeObserver = new ResizeObserver(updateBottomPadding)
  if (stepsViewportRef.value)
    stepsResizeObserver.observe(stepsViewportRef.value)
  for (const card of cardRefs.value) {
    if (card)
      stepsResizeObserver.observe(card)
  }
})

onBeforeUnmount(() => {
  stepsResizeObserver?.disconnect()
  if (scrollAnimationFrame !== undefined)
    cancelAnimationFrame(scrollAnimationFrame)
})
</script>

<template>
  <div
    id="alur-pengiriman"
    class="relative mt-8 bg-white"
  >
    <section
      aria-labelledby="shipping-flow-title"
      class="bg-white py-16"
    >
    <UiContainer>
      <div class="text-center">
        <h2
          id="shipping-flow-title"
          class="text-[24px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
        >
          Alur Pengiriman Import B2B
        </h2>
        <p class="mx-auto mt-6 hidden max-w-[920px] text-[16px] leading-[1.45] text-text-secondary md:block lg:text-[20px]">
          Hanya dalam 5 langkah mudah, kelola seluruh proses import barang bisnis Anda dari China
          hingga tiba di depan pintu gudang.
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-[1000px] grid-cols-[24px_minmax(0,1fr)] gap-x-2 gap-y-6 md:mt-14 lg:grid-cols-[380px_64px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div class="hidden md:col-span-2 md:block md:max-w-[380px] lg:col-span-1 lg:max-w-none">
          <div class="rounded-[22px] border border-border-200 bg-white p-4 shadow-[0_5px_12px_rgba(15,23,42,0.10)]">
            <h3 class="text-[20px] font-medium leading-tight text-text-secondary">
              Estimasi Ketibaan Cargo
            </h3>

            <div class="mt-4 space-y-4">
              <div>
                <div class="flex items-center gap-3">
                  <span class="flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <Ship
                      :size="18"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                  </span>
                  <p class="text-[16px] font-medium text-text-secondary">
                    Kargo Laut (Sea Freight)
                  </p>
                </div>
                <p class="mt-2 text-[12.5px] text-text-disable">
                  Estimasi&nbsp; — &nbsp;<span class="text-text-tertiary">3 - 4 Minggu</span>
                </p>
              </div>

              <div>
                <div class="flex items-center gap-3">
                  <span class="flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <Plane
                      :size="18"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                  </span>
                  <p class="text-[17px] font-medium text-text-secondary">
                    Kargo Udara (Air Freight)
                  </p>
                </div>
                <p class="mt-2 text-[12.5px] text-text-disable">
                  Estimasi&nbsp; — &nbsp;<span class="text-text-tertiary">± 7 Hari</span>
                </p>
              </div>
            </div>
          </div>

          <p class="mt-4 text-[12.5px] text-text-disable">
            Sudah punya kode marking?&nbsp; — &nbsp;
            <NuxtLink
              to="/live-tracking"
              class="inline-flex items-center gap-1 text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              Lacak
              <img :src="packageSearchIcon" alt="" aria-hidden="true" width="16" height="16" loading="lazy" class="size-4 object-contain">
            </NuxtLink>
          </p>
        </div>

        <div
          class="flex flex-col items-center justify-center gap-4 lg:h-[232px] lg:justify-between lg:gap-0 lg:py-6"
          role="group"
          aria-label="Navigasi langkah pengiriman"
          @keydown="handleNavigationKeydown"
        >
          <button
            type="button"
            aria-label="Langkah sebelumnya"
            class="hidden rounded-full p-1 text-primary-500 transition-colors hover:bg-primary-50 lg:block"
            @click="selectStep(activeStep - 1)"
          >
            <ChevronUp
              :size="18"
              :stroke-width="2"
              aria-hidden="true"
            />
          </button>

          <div class="flex flex-col items-center gap-4 lg:gap-2.5">
            <button
              v-for="(_, index) in steps"
              :key="index"
              type="button"
              :aria-label="`Tampilkan langkah ${index + 1}`"
              :aria-current="activeStep === index ? 'step' : undefined"
              class="relative size-2 rounded-full transition-[background-color,transform] duration-200 after:absolute after:-inset-2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:size-2.5 lg:after:content-none"
              :class="activeStep === index ? 'scale-110 bg-primary-500' : 'bg-border-200 hover:bg-primary-200'"
              @click="selectStep(index)"
            />
          </div>

          <button
            type="button"
            aria-label="Langkah berikutnya"
            class="hidden rounded-full p-1 text-primary-500 transition-colors hover:bg-primary-50 lg:block"
            @click="selectStep(activeStep + 1)"
          >
            <ChevronDown
              :size="18"
              :stroke-width="2"
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          ref="stepsViewportRef"
          class="shipping-flow-steps h-[260px] min-w-0 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] lg:h-[296px]"
          tabindex="0"
          role="region"
          aria-label="Daftar langkah pengiriman. Gulir daftar ini atau gunakan tombol panah untuk berpindah langkah."
          @keydown="handleNavigationKeydown"
          @scroll.passive="handleStepsScroll"
        >
          <div
            class="relative space-y-4"
            :style="{ paddingBottom: `${bottomPadding}px` }"
          >
            <article
              v-for="(step, index) in steps"
              :key="step.title"
              :ref="(el) => setCardRef(el, index)"
              class="rounded-[22px] border bg-white p-[18px] transition-[border-color,box-shadow] duration-300 lg:p-5"
              :class="activeStep === index
                ? 'border-primary-500 shadow-[0_5px_12px_rgba(15,23,42,0.10)]'
                : 'border-border-200'"
            >
              <div class="flex items-center gap-3 text-[14px] font-normal text-primary-500">
                <span>Langkah</span>
                <span class="flex size-9 items-center justify-center rounded-[16px] bg-primary-50 text-[20px] font-semibold">
                  {{ index + 1 }}
                </span>
              </div>

              <h3 class="mt-4 text-[16px] font-medium leading-tight text-text-secondary lg:text-[21px]">
                {{ step.title }}
              </h3>
              <p class="mt-3 text-[12px] leading-[1.5] text-text-tertiary lg:text-[13.5px] lg:leading-[1.45]">
                {{ step.description }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </UiContainer>
    </section>
  </div>
</template>

<style scoped>
.shipping-flow-steps {
  scrollbar-width: none;
}

.shipping-flow-steps::-webkit-scrollbar {
  display: none;
}
</style>
