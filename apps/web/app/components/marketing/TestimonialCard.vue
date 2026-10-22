<script setup lang="ts">
import { ShieldCheck, Star } from 'lucide-vue-next'

withDefaults(defineProps<{
  name: string
  reviewSource: string
  reviewDate: string
  content: string
  attachments?: number
}>(), {
  attachments: 0,
})
</script>

<template>
  <article
    class="w-[350px] shrink-0 rounded-2xl border border-border-300 bg-bg-0 p-4"
    :class="attachments > 0 ? 'min-h-[212px]' : 'min-h-[152px]'"
  >
    <div class="flex items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
        <ShieldCheck
          :size="30"
          :stroke-width="2"
          aria-hidden="true"
        />
      </span>

      <div class="min-w-0 flex-1">
        <h3 class="truncate text-[16px] font-medium leading-tight text-text-secondary">
          {{ name }}
        </h3>
        <p class="mt-1 text-[12px] font-normal text-text-disable">
          {{ reviewSource }}
        </p>

        <div class="mt-1.5 flex items-center justify-between gap-4">
          <div
            class="flex items-center gap-0.5 text-[#fbbf24]"
            aria-label="Rating 5 dari 5"
          >
            <Star
              v-for="star in 5"
              :key="star"
              :size="15"
              :stroke-width="1.5"
              fill="currentColor"
              aria-hidden="true"
            />
          </div>
          <p class="shrink-0 text-[11px] font-normal text-text-disable">
            {{ reviewDate }}
          </p>
        </div>

        <p class="mt-3 text-[13px] font-normal leading-[1.45] text-text-tertiary">
          {{ content }}
        </p>
      </div>
    </div>

    <div
      v-if="attachments > 0"
      class="mt-3 flex gap-2"
      aria-label="Lampiran ulasan"
    >
      <div
        v-for="attachment in attachments"
        :key="attachment"
        aria-hidden="true"
        class="h-[50px] w-[100px] rounded-lg bg-bg-100"
      />
    </div>
  </article>
</template>