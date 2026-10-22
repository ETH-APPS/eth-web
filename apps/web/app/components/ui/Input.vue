<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  id: string
  label: string
  placeholder: string
  accent?: boolean
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label
    :for="id"
    class="flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 text-text-tertiary transition-colors"
    :class="accent ? 'border-primary-500' : 'border-border-300'"
  >
    <span class="sr-only">{{ label }}</span>

    <span
      v-if="$slots.leading"
      aria-hidden="true"
      class="grid shrink-0 place-items-center text-lg font-normal text-text-tertiary"
    >
      <slot name="leading" />
    </span>

    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :placeholder="placeholder"
      class="min-w-0 flex-1 bg-transparent text-[15px] text-[#354057] outline-none placeholder:text-text-tertiary"
    >
  </label>
</template>