<script setup lang="ts">
import { whatsappConsultationUrl } from '~/constants/whatsapp'
import { googleReviews } from '~/data/googleReviews'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
})
// Ulasan 5 bintang ini hanya berisi petunjuk alamat, bukan pengalaman layanan.
const addressOnlyReviewId = 'ChZDSUhNMG9nS0VJQ0FnTURBZ3NEZlNBEAE'
const testimonials = googleReviews
  .filter(review => review.stars === 5 && review.reviewId !== addressOnlyReviewId)
  .map(review => ({
    name: review.reviewerName,
    reviewSource: 'Google Maps',
    reviewDate: dateFormatter.format(new Date(review.publishedAtDate)),
    content: review.text,
    avatar: review.reviewerPhotoUrl,
    stars: review.stars,
    reviewUrl: review.reviewUrl,
  }))
const rowSplit = Math.ceil(testimonials.length / 2)
const topTestimonials = testimonials.slice(0, rowSplit)
const bottomTestimonials = testimonials.slice(rowSplit)
</script>

<template>
  <section
    id="testimoni"
    aria-labelledby="testimonials-title"
    class="overflow-hidden bg-bg-100 py-16"
  >
    <!-- Path bintang lucide `star`, dipakai ulang oleh MarketingTestimonialCard lewat <use> -->
    <svg aria-hidden="true" width="0" height="0" class="absolute size-0 overflow-hidden">
      <symbol id="testimonial-star" viewBox="0 0 24 24">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </symbol>
    </svg>

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
              inert
            >
              <MarketingTestimonialCard
                v-for="testimonial in topTestimonials"
                :key="`top-copy-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
            <div
              class="marquee-group"
              aria-hidden="true"
              inert
            >
              <MarketingTestimonialCard
                v-for="testimonial in topTestimonials"
                :key="`top-copy-2-${testimonial.name}`"
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
              inert
            >
              <MarketingTestimonialCard
                v-for="testimonial in bottomTestimonials"
                :key="`bottom-copy-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
            <div
              class="marquee-group"
              aria-hidden="true"
              inert
            >
              <MarketingTestimonialCard
                v-for="testimonial in bottomTestimonials"
                :key="`bottom-copy-2-${testimonial.name}`"
                v-bind="testimonial"
              />
            </div>
          </div>
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-40 bg-gradient-to-r from-bg-100 via-bg-100/70 to-transparent lg:block" />
          <div class="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-40 bg-gradient-to-l from-bg-100 via-bg-100/70 to-transparent lg:block" />
        </div>
      </div>

      <div class="mt-14 hidden text-center lg:block">
        <p class="text-[16px] font-normal text-text-tertiary">
          Siap mengoptimalkan rantai pasok dan efisiensi pengiriman bisnis Anda?
        </p>
        <UiAnimatedArrowButton
          :href="whatsappConsultationUrl"
          target="_blank"
          tone="green"
          :height="48"
          class="mt-3"
        >
          Konsultasi Gratis
        </UiAnimatedArrowButton>
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
    transform: translateX(-33.333333%);
  }
}

@keyframes marquee-right {
  from {
    transform: translateX(-33.333333%);
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
