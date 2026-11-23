<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import googleLogo from '~/assets/images/marketing/google.png'

withDefaults(defineProps<{
  name: string
  reviewSource: string
  reviewDate: string
  content: string
  avatar: string
  stars: number
  reviewUrl: string
  attachments?: number
}>(), {
  attachments: 0,
})

const avatarFailed = ref(false)
</script>

<template>
  <article
    class="w-[350px] shrink-0 rounded-2xl border border-border-300 bg-bg-0 p-4"
    :class="attachments > 0 ? 'min-h-[212px]' : 'min-h-[152px]'"
  >
    <div class="flex items-start gap-3">
      <img
        v-if="!avatarFailed"
        :src="avatar"
        alt=""
        width="40"
        height="40"
        class="size-10 shrink-0 rounded-xl object-cover"
        @error="avatarFailed = true"
      >
      <div v-else class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-semibold text-primary-500" aria-hidden="true">
        {{ name.charAt(0).toUpperCase() }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="truncate text-[16px] font-medium leading-tight text-text-secondary">
              {{ name }}
            </h3>
            <!-- <p class="mt-1 text-[12px] font-normal text-text-disable">
              {{ reviewSource }}
            </p> -->
          </div>
          <a :href="reviewUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Baca ulasan ${name} di Google Maps`" class="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
            <img :src="googleLogo" alt="Google" width="24" height="24" loading="lazy" class="size-6 object-contain">
          </a>
        </div>

        <div class="mt-1.5 flex items-center justify-between gap-4">
          <div
            class="flex items-center gap-0.5"
            :aria-label="`Rating ${stars} dari 5`"
          >
            <Star
              v-for="star in 5"
              :key="star"
              :size="15"
              :stroke-width="1.5"
              :fill="star <= stars ? 'currentColor' : 'none'"
              :class="star <= stars ? 'text-[#fbbf24]' : 'text-border-300'"
              aria-hidden="true"
            />
          </div>
          <p class="shrink-0 text-[11px] font-normal text-text-disable">
            {{ reviewDate }}
          </p>
        </div>

        <a :href="reviewUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Baca ulasan lengkap ${name} di Google Maps`" class="mt-3 line-clamp-4 rounded text-[13px] font-normal leading-[1.45] whitespace-pre-line text-text-tertiary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
          {{ content }}
        </a>
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
