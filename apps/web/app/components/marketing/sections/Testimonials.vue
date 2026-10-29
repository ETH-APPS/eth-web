<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const topTestimonials = [
  {
    name: 'Uname_1',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    attachments: 2,
  },
  {
    name: 'Uname_2',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    attachments: 3,
  },
  {
    name: 'Uname_3',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    attachments: 1,
  },
]

const bottomTestimonials = [
  {
    name: 'Uname_4',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    name: 'Uname_5',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    name: 'Uname_6',
    reviewSource: 'Via Extension Review',
    reviewDate: '99 months ago',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
]
</script>

<template>
  <section
    id="testimoni"
    aria-labelledby="testimonials-title"
    class="overflow-hidden bg-bg-100 py-16"
  >
    <UiContainer>
      <div class="text-center">
        <p class="text-[12px] font-normal uppercase text-primary-700 lg:text-[20px]">
          Testimoni Klien
        </p>
        <h2
          id="testimonials-title"
          class="mt-2 text-[24px] font-semibold leading-tight text-primary-500 lg:text-[34px]"
        >
          Kepercayaan dari Para Pemilik Bisnis
        </h2>
        <p class="mx-auto mt-6 max-w-[950px] text-[14px] leading-[1.45] text-text-secondary lg:text-[20px]">
          Dengar langsung pengalaman para pelaku usaha, pemilik brand, dan distributor yang telah
          mempercayakan pengiriman kargo China–Indonesia mereka kepada ETH Cargo.
        </p>
      </div>

      <div class="mx-[calc(50%_-_50vw)] mt-7 max-w-[1440px] space-y-5 lg:mx-auto">
        <div class="marquee relative overflow-hidden">
          <div class="marquee-track marquee-track-left">
            <div class="marquee-group">
              <MarketingTestimonialCard
                v-for="testimonial in topTestimonials"
                :key="`top-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
            <div
              class="marquee-group"
              aria-hidden="true"
            >
              <MarketingTestimonialCard
                v-for="testimonial in topTestimonials"
                :key="`top-copy-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
          </div>
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-40 bg-gradient-to-r from-bg-100 via-bg-100/70 to-transparent lg:block" />
          <div class="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-40 bg-gradient-to-l from-bg-100 via-bg-100/70 to-transparent lg:block" />
        </div>

        <div class="marquee relative overflow-hidden">
          <div class="marquee-track marquee-track-right">
            <div class="marquee-group">
              <MarketingTestimonialCard
                v-for="testimonial in bottomTestimonials"
                :key="`bottom-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
            <div
              class="marquee-group"
              aria-hidden="true"
            >
              <MarketingTestimonialCard
                v-for="testimonial in bottomTestimonials"
                :key="`bottom-copy-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
          </div>
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-40 bg-gradient-to-r from-bg-100 via-bg-100/70 to-transparent lg:block" />
          <div class="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-40 bg-gradient-to-l from-bg-100 via-bg-100/70 to-transparent lg:block" />
        </div>
      </div>

      <div class="mt-14 hidden text-center lg:block">
        <p class="text-[16px] text-text-tertiary">
          Siap mengoptimalkan rantai pasok dan efisiensi pengiriman bisnis Anda?
        </p>
        <a
          href="#quote"
          class="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-[14px] text-bg-0 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Konsultasi Gratis</span>
          <ArrowUpRight
            :size="18"
            :stroke-width="3"
            aria-hidden="true"
          />
        </a>
      </div>
    </UiContainer>
  </section>
</template>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee-group {
  display: flex;
  gap: 1.25rem;
  padding-right: 1.25rem;
}

/* zoom 1.15 hanya untuk desktop (lg = 64rem), supaya ukuran card di mobile tidak ikut membesar */
@media (min-width: 64rem) {
  .marquee-group {
    zoom: 1.15;
  }
}

.marquee-track-left {
  animation: marquee-left 28s linear infinite;
}

.marquee-track-right {
  animation: marquee-right 32s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes marquee-right {
  from {
    transform: translateX(-50%);
  }

  to {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation-play-state: paused;
  }
}
</style>