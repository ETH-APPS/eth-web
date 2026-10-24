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
          class="text-[32px] font-bold uppercase leading-tight text-primary-500"
        >
          {{ title }}
        </h1>
        <p class="mx-auto mt-6 max-w-[820px] text-[20px] leading-[1.5] text-text-tertiary">
          {{ description }}
        </p>
      </div>

      <form
        class="mx-auto mt-8 max-w-[760px] rounded-[28px] border border-border-200 bg-bg-0 p-5 shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
        @submit.prevent="submitSearch"
      >
        <div class="grid gap-3 sm:grid-cols-[1fr_1fr_48px]">
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
              class="h-12 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[15px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
              class="h-12 w-full rounded-full border border-border-200 bg-bg-0 pl-11 pr-4 text-[15px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>

          <button
            type="submit"
            aria-label="Cari status pengiriman"
            class="flex size-12 items-center justify-center justify-self-center rounded-full bg-primary-500 text-bg-0 transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <Search :size="22" aria-hidden="true" />
          </button>
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-text-secondary">
          <span class="flex items-center gap-2">
            <CalendarClock :size="19" class="text-primary-500" aria-hidden="true" />
            Update 24/7
          </span>
          <span aria-hidden="true" class="hidden h-5 w-px bg-border-200 sm:block" />
          <span class="flex items-center gap-2">
            <Crosshair :size="19" class="text-primary-500" aria-hidden="true" />
            Hasil Akurat
          </span>
          <span aria-hidden="true" class="hidden h-5 w-px bg-border-200 sm:block" />
          <span class="flex items-center gap-2">
            <ShieldCheck :size="19" class="text-primary-500" aria-hidden="true" />
            Koneksi Terjamin
          </span>
        </div>
      </form>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
      >
        <div
          v-if="hasSearched"
          class="mt-10 border-t border-border-200 pt-8"
        >
          <article class="rounded-[18px] border border-border-200 bg-bg-0 p-6">
            <p class="text-[13px] text-text-tertiary">
              Case
            </p>
            <p class="mt-1 text-[24px] font-semibold text-primary-500">
              {{ searchedCaseNumber }}
            </p>

            <dl class="mt-6 grid gap-2 text-[13px] sm:grid-cols-[110px_1fr]">
              <dt class="text-text-tertiary">Cargo Type</dt>
              <dd class="font-medium text-primary-500">{{ result.cargoType }}</dd>
              <dt class="text-text-tertiary">Current Status</dt>
              <dd class="text-text-secondary">
                To&nbsp;&nbsp; <span class="font-medium text-primary-500">{{ result.currentStatus }}</span>
              </dd>
            </dl>

            <div class="mt-6 grid gap-8 border-t border-border-200 pt-6 md:grid-cols-4 md:gap-5">
              <div
                v-for="(checkpoint, index) in result.checkpoints"
                :key="`${checkpoint.location}-${checkpoint.label}`"
                class="relative"
              >
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
                    class="text-[18px] font-medium"
                    :class="checkpoint.active ? 'text-primary-500' : 'text-text-secondary'"
                  >
                    {{ checkpoint.location }}
                  </h2>
                </div>
                <p class="ml-9 mt-1 text-[11px] text-primary-500">
                  {{ checkpoint.label }}
                </p>

                <ArrowRight
                  v-if="index < result.checkpoints.length - 1"
                  :size="22"
                  aria-hidden="true"
                  class="absolute -right-4 top-1 hidden text-primary-500 md:block"
                />

                <ul class="ml-9 mt-3 space-y-2 border-t border-border-200 pt-2">
                  <li
                    v-for="event in checkpoint.events"
                    :key="`${event.label}-${event.value}`"
                    class="grid grid-cols-[14px_1fr_auto] items-center gap-1 text-[10px]"
                  >
                    <Check
                      v-if="event.status === 'complete'"
                      :size="13"
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
                    <span class="text-text-tertiary">{{ event.label }}</span>
                    <span :class="event.status === 'current' ? 'text-primary-500' : 'text-text-tertiary'">
                      {{ event.value }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <div class="mt-12 text-center">
            <p class="text-[14px] text-text-tertiary">
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
