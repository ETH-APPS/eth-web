<script setup lang="ts">
import deaMaharaniAvatar from '~/assets/images/marketing/testimonials/dea-maharani.jpg'
import helsaAvatar from '~/assets/images/marketing/testimonials/helsa.jpg'
import raraRiriAvatar from '~/assets/images/marketing/testimonials/rara-riri.jpg'
import sehunOohAvatar from '~/assets/images/marketing/testimonials/sehun-ooh.jpg'
import { whatsappConsultationUrl } from '~/constants/whatsapp'

const topTestimonials = [
  {
    name: 'Helsa',
    reviewSource: 'Jasa Pembelian & Pengiriman',
    reviewDate: 'Google Review',
    content: 'Cargo yang menurutku gaada minimum pengiriman sama sekali jadi lebih bebas, terbaik pake cargo ini, gass terpercaya juga buat dipake terusan apalagi bonusnya barang import china langsung dianter ke alamat rumah kalian',
    avatar: helsaAvatar,
  },
  {
    name: 'Sehun ooh',
    reviewSource: 'Jasa Pembelian & Pengiriman',
    reviewDate: 'Google Review',
    content: 'ETH Cargo amanah bgt, rekomendasi bgt buat yg mau beli barang barang impor dari china. customer service nya responsif, dan ternyata adabonus member gratis lagi. puas dengan pelayanannya',
    avatar: sehunOohAvatar,
  },
]

const bottomTestimonials = [
  {
    name: 'Rara Riri',
    reviewSource: 'Jasa Pembelian & Pengiriman',
    reviewDate: 'Google Review',
    content: 'amanah bgttt, aku kalau mau beli barang-barang dari china ke sinii. pelayanan cepat, dan CSnya ramah syekali',
    avatar: raraRiriAvatar,
  },
  {
    name: 'Dea Maharani',
    reviewSource: 'Jasa Pembelian & Pengiriman',
    reviewDate: 'Google Review',
    content: 'jasa import barang dari china terbaikk, bisa bantu order dari marketplace china, biaya juga all in pokoknya terbaikk',
    avatar: deaMaharaniAvatar,
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
            <div
              class="marquee-group"
              aria-hidden="true"
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
