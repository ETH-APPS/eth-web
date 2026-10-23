<script setup lang="ts">
import { ArrowUpRight, Layers3 } from 'lucide-vue-next'

interface ShippingWorkflowStep {
  title: string
  description: string
}

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    steps: readonly ShippingWorkflowStep[]
    ctaPrompt: string
    ctaLabel: string
    ctaTo: string
    sectionId?: string
  }>(),
  {
    sectionId: 'shipping-workflow',
  },
)

const titleId = computed(() => `${props.sectionId}-title`)
const activeStep = ref(0)
const lineStep = ref(0)
const circleStep = ref(0)

const sectionRef = ref<HTMLElement | null>(null)
const stepRefs = ref<(HTMLElement | null)[]>([])

let animationFrame: number | undefined

function setStepRef(element: unknown, index: number) {
  stepRefs.value[index] = (element as HTMLElement | null) ?? null
}

watch(activeStep, (nextStep) => {
  lineStep.value = nextStep
  circleStep.value = nextStep
})

function updateActiveStep() {
  const section = sectionRef.value

  if (!section) return

  const sectionRect = section.getBoundingClientRect()

  if (
    sectionRect.bottom < 0 ||
    sectionRect.top > window.innerHeight
  ) {
    return
  }

  const viewportCenter = window.innerHeight / 2
  let closestStep = activeStep.value
  let closestDistance = Number.POSITIVE_INFINITY

  stepRefs.value.forEach((step, index) => {
    if (!step) return

    const rect = step.getBoundingClientRect()
    const distance = Math.abs(
      rect.top + rect.height / 2 - viewportCenter,
    )

    if (distance < closestDistance) {
      closestDistance = distance
      closestStep = index
    }
  })

  activeStep.value = closestStep
}

function handleScroll() {
  if (animationFrame !== undefined) {
    cancelAnimationFrame(animationFrame)
  }

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
  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })

  window.addEventListener('resize', handleScroll)

  updateActiveStep()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)

  if (animationFrame !== undefined) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <section
    :id="sectionId"
    ref="sectionRef"
    :aria-labelledby="titleId"
    class="bg-white py-16"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          :id="titleId"
          class="text-[30px] font-semibold leading-tight text-primary-500"
        >
          {{ title }}
        </h2>

        <p
          class="mx-auto mt-4 max-w-[590px] text-[14px] leading-[1.5] text-slate-500"
        >
          {{ description }}
        </p>
      </div>

      <ol class="mx-auto mt-10 max-w-[610px]">
        <li
          v-for="(step, index) in steps"
          :key="`${index}-${step.title}`"
          :ref="(element) => setStepRef(element, index)"
          class="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 pb-4 last:pb-0"
        >
          <div class="relative flex justify-center pt-[9px]">
            <span
              v-if="index < steps.length - 1"
              aria-hidden="true"
              class="absolute left-1/2 top-[41px] h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 overflow-hidden bg-primary-100"
            >
              <span
                class="block size-full origin-top bg-primary-500 transition-transform duration-[250ms] ease-linear"
                :class="
                  index < lineStep
                    ? 'scale-y-100'
                    : 'scale-y-0'
                "
              />
            </span>

            <button
              type="button"
              :aria-label="`Tampilkan langkah ${index + 1}: ${step.title}`"
              :aria-pressed="activeStep === index"
              class="relative z-10 flex size-8 items-center justify-center rounded-full text-[15px] font-semibold transition-[background-color,color,scale] duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              :class="
                index <= circleStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-50 text-primary-500'
              "
              @click="selectStep(index)"
            >
              {{ index + 1 }}
            </button>
          </div>

          <button
            type="button"
            class="w-full rounded-xl border p-3 text-left transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            :class="
              activeStep === index
                ? 'border-primary-500 shadow-[0_5px_12px_rgba(15,23,42,0.08)]'
                : 'border-transparent hover:border-border-200'
            "
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

            <span
              class="mt-3 block text-[12px] leading-[1.5] text-slate-700"
            >
              {{ step.description }}
            </span>
          </button>
        </li>
      </ol>

      <div class="mt-10 text-center">
        <p class="text-[12px] text-slate-400">
          {{ ctaPrompt }}
        </p>

        <NuxtLink
          :to="ctaTo"
          class="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-[12px] font-semibold text-white transition-[background-color,translate] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>{{ ctaLabel }}</span>

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