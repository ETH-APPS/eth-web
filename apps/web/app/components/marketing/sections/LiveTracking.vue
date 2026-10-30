<script setup lang="ts">
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarClock,
  Check,
  CircleDot,
  Clock3,
  Crosshair,
  Hash,
  House,
  Search,
  ShieldCheck,
  Store,
  Warehouse,
} from 'lucide-vue-next'

type CheckpointKind = 'seller' | 'warehouse' | 'destination'
type EventStatus = 'complete' | 'current' | 'pending'

interface TrackingResult {
  caseNumber: string
  cargoType: string
  currentStatus: string
  checkpoints: readonly {
    location: string
    label: string
    kind: CheckpointKind
    active?: boolean
    events: readonly {
      label: string
      value: string
      status: EventStatus
    }[]
  }[]
}

const props = withDefaults(defineProps<{
  title?: string
  description: string
  result: TrackingResult
  initialMarkingId?: string
  initialPin?: string
  initialShowResult?: boolean
  sectionId?: string
  ctaPrompt?: string
  ctaLabel?: string
  ctaTo?: string
}>(), {
  title: 'Live Tracking Cargo',
  initialMarkingId: '',
  initialPin: '',
  initialShowResult: false,
  sectionId: 'live-tracking',
  ctaPrompt: 'Butuh bantuan untuk pengiriman atau hasil tracking Anda?',
  ctaLabel: 'Get a Quote',
  ctaTo: '#quote',
})

const markingId = ref(props.initialMarkingId)
const trackingPin = ref(props.initialPin)
const hasSearched = ref(props.initialShowResult)
const searchedCaseNumber = ref(props.initialPin || props.result.caseNumber)
const titleId = computed(() => `${props.sectionId}-title`)

const checkpointIcons = {
  seller: Store,
  warehouse: Warehouse,
  destination: House,
}

const trackingHighlights = [
  { label: 'Update 24/7', icon: CalendarClock },
  { label: 'Akurat & Real-Time', icon: Crosshair },
  { label: 'Koneksi Terjamin & Aman', icon: ShieldCheck },
] as const

function checkpointIcon(kind: CheckpointKind) {
  return checkpointIcons[kind]
}

function submitSearch() {
  searchedCaseNumber.value = trackingPin.value
  hasSearched.value = true
}
</script>

<template>
  <section
    :id="sectionId"
    :aria-labelledby="titleId"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h1
          :id="titleId"
          class="text-[28px] font-semibold leading-tight text-primary-500 lg:text-[32px]"
        >
          {{ title }}
        </h1>
        <p class="mx-auto mt-8 max-w-[900px] text-[14px] font-normal leading-[1.45] text-text-secondary lg:text-[22px]">
          {{ description }}
        </p>
      </div>

      <form
        class="mx-auto mt-10 max-w-[920px] rounded-[36px] border border-border-200 bg-bg-0 p-5 shadow-[0_10px_20px_rgba(15,23,42,0.12)] sm:p-7"
        @submit.prevent="submitSearch"
      >
        <div class="mx-auto grid max-w-[760px] gap-3 lg:grid-cols-[1fr_1fr_60px]">
          <label class="relative block">
            <span class="sr-only">Marking ID</span>
            <Bookmark
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              v-model="markingId"
              name="marking-id"
              type="text"
              required
              autocomplete="off"
              placeholder="Marking ID"
              class="h-[60px] w-full rounded-full border border-border-200 bg-bg-0 pl-12 pr-4 text-[16px] font-normal text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500"
            >
          </label>

          <label class="relative block">
            <span class="sr-only">PIN tracking</span>
            <Hash
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              v-model="trackingPin"
              name="tracking-pin"
              type="text"
              required
              autocomplete="off"
              placeholder="PIN"
              class="h-[60px] w-full rounded-full border border-border-200 bg-bg-0 pl-12 pr-4 text-[16px] font-normal text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500"
            >
          </label>

          <button
            type="submit"
            aria-label="Cari status pengiriman"
            class="flex h-[60px] items-center justify-center justify-self-end gap-3 rounded-full bg-primary-500 px-6 text-[16px] font-medium text-bg-0 transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:size-[60px] lg:justify-self-center lg:px-0"
          >
            <span class="lg:hidden">Track!</span>
            <Search :size="27" aria-hidden="true" />
          </button>
        </div>

        <div class="tracking-highlights-marquee -mx-5 mt-8 overflow-hidden sm:-mx-7 lg:hidden">
          <div class="tracking-highlights-track flex w-max">
            <div
              v-for="copy in 2"
              :key="copy"
              class="tracking-highlights-group flex shrink-0 items-center gap-8 pr-8 text-[20px] font-medium text-text-secondary"
              :aria-hidden="copy === 2 ? 'true' : undefined"
            >
              <span v-for="highlight in trackingHighlights" :key="highlight.label" class="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <component :is="highlight.icon" :size="26" class="text-primary-500" aria-hidden="true" />
                {{ highlight.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-8 hidden flex-wrap items-center justify-between gap-x-4 gap-y-3 text-[20px] font-medium text-text-secondary lg:flex">
          <template v-for="(highlight, index) in trackingHighlights" :key="highlight.label">
            <span class="flex items-center gap-2">
              <component :is="highlight.icon" :size="26" class="text-primary-500" aria-hidden="true" />
              {{ highlight.label }}
            </span>
            <span v-if="index < trackingHighlights.length - 1" aria-hidden="true" class="h-6 w-px bg-border-200" />
          </template>
        </div>
      </form>

      <div class="mt-12 text-center lg:hidden">
        <p class="text-[14px] font-normal text-text-tertiary">
          {{ ctaPrompt }}
        </p>
        <NuxtLink
          :to="ctaTo"
          class="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] font-medium text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>{{ ctaLabel }}</span>
          <ArrowUpRight :size="17" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div aria-hidden="true" class="mt-12 hidden h-px bg-border-200 lg:block" />

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
      >
        <div
          v-if="hasSearched"
          class="mt-8"
        >
          <article class="rounded-[18px] border border-border-200 bg-bg-0 p-7">
            <p class="text-[16px] font-normal text-text-tertiary">
              Case
            </p>
            <p class="mt-1 text-[28px] font-semibold text-primary-500">
              {{ searchedCaseNumber }}
            </p>

            <dl class="mt-8 grid gap-3 text-[16px] font-normal sm:grid-cols-[150px_1fr]">
              <dt class="text-text-tertiary">Jenis Layanan:</dt>
              <dd class="font-semibold text-primary-500">{{ result.cargoType }}</dd>
              <dt class="text-text-tertiary">Status Terakhir:</dt>
              <dd class="text-text-secondary">
                <span class="font-semibold text-primary-500">{{ result.currentStatus }}</span>
              </dd>
            </dl>

            <div class="mt-6 border-t border-border-200 pt-6">
              <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_76px_minmax(0,1fr)_76px_minmax(0,1fr)_76px_minmax(0,1fr)] md:gap-2">
                <template
                  v-for="(checkpoint, index) in result.checkpoints"
                  :key="`${checkpoint.location}-${checkpoint.label}`"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span
                        class="flex size-7 shrink-0 items-center justify-center rounded-full"
                        :class="checkpoint.active ? 'bg-primary-500 text-bg-0' : 'bg-primary-50 text-primary-500'"
                      >
                        <component
                          :is="checkpointIcon(checkpoint.kind)"
                          :size="15"
                          :stroke-width="1.8"
                          aria-hidden="true"
                        />
                      </span>
                      <h2
                        class="whitespace-nowrap text-[24px] font-medium"
                        :class="checkpoint.active ? 'text-primary-500' : 'text-text-secondary'"
                      >
                        {{ checkpoint.location }}
                      </h2>
                    </div>
                    <p class="ml-9 mt-1 text-[12px] text-primary-500">
                      {{ checkpoint.label }}
                    </p>

                    <ul
                      v-if="checkpoint.kind === 'destination'"
                      class="ml-9 mt-3 space-y-2 border-t border-border-200 pt-3"
                    >
                      <li
                        v-for="event in checkpoint.events"
                        :key="`${event.label}-${event.value}`"
                        class="grid grid-cols-[14px_12px_1fr] items-center gap-2 text-[12px]"
                      >
                        <Clock3
                          v-if="event.status === 'current'"
                          :size="14"
                          aria-hidden="true"
                          class="text-primary-500"
                        />
                        <span v-else aria-hidden="true" />
                        <span aria-hidden="true" class="h-px w-3 bg-border-200" />
                        <span :class="event.status === 'current' ? 'font-medium text-primary-500' : 'text-text-tertiary'">
                          {{ event.value }}
                        </span>
                      </li>
                    </ul>

                    <ul
                      v-else
                      class="ml-9 mt-3 space-y-2 border-t border-border-200 pt-2"
                    >
                      <li
                        v-for="event in checkpoint.events"
                        :key="`${event.label}-${event.value}`"
                        class="grid grid-cols-[18px_1fr_auto] items-center gap-1 text-[12px]"
                        :class="event.label === 'Depart' ? 'mt-3 border-t border-border-200 pt-3' : ''"
                      >
                        <Check
                          v-if="event.status === 'complete'"
                          :size="17"
                          :stroke-width="2.2"
                          aria-hidden="true"
                          class="text-green-500"
                        />
                        <Clock3
                          v-else-if="event.status === 'current'"
                          :size="13"
                          aria-hidden="true"
                          class="text-primary-500"
                        />
                        <CircleDot
                          v-else
                          :size="12"
                          aria-hidden="true"
                          class="text-text-disable"
                        />
                        <span :class="event.label === 'Depart' ? 'text-green-500' : 'text-text-tertiary'">
                          {{ event.label }}
                        </span>
                        <span :class="event.status === 'current' || event.label === 'Depart' ? 'text-primary-500' : 'text-text-tertiary'">
                          {{ event.value }}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div
                    v-if="index < result.checkpoints.length - 1"
                    aria-hidden="true"
                    class="hidden items-center justify-center self-start pt-2 md:flex"
                    :class="index === result.checkpoints.length - 2 ? 'text-border-200' : 'text-primary-500'"
                  >
                    <span class="mr-0.5 h-0.5 w-0.5 rounded-full bg-current" />
                    <span class="mr-0.5 h-0.5 w-0.5 rounded-full bg-current" />
                    <ArrowRight :size="22" :stroke-width="1.8" />
                  </div>
                </template>
              </div>
            </div>
          </article>

          <div class="mt-12 hidden text-center lg:block">
            <p class="text-[16px] font-normal text-text-tertiary">
              {{ ctaPrompt }}
            </p>
            <NuxtLink
              :to="ctaTo"
              class="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] font-medium text-bg-0 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>{{ ctaLabel }}</span>
              <ArrowUpRight :size="17" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </Transition>

    </UiContainer>
  </section>
</template>

<style scoped>
.tracking-highlights-track {
  animation: tracking-highlights-scroll 28s linear infinite;
}

.tracking-highlights-marquee:hover .tracking-highlights-track {
  animation-play-state: paused;
}

@keyframes tracking-highlights-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tracking-highlights-marquee {
    overflow-x: auto;
  }

  .tracking-highlights-track {
    animation: none;
  }

  .tracking-highlights-group[aria-hidden="true"] {
    display: none;
  }
}
</style>
