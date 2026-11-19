<script setup lang="ts">
import facebookDark from '~/assets/images/marketing/facebook-dark.png'
import instagramDark from '~/assets/images/marketing/Instagram-dark.png'
import tiktokDark from '~/assets/images/marketing/Tiktok-dark.png'
import youtubeDark from '~/assets/images/marketing/youtube.png'
import { blogAuthor } from '~/constants/blogAuthor'

definePageMeta({
  layout: 'marketing',
})

const { allArticles } = useAllBlogArticles()
const route = useRoute()
const isAuthorSearchPage = computed(() => route.path === `${blogAuthor.to}/search`)

const socialLinks = [
  { label: 'Facebook ETH Cargo', href: 'https://www.facebook.com/', icon: facebookDark },
  { label: 'Instagram ETH Cargo', href: 'https://www.instagram.com/', icon: instagramDark },
  { label: 'TikTok ETH Cargo', href: 'https://www.tiktok.com/', icon: tiktokDark },
  { label: 'YouTube ETH Cargo', href: 'https://www.youtube.com/', icon: youtubeDark },
] as const

useSeoMeta({
  title: `${blogAuthor.name} | ETH Cargo`,
  description: blogAuthor.description,
  ogTitle: `${blogAuthor.name} | ETH Cargo`,
  ogDescription: blogAuthor.description,
  ogType: 'profile',
})
</script>

<template>
  <div class="bg-bg-0">
    <UiContainer>
      <section
        aria-labelledby="author-name"
        class="mx-auto mt-6 rounded-2xl border border-border-200 bg-bg-0 p-4 shadow-[0_2px_5px_rgba(15,23,42,0.08)] sm:p-6 lg:mt-8"
      >
        <div class="grid grid-cols-[48px_minmax(0,1fr)] items-start gap-4 lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-5">
          <div
            class="size-12 rounded-full bg-[#d9d9d9] lg:size-16"
            role="img"
            :aria-label="`Foto profil ${blogAuthor.name}`"
          />

          <div class="min-w-0">
            <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div>
                <h1 id="author-name" class="text-[20px] font-semibold leading-tight text-text-secondary lg:text-[24px]">
                  {{ blogAuthor.name }}
                </h1>
                <p class="mt-1 text-[12px] font-normal text-text-tertiary lg:text-[14px]">
                  {{ blogAuthor.jobTitle }}
                </p>
              </div>

              <nav aria-label="Media sosial penulis" class="-ml-2 flex flex-wrap items-center lg:ml-0 lg:gap-1">
                <a
                  v-for="social in socialLinks"
                  :key="social.label"
                  :href="social.href"
                  :aria-label="social.label"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex size-11 items-center justify-center rounded-md transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:size-9"
                >
                  <img
                    :src="social.icon"
                    alt=""
                    aria-hidden="true"
                    class="size-5 object-contain"
                    :class="social.label === 'YouTube ETH Cargo' ? 'grayscale brightness-75' : ''"
                  >
                </a>
              </nav>
            </div>
          </div>

          <div class="col-span-2 min-w-0 lg:col-span-1 lg:col-start-2">
            <h2 class="text-[16px] font-semibold text-text-tertiary">
              Tentang Penulis
            </h2>
            <p class="mt-1 text-[13px] font-normal leading-[1.5] text-text-secondary lg:text-[14px]">
              {{ blogAuthor.description }}
            </p>
          </div>
        </div>
      </section>
    </UiContainer>

    <NuxtPage v-if="isAuthorSearchPage" />

    <MarketingBlogAllArticles
      v-else
      variant="author"
      :author-name="blogAuthor.name"
      :articles="allArticles"
      :per-page="12"
    />
  </div>
</template>
