<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { resolveComponent } from 'vue'

type Tone = 'green' | 'primary'
type Variant = 'default' | 'plain'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  target?: '_self' | '_blank'
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  tone?: Tone
  variant?: Variant
  height?: number
  iconSize?: number
  iconOnly?: boolean
  showArrow?: boolean
}>(), {
  type: 'button',
  tone: 'primary',
  variant: 'default',
  iconSize: 22,
  iconOnly: false,
  showArrow: true,
})

const nuxtLink = resolveComponent('NuxtLink')
const rootComponent = computed(() => props.to ? nuxtLink : props.href ? 'a' : 'button')
const rel = computed(() => props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined))

const toneClasses: Record<Tone, string> = {
  green: 'bg-green-500 text-bg-0 hover:border-green-700 hover:bg-green-100 hover:text-green-700 focus-visible:border-green-700 focus-visible:bg-green-100 focus-visible:text-green-700 focus-visible:outline-green-700',
  primary: 'bg-primary-500 text-bg-0 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-500 focus-visible:border-primary-500 focus-visible:bg-primary-100 focus-visible:text-primary-500 focus-visible:outline-primary-500',
}
</script>

<template>
  <component
    :is="rootComponent"
    :to="to"
    :href="to ? undefined : href"
    :target="target"
    :rel="rel"
    :type="rootComponent === 'button' ? type : undefined"
    :style="variant === 'default' ? { height: `${height ?? 48}px` } : height === undefined ? undefined : { height: `${height}px` }"
    class="animated-arrow-button"
    :class="variant === 'default' ? ['inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-transparent px-5 text-[16px] font-medium shadow-[0_7px_14px_rgba(0,0,0,0.22)] transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none lg:min-h-0', toneClasses[tone]] : undefined"
  >
    <span v-if="!iconOnly"><slot /></span>
    <slot v-if="$slots.trailing" name="trailing" />
    <span
      v-else-if="showArrow"
      class="animated-arrow-button-icon"
      :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
      aria-hidden="true"
    >
      <ArrowUpRight class="animated-arrow-button-current" :size="iconSize" :stroke-width="2" />
      <ArrowUpRight class="animated-arrow-button-next" :size="iconSize" :stroke-width="2" />
    </span>
  </component>
</template>

<style scoped>
.animated-arrow-button-icon {
  position: relative;
  display: block;
  flex: none;
  overflow: hidden;
}

.animated-arrow-button-icon svg {
  position: absolute;
  inset: 0;
  transition: transform 735ms cubic-bezier(0.62, 0.05, 0.01, 0.99);
}

.animated-arrow-button-next {
  transform: translate(-150%, 150%);
}

.animated-arrow-button:hover .animated-arrow-button-current,
.animated-arrow-button:focus-visible .animated-arrow-button-current {
  transform: translate(150%, -150%);
}

.animated-arrow-button:hover .animated-arrow-button-next,
.animated-arrow-button:focus-visible .animated-arrow-button-next {
  transform: translate(0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .animated-arrow-button-icon svg {
    transition: none;
  }
}
</style>
