<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import heroUrl from '~/assets/images/marketing/hero.webp'

const services = [
  {
    id: 'sea',
    label: 'Kargo Laut',
    to: '/sea-freight',
    description: 'Solusi impor skala besar maupun eceran. Hemat, stabil, dan jadwal keberangkatan rutin.'
  },
  {
    id: 'air',
    label: 'Kargo Udara',
    to: '/air-freight',
    description: 'Pengiriman sampel dan barang urgensi tinggi dengan perlindungan asuransi penuh.'
  },
  {
    id: 'sourcing',
    label: 'Jasa Sourcing',
    to: '/sourcing',
    description: 'Dari pencarian produk, QC di China, pengurusan dokumen, hingga pengiriman.'
  },
  {
    id: 'transfer-rmb',
    label: 'Jasa Transfer RMB',
    to: '/transfer-rmb',
    description: 'Bayar supplier China mudah dan aman tanpa batas limit. Kurs kompetitif dengan bukti legal.'
  }
] as const

type ServiceId = typeof services[number]['id']

const activeId = ref<ServiceId>('sea')
const hoveredDesktopId = ref<ServiceId | null>(null)
const focusedDesktopId = ref<ServiceId | null>(null)
const desktopActiveId = computed(() => hoveredDesktopId.value ?? focusedDesktopId.value)
const desktopActiveIndex = computed(() => services.findIndex(service => service.id === desktopActiveId.value))

const activeIndex = computed(() => {
  const index = services.findIndex(service => service.id === activeId.value)

  return index === -1 ? 0 : index
})

const activeService = computed(() => services[activeIndex.value] ?? services[0])

async function selectService(id: ServiceId, moveFocus = false) {
  activeId.value = id

  if (!moveFocus) {
    return
  }

  await nextTick()
  document.getElementById(`service-tab-${id}`)?.focus()
}

function selectByIndex(index: number, moveFocus = true) {
  const normalizedIndex = (index + services.length) % services.length
  const service = services[normalizedIndex]

  if (service) {
    void selectService(service.id, moveFocus)
  }
}

function handleDesktopPointerEnter(id: ServiceId, event: PointerEvent) {
  if (event.pointerType !== 'touch' && window.matchMedia('(hover: hover)').matches) {
    hoveredDesktopId.value = id
  }
}

function handleDesktopPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  hoveredDesktopId.value = null

  if (!(document.activeElement instanceof HTMLElement && document.activeElement.matches(':focus-visible'))) {
    focusedDesktopId.value = null
  }
}

function handleDesktopFocusIn(id: ServiceId, event: FocusEvent) {
  if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
    focusedDesktopId.value = id
  }
}

function handleDesktopFocusOut(event: FocusEvent) {
  if (!(event.currentTarget instanceof HTMLElement) || !event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) {
    focusedDesktopId.value = null
  }
}

function handleDesktopClick(id: ServiceId, event: MouseEvent) {
  if (event.detail === 0 || !window.matchMedia('(hover: hover)').matches) {
    focusedDesktopId.value = id
  }
}

async function selectDesktopByIndex(index: number) {
  const service = services[(index + services.length) % services.length]

  if (!service) {
    return
  }

  hoveredDesktopId.value = null
  focusedDesktopId.value = service.id
  await nextTick()
  document.getElementById(`service-tab-${service.id}`)?.focus()
}

function handleTabKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    void selectDesktopByIndex((desktopActiveIndex.value === -1 ? 0 : desktopActiveIndex.value) - 1)
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    void selectDesktopByIndex((desktopActiveIndex.value === -1 ? 0 : desktopActiveIndex.value) + 1)
  }

  if (event.key === 'Home') {
    event.preventDefault()
    void selectDesktopByIndex(0)
  }

  if (event.key === 'End') {
    event.preventDefault()
    void selectDesktopByIndex(services.length - 1)
  }
}
</script>

<template>
  <section
    id="home"
    aria-labelledby="hero-title"
    class="relative isolate h-[346px] overflow-hidden bg-[#075474] md:h-[420px] lg:h-[100svh] lg:min-h-[720px]"
  >
    <img
      :src="heroUrl"
      alt=""
      width="2560"
      height="1440"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      aria-hidden="true"
      class="absolute inset-0 size-full object-cover object-center"
    >
    <img
      :src="heroUrl"
      alt=""
      width="2560"
      height="1440"
      aria-hidden="true"
      class="absolute left-1/2 top-4 h-auto w-[128%] max-w-none -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)] md:hidden"
    >
    <div class="absolute inset-0 bg-[rgba(0,45,69,0.08)] lg:bg-[rgba(0,45,69,0.28)]" />
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_52%,rgba(0,24,43,0.38)_100%)] lg:bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,transparent_38%,rgba(0,0,0,0.72)_100%)] lg:opacity-[0.86]"
    />

    <UiContainer class="absolute inset-x-0 bottom-0 z-10 pb-4 lg:relative lg:inset-auto lg:flex lg:h-full lg:flex-col lg:pb-6 lg:pt-[120px]">
      <div class="rounded-[24px] bg-[rgba(17,17,17,0.14)] px-5 py-3 text-white backdrop-blur-[4px] lg:contents">
        <div class="flex items-start justify-between gap-4 lg:contents">
          <h1
            id="hero-title"
            class="sr-only lg:not-sr-only lg:text-center lg:text-[64px] lg:font-bold lg:normal-case lg:leading-normal lg:tracking-[0.01em] lg:text-white lg:drop-shadow-sm"
          >
            Forwarder China Indonesia #1
          </h1>

          <p class="text-[24px] font-medium uppercase leading-normal tracking-[0.01em] text-white lg:hidden">
            {{ activeService.label }}
          </p>

          <UiAnimatedArrowButton
            :to="activeService.to"
            :aria-label="`Buka layanan ${activeService.label}`"
            variant="plain"
            icon-only
            class="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-500 text-white transition-[background-color,color,box-shadow] hover:bg-primary-100 hover:text-primary-500 hover:ring-2 hover:ring-inset hover:ring-primary-500 focus-visible:bg-primary-100 focus-visible:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 lg:hidden"
          />
        </div>

        <div class="mt-2 flex justify-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Layanan sebelumnya"
            class="flex size-11 items-center justify-center rounded-[12px] bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            @click="selectByIndex(activeIndex - 1, false)"
          >
            <ChevronLeft :size="23" :stroke-width="2" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Layanan berikutnya"
            class="flex size-11 items-center justify-center rounded-[12px] bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            @click="selectByIndex(activeIndex + 1, false)"
          >
            <ChevronRight :size="23" :stroke-width="2" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p class="mx-auto mt-3 hidden max-w-[900px] text-center text-[20px] font-semibold leading-normal tracking-[0.01em] text-white/95 drop-shadow-sm lg:block">
        Layanan Kargo Laut &amp; Udara Door-to-Door khusus B2B. Bebas repot urus pajak &amp; bea cukai, biaya transparan, dengan kepastian estimasi pengiriman.
      </p>

      <div class="relative mt-auto hidden lg:block">
        <div
          aria-hidden="true"
          class="absolute inset-[3px] translate-y-[10px] rounded-[21px] bg-[rgba(20,28,37,0.08)] blur-[7.5px]"
        />

        <div
          id="layanan"
          class="relative rounded-[24px] bg-[rgba(17,17,17,0.14)] px-6 pb-4 pt-5 text-white backdrop-blur-[4px]"
          @pointerleave="handleDesktopPointerLeave"
        >
          <!-- Tinggi mengikuti isi (tanpa angka fixed), overflow-hidden hanya untuk memotong judul non-aktif yang turun -->
          <div class="relative overflow-hidden pb-2">
            <div
              role="group"
              aria-label="Pilih layanan"
              class="grid grid-cols-4"
              @keydown="handleTabKeydown"
              @focusout="handleDesktopFocusOut"
            >
              <div
                v-for="service in services"
                :key="service.id"
                class="text-center transition-transform duration-300 ease-out"
                :class="service.id === desktopActiveId ? 'translate-y-0' : 'translate-y-[58%]'"
                @pointerenter="handleDesktopPointerEnter(service.id, $event)"
                @focusin="handleDesktopFocusIn(service.id, $event)"
              >
                <button
                  :id="`service-tab-${service.id}`"
                  type="button"
                  :aria-controls="`service-panel-${service.id}`"
                  :aria-pressed="service.id === desktopActiveId"
                  :tabindex="service.id === (desktopActiveId ?? services[0]?.id) ? 0 : -1"
                  class="whitespace-nowrap rounded-md px-2 text-[22px] font-medium uppercase leading-tight tracking-[0.01em] text-white transition-colors hover:text-primary-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  @click="handleDesktopClick(service.id, $event)"
                >
                  {{ service.label }}
                </button>

                <!-- invisible (bukan v-show) supaya tingginya tetap dihitung dan wrapper selalu cukup tinggi -->
                <div
                  :id="`service-panel-${service.id}`"
                  role="region"
                  :aria-labelledby="`service-tab-${service.id}`"
                  class="px-3 pt-2"
                  :class="service.id === desktopActiveId ? 'visible' : 'invisible'"
                >
                  <p class="mx-auto max-w-[220px] text-[12px] font-normal leading-[1.45] text-white/90">
                    {{ service.description }}
                  </p>

                  <UiAnimatedArrowButton
                    :to="service.to"
                    variant="plain"
                    :icon-size="17"
                    class="mt-2 inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-[10px] bg-primary-500 px-3 text-[14px] font-medium text-white transition-[background-color,color,box-shadow] hover:bg-primary-100 hover:text-primary-500 hover:ring-2 hover:ring-inset hover:ring-primary-500 focus-visible:bg-primary-100 focus-visible:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  >
                    Pelajari {{ service.label }}
                  </UiAnimatedArrowButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Track garis: mt-1 + h-6 (sama dengan tinggi bulatan size-6) supaya tidak menonjol -->
          <div
            aria-hidden="true"
            class="relative mt-1 h-6"
          >
            <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary-500" />
            <span
              v-if="desktopActiveIndex !== -1"
              class="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 transition-[left] duration-300 ease-out"
              :style="{ left: `${(desktopActiveIndex + 0.5) * 25}%` }"
            />
            <div aria-hidden="true" class="absolute inset-0 grid grid-cols-4">
              <div
                v-for="service in services"
                :key="service.id"
                @pointerenter="handleDesktopPointerEnter(service.id, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
