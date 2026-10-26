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
          class="my-auto w-full max-w-[420px] overflow-hidden rounded-[20px] bg-bg-0 shadow-[0_24px_70px_rgba(0,0,0,0.35)] outline-none"
        >
          <div class="aspect-[1.06/1] overflow-hidden bg-bg-100">
            <img
              :src="promo.image"
              :alt="promo.imageAlt"
              class="size-full object-cover"
              :class="promo.inactive ? 'grayscale' : ''"
            >
          </div>

          <div class="p-5 sm:p-6">
            <h2
              :id="`promo-modal-title-${promo.id}`"
              class="text-base font-semibold text-text-secondary"
            >
              {{ promo.title }}
            </h2>

            <div class="mt-2 flex items-center gap-3 text-xs">
              <span class="text-text-tertiary">Status</span>
              <span class="h-px w-5 bg-border-300" aria-hidden="true" />
              <span
                class="font-medium"
                :class="promo.inactive ? 'text-text-tertiary' : 'text-emerald-500'"
              >
                {{ promo.status }}
              </span>
            </div>

            <p class="mt-4 text-xs leading-[1.6] text-text-secondary">
              {{ promo.description }}
            </p>

            <div class="mt-6 flex items-center justify-between gap-5">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md text-xs text-text-tertiary transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500"
                @click="emit('close')"
              >
                <ArrowLeft :size="15" :stroke-width="1.8" aria-hidden="true" />
                <span>Kembali</span>
              </button>

              <NuxtLink
                :to="promo.termsTo || '/terms-and-conditions'"
                class="inline-flex items-center gap-2 rounded-md text-xs font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-500"
              >
                <span>{{ promo.termsLabel || 'Terms & Conditions' }}</span>
                <FileText :size="15" :stroke-width="1.8" aria-hidden="true" />
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
