<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from 'lucide-vue-next'
import facebookDark from '~/assets/images/marketing/facebook-dark.png'
import instagramDark from '~/assets/images/marketing/Instagram-dark.png'
import linkDark from '~/assets/images/marketing/Link-dark.png'
import threadsDark from '~/assets/images/marketing/Threads-dark.png'
import tiktokDark from '~/assets/images/marketing/Tiktok-dark.png'
import xDark from '~/assets/images/marketing/X-dark.png'
import type { ArticleTocSection } from '~/content/articleCatalog'
import { blogAuthor } from '~/constants/blogAuthor'
import { illustratedCtaBanners } from '~/constants/illustratedCtaBanners'

interface RelatedArticle {
  id: string
  title: string
  releaseDate: string
  image: string
  imageAlt: string
  to?: string
}

const props = defineProps<{
  title: string
  author: string
  tags: readonly string[]
  keyPoints: readonly string[]
  bodyHtml: string
  tableOfContents: readonly ArticleTocSection[]
  relatedArticles: readonly RelatedArticle[]
}>()

const articleBanner = illustratedCtaBanners.transfer
const tableOfContents = computed(() => props.tableOfContents)

const expandedSections = ref<string[]>([])
const activeSection = ref(props.tableOfContents[0]?.id ?? '')
const shareUrl = ref('')
const copied = ref(false)

// Garis acuan dari tepi atas layar (px). Heading terakhir yang sudah melewati garis ini dianggap aktif.
// Harus sedikit lebih besar dari scroll-mt-28 (112px) supaya heading hasil klik sidebar langsung aktif.
const ACTIVE_OFFSET = 130
let headingElements: HTMLElement[] = []
let isScrollQueued = false

function isExpanded(id: string) {
  return expandedSections.value.includes(id)
}

function toggleSection(id: string) {
  expandedSections.value = isExpanded(id)
    ? expandedSections.value.filter(sectionId => sectionId !== id)
    : [...expandedSections.value, id]
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

async function copyArticleLink() {
  if (!shareUrl.value || !navigator.clipboard)
    return

  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}

function updateActiveSection() {
  let currentId = headingElements[0]?.id ?? ''

  for (const heading of headingElements) {
    if (heading.getBoundingClientRect().top <= ACTIVE_OFFSET)
      currentId = heading.id
  }

  activeSection.value = currentId
}

function handleScroll() {
  if (isScrollQueued)
    return

  isScrollQueued = true
  requestAnimationFrame(() => {
    updateActiveSection()
    isScrollQueued = false
  })
}

onMounted(() => {
  shareUrl.value = window.location.href

  // Urutan sama dengan urutan di halaman: 1, 1.1, 1.2, 2, 2.1, 3
  headingElements = tableOfContents.value.flatMap(section => [
    document.getElementById(section.id),
    ...section.children.map(child => document.getElementById(child.id)),
  ]).filter((heading): heading is HTMLElement => Boolean(heading))

  updateActiveSection()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

watch(tableOfContents, async () => {
  await nextTick()
  headingElements = tableOfContents.value.flatMap(section => [
    document.getElementById(section.id),
    ...section.children.map(child => document.getElementById(child.id)),
  ]).filter((heading): heading is HTMLElement => Boolean(heading))
  updateActiveSection()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="bg-bg-0 pb-10 pt-6 lg:py-16">
    <UiContainer>
      <nav aria-label="Breadcrumb" class="mx-auto max-w-[1080px]">
        <ol class="flex flex-wrap items-center gap-2 text-[10px] font-medium text-text-tertiary lg:font-normal">
          <li>
            <NuxtLink to="/" class="transition-colors hover:text-primary-500">
              Home
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="13" :stroke-width="1.7" />
          </li>
          <li>
            <NuxtLink to="/artikel" class="transition-colors hover:text-primary-500">
              Blog
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="13" :stroke-width="1.7" />
          </li>
          <li class="line-clamp-1 max-w-[260px] font-medium text-primary-500" aria-current="page">
            {{ props.title }}
          </li>
        </ol>
      </nav>

      <div class="mx-auto mt-8 grid max-w-[1080px] grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside class="hidden lg:sticky lg:top-[90px] lg:flex lg:max-h-[calc(100dvh-106px)] lg:flex-col">
          <nav aria-labelledby="article-toc-title" class="rounded-2xl border border-border-200 bg-white p-4 shadow-md lg:flex lg:min-h-[178px] lg:flex-col">
            <h2 id="article-toc-title" class="text-[20px] font-medium text-primary-500">
              Daftar isi
            </h2>

            <ol class="mt-4 space-y-3 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
              <li v-for="section in tableOfContents" :key="section.id">
                <div class="flex items-start gap-2">
                  <button
                    type="button"
                    class="grid min-w-0 flex-1 grid-cols-[18px_1fr] gap-x-1.5 text-left text-[16px] font-medium leading-[1.4] text-text-secondary transition-colors hover:text-primary-500"
                    @click="scrollToSection(section.id)"
                  >
                    <span>{{ section.number }}</span>
                    <span>{{ section.title }}</span>
                  </button>

                  <button
                    v-if="section.children.length"
                    type="button"
                    :aria-label="`${isExpanded(section.id) ? 'Tutup' : 'Buka'} subbagian ${section.title}`"
                    :aria-expanded="isExpanded(section.id)"
                    :aria-controls="`toc-children-${section.id}`"
                    class="flex size-5 shrink-0 items-center justify-center rounded text-primary-500 hover:bg-primary-50"
                    @click="toggleSection(section.id)"
                  >
                    <ChevronUp v-if="isExpanded(section.id)" :size="15" aria-hidden="true" />
                    <ChevronDown v-else :size="15" aria-hidden="true" />
                  </button>
                </div>

                <div
                  v-if="section.children.length"
                  :id="`toc-children-${section.id}`"
                  :inert="!isExpanded(section.id)"
                  class="grid transition-[grid-template-rows,opacity] duration-200"
                  :class="isExpanded(section.id) ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <ol class="min-h-0 space-y-1 overflow-hidden pl-5">
                    <li v-for="child in section.children" :key="child.id">
                      <button
                        type="button"
                        class="grid w-full grid-cols-[20px_1fr] gap-x-1.5 rounded-lg px-2 py-2 text-left text-[14px] font-normal leading-[1.4] transition-colors"
                        :class="activeSection === child.id
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-text-tertiary hover:bg-bg-100 hover:text-text-secondary'"
                        @click="scrollToSection(child.id)"
                      >
                        <span>{{ child.number }}</span>
                        <span>{{ child.title }}</span>
                      </button>
                    </li>
                  </ol>
                </div>
              </li>
            </ol>
          </nav>

          <div class="mt-4 lg:shrink-0">
            <MarketingBlogArticleCtaBanner class="lg:max-h-[calc(100dvh-300px)] lg:w-auto lg:max-w-full" />
          </div>
        </aside>

        <article aria-labelledby="article-detail-title" class="min-w-0 text-[14px] leading-[1.65] text-text-secondary">
          <section class="overflow-hidden rounded-xl border border-border-200">
            <h2 class="bg-border-200 px-4 py-3 text-[14px] font-semibold text-primary-500">
              Key Points
            </h2>
            <ul class="divide-y divide-border-200 text-[14px]">
              <li v-for="(point, index) in props.keyPoints" :key="point" class="flex gap-3 px-4 py-3" :class="index % 2 ? 'bg-bg-100' : ''">
                <span class="text-primary-500" aria-hidden="true">–</span>
                <span>{{ point }}</span>
              </li>
            </ul>
          </section>

          <div class="article-body mt-6" v-html="props.bodyHtml" />

          <MarketingIllustratedCtaBanner
            v-bind="articleBanner"
            class="mt-4"
            variant="compact"
            :image-top-offset="0"
          />

          <div class="mt-10 hidden border-t border-border-200 pt-6 lg:block">
            <section
              aria-labelledby="article-author-title"
              class="rounded-[20px] border border-border-200 bg-bg-0 p-6 shadow-[0_2px_5px_rgba(15,23,42,0.08)]"
            >
              <div class="grid grid-cols-[76px_minmax(0,1fr)] gap-6">
                <div
                  class="size-[76px] rounded-full bg-[#d9d9d9]"
                  role="img"
                  :aria-label="`Foto profil ${props.author}`"
                />

                <div class="min-w-0">
                  <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div class="min-w-0">
                      <h2 id="article-author-title" class="text-[24px] font-semibold leading-tight text-text-secondary">
                        {{ props.author }}
                      </h2>
                      <p class="mt-1 text-[16px] font-medium text-text-tertiary">
                        {{ blogAuthor.jobTitle }}
                      </p>
                    </div>

                    <NuxtLink
                      :to="blogAuthor.to"
                      class="inline-flex min-h-11 shrink-0 items-center gap-2 text-[14px] font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      <span>Lihat Profil</span>
                      <ArrowUpRight :size="16" :stroke-width="2" aria-hidden="true" />
                    </NuxtLink>
                  </div>

                  <p class="mt-5 text-[16px] leading-[1.4] text-text-secondary">
                    {{ blogAuthor.description }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div class="mt-10 border-y border-border-200 py-4">
            <div class="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <span class="mr-1 text-[14px] font-normal text-text-tertiary">Tag</span>
              <span class="h-px w-5 bg-border-200" aria-hidden="true" />
              <NuxtLink
                v-for="tag in props.tags"
                :key="tag"
                :to="{ path: '/artikel/tags', query: { tag } }"
                class="rounded-md bg-primary-500 px-2.5 py-1 text-[14px] font-normal text-white"
              >
                {{ tag }}
              </NuxtLink>
            </div>

            <div class="mt-2 flex flex-wrap items-center justify-center lg:mt-4 lg:justify-start lg:gap-3">
              <span class="mr-1 hidden text-[14px] text-text-tertiary lg:inline">Share</span>
              <span class="hidden h-px w-5 bg-border-200 lg:inline" aria-hidden="true" />
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Facebook"
                class="inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
              >
                <img :src="facebookDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka Instagram"
                class="inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
              >
                <img :src="instagramDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
              </a>
              <a
                href="https://www.threads.net/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka Threads"
                class="inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
              >
                <img :src="threadsDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka TikTok"
                class="inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
              >
                <img :src="tiktokDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
              </a>
              <a
                :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(props.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke X"
                class="inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
              >
                <img :src="xDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
              </a>
              <button
                type="button"
                :aria-label="copied ? 'Tautan tersalin' : 'Salin tautan artikel'"
                class="relative inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 lg:inline lg:size-auto"
                @click="copyArticleLink"
              >
                <img :src="linkDark" alt="" aria-hidden="true" class="size-7 object-contain lg:size-5">
                <span
                  v-if="copied"
                  class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white"
                >
                  Tersalin
                </span>
              </button>
            </div>
          </div>

          <section class="mt-6" aria-labelledby="related-articles-title">
            <h2 id="related-articles-title" class="text-[16px] font-medium text-primary-500 lg:text-[15px]">
              Related Article
            </h2>

            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MarketingBlogArticlePreviewCard
                v-for="relatedArticle in props.relatedArticles"
                :id="relatedArticle.id"
                :key="relatedArticle.id"
                :title="relatedArticle.title"
                :release-date="relatedArticle.releaseDate"
                :image="relatedArticle.image"
                :image-alt="relatedArticle.imageAlt"
                :to="relatedArticle.to"
                :mobile-title-size="16"
              />
            </div>
          </section>

        </article>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.article-body :deep(h2) {
  margin-top: 28px;
  scroll-margin-top: 112px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.article-body :deep(h3) {
  margin-top: 24px;
  scroll-margin-top: 112px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.article-body :deep(h4) {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
}

.article-body :deep(p),
.article-body :deep(ul),
.article-body :deep(ol),
.article-body :deep(blockquote),
.article-body :deep(table) {
  margin-top: 12px;
}

.article-body :deep(ul) { list-style: disc; padding-left: 24px; }
.article-body :deep(ol) { list-style: decimal; padding-left: 24px; }
.article-body :deep(li + li) { margin-top: 4px; }
.article-body :deep(a) { text-decoration: underline; text-underline-offset: 2px; }
.article-body :deep(a:hover) { color: #144b9b; }
.article-body :deep(img) { max-width: 100%; height: auto; border-radius: 12px; }
.article-body :deep(table) { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
.article-body :deep(th),
.article-body :deep(td) { min-width: 110px; border: 1px solid #e2e5ea; padding: 8px 10px; text-align: left; vertical-align: top; }
.article-body :deep(blockquote) { border-left: 3px solid #e2e5ea; padding-left: 16px; }
</style>
