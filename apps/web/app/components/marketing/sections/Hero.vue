<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import heroUrl from '~/assets/images/marketing/hero.png'

const services = [
  {
    id: 'sea',
    label: 'Kargo Laut',
    description: 'Solusi impor skala besar maupun eceran. Hemat, stabil, dan jadwal keberangkatan rutin.'
  },
  {
    id: 'air',
    label: 'Kargo Udara',
    description: 'Pengiriman sampel dan barang urgensi tinggi dengan perlindungan asuransi penuh.'
  },
  {
    id: 'sourcing',
    label: 'Jasa Sourcing',
    description: 'Dari pencarian produk, QC di China, pengurusan dokumen, hingga pengiriman.'
  },
  {
    id: 'transfer-rmb',
    label: 'Jasa Transfer RMB',
    description: 'Bayar supplier China mudah dan aman tanpa batas limit. Kurs kompetitif dengan bukti legal.'
  }
] as const

type ServiceId = typeof services[number]['id']

const activeId = ref<ServiceId>('sea')

const activeIndex = computed(() => {
  const index = services.findIndex(service => service.id === activeId.value)

  return index === -1 ? 0 : index
})

async function selectService(id: ServiceId, moveFocus = false) {
  activeId.value = id

  if (!moveFocus) {
    return
  }

  await nextTick()
  document.getElementById(`service-tab-${id}`)?.focus()
}

function selectByIndex(index: number) {
  const normalizedIndex = (index + services.length) % services.length
  const service = services[normalizedIndex]

  if (service) {
    void selectService(service.id, true)
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
    class="relative isolate h-[100svh] min-h-[720px] overflow-hidden bg-[#075474]"
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
    <div class="absolute inset-0 bg-[rgba(0,45,69,0.28)]" />
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,transparent_38%,rgba(0,0,0,0.72)_100%)] opacity-[0.86]"
    />

    <UiContainer class="relative z-10 flex h-full flex-col pb-6 pt-[120px]">
      <h1
        id="hero-title"
        class="text-center text-[64px] font-bold leading-normal tracking-[0.01em] text-white drop-shadow-sm"
      >
        Forwarder China Indonesia #1
      </h1>

      <p class="mx-auto mt-3 max-w-[900px] text-center text-[20px] font-semibold leading-normal tracking-[0.01em] text-white/95 drop-shadow-sm">
        Layanan Kargo Laut &amp; Udara Door-to-Door khusus B2B. Bebas repot urus pajak &amp; bea cukai, biaya transparan, dengan kepastian estimasi pengiriman.
      </p>

      <div class="relative mt-auto">
        <!--
          Drop shadow Figma (X0 Y10 Blur15 Spread-3, #141C25 8%) dengan
          "Show behind transparent areas" aktif. box-shadow CSS tidak pernah
          digambar di dalam box elemen, jadi ditiru dengan layer blur di
          belakang kartu. Hapus layer ini kalau efeknya tidak diperlukan.
        -->
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
