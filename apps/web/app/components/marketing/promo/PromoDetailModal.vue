<script setup lang="ts">
import { ArrowLeft, FileText } from 'lucide-vue-next'

interface PromoDetail {
  id: string
  image: string
  imageAlt: string
  title: string
  status: string
  description: string
  inactive?: boolean
  termsLabel?: string
  termsTo?: string
}

const props = defineProps<{
  promo: PromoDetail | null
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
let previousBodyOverflow = ''

watch(
  () => props.promo,
  async (promo) => {
    if (!import.meta.client)
      return

    if (promo) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      await nextTick()
      dialogRef.value?.focus()
    }
    else {
      document.body.style.overflow = previousBodyOverflow
    }
  },
  { immediate: true },
)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.promo)
    emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="promo-modal">
      <div
        v-if="promo"
        class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-[3px] sm:p-8"
        @click.self="emit('close')"
      >
        <article
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`promo-modal-title-${promo.id}`"
          tabindex="-1"
          class="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-[590px] overflow-y-auto rounded-[18px] bg-bg-0 p-4 pb-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] outline-none lg:max-h-none lg:overflow-hidden lg:rounded-[24px] lg:p-6 lg:pb-10"
        >
          <div class="aspect-[1.06/1] overflow-hidden rounded-[14px] bg-bg-100 lg:aspect-square lg:rounded-[18px]">
            <img
              :src="promo.image"
              :alt="promo.imageAlt"
              class="size-full object-cover"
              :class="promo.inactive ? 'grayscale' : ''"
            >
          </div>

          <div class="mt-3">
            <h2
              :id="`promo-modal-title-${promo.id}`"
              class="text-[20px] font-semibold leading-tight text-text-secondary lg:text-[24px]"
            >
              {{ promo.title }}
            </h2>

            <div class="mt-3 flex items-center gap-3 text-[16px] font-medium lg:text-[20px]">
              <span class="text-text-tertiary">Status</span>
              <span class="h-px w-6 bg-border-300" aria-hidden="true" />
              <span :class="promo.inactive ? 'text-text-tertiary' : 'text-emerald-500'">
                {{ promo.status }}
              </span>
            </div>

            <p class="mt-3 text-justify text-[14px] font-normal leading-[1.4] text-text-tertiary lg:text-[20px] lg:font-medium">
              {{ promo.description }}
            </p>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:mt-6 lg:flex-nowrap lg:gap-5">
              <button
                type="button"
                class="inline-flex min-h-11 items-center gap-2 rounded-md text-[14px] font-medium text-text-tertiary transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500 lg:min-h-0 lg:gap-3 lg:text-[16px]"
                @click="emit('close')"
              >
                <ArrowLeft :size="18" :stroke-width="1.8" aria-hidden="true" />
                <span>Kembali</span>
              </button>

              <NuxtLink
                :to="promo.termsTo || '/terms-and-conditions'"
                class="inline-flex min-h-11 items-center gap-2 rounded-md text-[14px] font-normal text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500 lg:min-h-0 lg:gap-3 lg:text-[16px] lg:font-medium"
              >
                <span>{{ promo.termsLabel || 'Terms & Conditions' }}</span>
                <FileText :size="18" :stroke-width="1.8" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.promo-modal-enter-active,
.promo-modal-leave-active {
  transition: opacity 180ms ease;
}

.promo-modal-enter-active article,
.promo-modal-leave-active article {
  transition: transform 180ms ease, opacity 180ms ease;
}

.promo-modal-enter-from,
.promo-modal-leave-to {
  opacity: 0;
}

.promo-modal-enter-from article,
.promo-modal-leave-to article {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
