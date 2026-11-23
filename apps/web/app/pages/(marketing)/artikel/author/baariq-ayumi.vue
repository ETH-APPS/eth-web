<script setup lang="ts">
import linkedinIcon from '~/assets/images/marketing/linkedin.png'
import { blogAuthor } from '~/constants/blogAuthor'

definePageMeta({
  layout: 'marketing',
})

const { allArticles } = useAllBlogArticles()
const route = useRoute()
const isAuthorSearchPage = computed(() => route.path === `${blogAuthor.to}/search`)

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

              <a
                href="https://www.linkedin.com/company/ethcargoindonesia/"
                aria-label="LinkedIn ETH Cargo Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                class="-ml-2 flex size-11 items-center justify-center rounded-md transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:ml-0 lg:size-9"
              >
                <img :src="linkedinIcon" alt="" aria-hidden="true" class="size-8 object-contain">
              </a>
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
