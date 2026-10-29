<script setup lang="ts">
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import heroUrl from '~/assets/images/marketing/hero.png'

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

function handleTabKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    selectByIndex(activeIndex.value - 1)
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    selectByIndex(activeIndex.value + 1)
  }

  if (event.key === 'Home') {
    event.preventDefault()
    selectByIndex(0)
  }

  if (event.key === 'End') {
    event.preventDefault()
    selectByIndex(services.length - 1)
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
      width="1440"
      height="810"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      aria-hidden="true"
      class="absolute inset-0 size-full object-cover object-center"
    >
    <img
      :src="heroUrl"
      alt=""
      width="1440"
      height="810"
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
            class="text-[24px] font-medium uppercase leading-normal tracking-[0.01em] text-white lg:text-center lg:text-[64px] lg:font-bold lg:normal-case lg:drop-shadow-sm"
          >
            <span class="lg:hidden">{{ activeService.label }}</span>
            <span class="hidden lg:inline">Forwarder China Indonesia #1</span>
          </h1>

          <NuxtLink
            :to="activeService.to"
            :aria-label="`Buka layanan ${activeService.label}`"
            class="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-500 text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
          >
            <ArrowUpRight :size="22" :stroke-width="2" aria-hidden="true" />
          </NuxtLink>
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

        <section
          id="layanan"
          aria-label="Layanan ETH Cargo"
          class="relative rounded-[24px] bg-[rgba(17,17,17,0.14)] px-6 pb-4 pt-5 text-white backdrop-blur-[4px]"
        >
          <div class="relative h-[130px] overflow-hidden">
            <div
              role="tablist"
              aria-label="Pilih layanan"
              aria-orientation="horizontal"
              class="grid h-full grid-cols-4"
              @keydown="handleTabKeydown"
            >
              <div
                v-for="service in services"
                :key="service.id"
                class="text-center transition-transform duration-300 ease-out"
                :class="service.id === activeId ? 'translate-y-0' : 'translate-y-[78px]'"
              >
                <button
                  :id="`service-tab-${service.id}`"
                  type="button"
                  role="tab"
                  :aria-controls="`service-panel-${service.id}`"
                  :aria-selected="service.id === activeId"
                  :tabindex="service.id === activeId ? 0 : -1"
                  class="whitespace-nowrap rounded-md px-2 text-[22px] font-medium uppercase leading-tight tracking-[0.01em] text-white transition-colors hover:text-primary-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  @click="selectService(service.id)"
                >
                  {{ service.label }}
                </button>

                <div
                  v-show="service.id === activeId"
                  :id="`service-panel-${service.id}`"
                  role="tabpanel"
                  :aria-labelledby="`service-tab-${service.id}`"
                  class="px-3 pt-2"
                >
                  <p class="mx-auto max-w-[220px] text-[12px] font-normal leading-[1.45] text-white/90">
                    {{ service.description }}
                  </p>

                  <a
                    href="#layanan"
                    class="mt-2 inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-[10px] bg-primary-500 px-3 text-[14px] font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <span>Pelajari {{ service.label }}</span>

                    <ArrowUpRight
                      aria-hidden="true"
                      :size="17"
                      :stroke-width="1.5"
                      absolute-stroke-width
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            class="relative h-5"
          >
            <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary-500" />
            <span
              class="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 transition-[left] duration-300 ease-out"
              :style="{ left: `${(activeIndex + 0.5) * 25}%` }"
            />
          </div>
        </section>
      </div>
    </UiContainer>
  </section>
</template>
