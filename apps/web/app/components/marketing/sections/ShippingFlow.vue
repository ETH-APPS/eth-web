<script setup lang="ts">
import { ChevronsDown, ChevronDown, ChevronUp, Plane, Ship } from 'lucide-vue-next'

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
const stepViewportRef = ref<HTMLElement | null>(null)
let wheelLocked = false
let wheelTimer: ReturnType<typeof setTimeout> | undefined

function setCardRef(el: unknown, index: number) {
  cardRefs.value[index] = (el as HTMLElement | null) ?? null
}

const trackStyle = computed(() => {
  const offset = cardRefs.value[activeStep.value]?.offsetTop ?? 0

  return {
    '--step-offset': `-${offset}px`,
  }
})

function selectStep(index: number) {
  activeStep.value = (index + steps.length) % steps.length

  if (window.matchMedia('(max-width: 1023px)').matches) {
    stepViewportRef.value?.scrollTo({
      top: cardRefs.value[activeStep.value]?.offsetTop ?? 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }
}

function handleStepScroll(event: Event) {
  if (window.matchMedia('(min-width: 1024px)').matches)
    return

  const scrollTop = (event.currentTarget as HTMLElement).scrollTop
  let nearestStep = 0
  let nearestDistance = Infinity

  cardRefs.value.forEach((card, index) => {
    if (!card)
      return

    const distance = Math.abs(card.offsetTop - scrollTop)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestStep = index
    }
  })

  activeStep.value = nearestStep
}

function handleWheel(event: WheelEvent) {
  if (window.matchMedia('(max-width: 1023px)').matches)
    return

  event.preventDefault()

  if (wheelLocked || Math.abs(event.deltaY) < 10) {
    return
  }

  selectStep(activeStep.value + (event.deltaY > 0 ? 1 : -1))
  wheelLocked = true
  wheelTimer = setTimeout(() => {
    wheelLocked = false
  }, 450)
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

onBeforeUnmount(() => {
  clearTimeout(wheelTimer)
})
</script>

<template>
  <section
    id="alur-pengiriman"
    aria-labelledby="shipping-flow-title"
    class=" bg-white py-16 mt-8"
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
            <a
              href="#main-services"
              class="inline-flex items-center gap-1 text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              Lacak
              <ChevronsDown
                :size="16"
                :stroke-width="2"
                aria-hidden="true"
              />
            </a>
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
          ref="stepViewportRef"
          class="h-[260px] min-w-0 snap-y snap-proximity overflow-x-hidden overflow-y-auto touch-pan-y [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] lg:h-[296px] lg:snap-none lg:overflow-hidden lg:touch-auto"
          tabindex="0"
          role="region"
          aria-label="Daftar langkah pengiriman. Gunakan scroll atau tombol panah untuk berpindah langkah."
          @scroll.passive="handleStepScroll"
          @wheel="handleWheel"
          @keydown="handleNavigationKeydown"
        >
          <div
            class="shipping-flow-track relative space-y-4 transition-transform duration-500 ease-out"
            :style="trackStyle"
          >
            <article
              v-for="(step, index) in steps"
              :key="step.title"
              :ref="(el) => setCardRef(el, index)"
              class="snap-start rounded-[22px] border bg-white p-[18px] transition-[border-color,box-shadow] duration-300 lg:p-5"
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
</template>

<style scoped>
@media (min-width: 64rem) {
  .shipping-flow-track {
    transform: translateY(var(--step-offset));
  }
}
</style>
