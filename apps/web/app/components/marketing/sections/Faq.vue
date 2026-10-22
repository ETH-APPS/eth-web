<script setup lang="ts">
import {
  Calculator,
  ChevronDown,
  Mail,
  MessageCircle,
} from 'lucide-vue-next'
import whatsappUrl from '~/assets/images/marketing/whatsapp.png'

const faqs = [
  {
    question: 'Apa itu ETH Cargo?',
    answer:
      'ETH Cargo adalah perusahaan jasa pengiriman barang internasional (freight forwarder) spesialis rute China–Indonesia. Kami berfokus memberikan solusi logistik All-In Door-to-Door yang aman, transparan, dan terintegrasi khusus untuk kebutuhan bisnis (B2B), manufaktur, distributor, dan pelaku usaha di Indonesia.',
  },
  {
    question: 'Mengapa harus memilih ETH Cargo dibandingkan forwarder lain?',
    answer:
      'ETH Cargo menghadirkan keunggulan utama berupa garansi biaya All-In yang transparan tanpa hidden fee, jaringan gudang penerimaan sendiri di titik strategis China, sistem tracking real-time, garansi perlindungan kargo 100%, serta Dedicated Account Manager yang siap mendampingi operasional bisnis Anda.',
  },
  {
    question: 'Apakah ETH Cargo melayani pengiriman resmi & legalitas penuh?',
    answer:
      'Ya. ETH Cargo mengelola seluruh proses kepabeanan (customs clearance) secara resmi dan profesional, lengkap dengan kepengurusan dokumen pajak dan izin impor yang sesuai dengan regulasi pemerintah Indonesia.',
  },
  {
    question: 'Di mana saja lokasi gudang operasional ETH Cargo?',
    answer:
      'Gudang konsolidasi utama kami di China terletak di Guangzhou dan Yiwu. Sementara untuk gudang penerimaan, penyortiran, dan distribusi di Indonesia berpusat di Jakarta untuk menjangkau pengiriman ke seluruh wilayah Indonesia.',
  },
  {
    question: 'Bagaimana komitmen ETH Cargo terhadap keamanan barang?',
    answer:
      'Keamanan kargo adalah prioritas utama kami. Setiap pengiriman yang terdaftar di ETH Cargo dilindungi oleh jaminan asuransi kargo dengan skema ganti rugi hingga 100% untuk memastikan risiko operasional bisnis Anda tetap terproteksi.',
  },
]

const activeFaq = ref<number | null>(1)

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<template>
  <section
    id="faq"
    aria-labelledby="faq-title"
    class="bg-bg-0 py-16"
  >
    <UiContainer>
      <div class="grid grid-cols-[380px_minmax(0,1fr)] items-start gap-8">
        <div>
          <h2
            id="faq-title"
            class="text-[120px] font-bold leading-none tracking-tight text-primary-500"
          >
            FAQ
          </h2>
          <p class="mt-5 text-[24px] font-normal text-text-disable">
            Mengenal ETH Cargo
          </p>
          <p class="mt-8 text-[16px] font-normal leading-[1.55] text-text-secondary">
            Segala hal yang perlu Anda ketahui tentang ETH Cargo, komitmen layanan kami, dan
            bagaimana kami menjadi mitra terpercaya untuk ekosistem logistik bisnis Anda.
          </p>
        </div>

        <div class="space-y-2">
          <article
            v-for="(faq, index) in faqs"
            :key="faq.question"
            class="rounded-2xl border transition-[border-color,box-shadow] duration-300"
            :class="activeFaq === index
              ? 'border-border-200 shadow-[0_5px_12px_rgba(15,23,42,0.10)]'
              : 'border-transparent hover:border-border-200 hover:shadow-[0_2px_6px_rgba(15,23,42,0.06)]'"
          >
            <h3>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :aria-expanded="activeFaq === index"
                :aria-controls="`faq-answer-${index}`"
                @click="toggleFaq(index)"
              >
                <span
                  aria-hidden="true"
                  class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4fb3a5] text-[12px] font-medium text-bg-0"
                >
                  Q
                </span>
                <span
                  class="flex-1 text-[16px] transition-colors duration-200"
                  :class="activeFaq === index ? 'font-medium text-primary-500' : 'font-normal text-text-secondary'"
                >
                  {{ faq.question }}
                </span>
                <ChevronDown
                  :size="20"
                  :stroke-width="1.8"
                  aria-hidden="true"
                  class="shrink-0 text-text-disable transition-transform duration-300"
                  :class="activeFaq === index ? 'rotate-180' : ''"
                />
              </button>
            </h3>

            <div
              :id="`faq-answer-${index}`"
              class="grid transition-[grid-template-rows] duration-300 ease-out"
              :class="activeFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <div class="mx-5 flex gap-3 border-t border-border-200 pb-5 pt-4">
                  <span
                    aria-hidden="true"
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-300 text-[12px] font-medium text-bg-0"
                  >
                    A
                  </span>
                  <p class="text-[16px] font-normal leading-[1.55] text-text-secondary">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>

  <section
    id="quote"
    aria-labelledby="quote-title"
    class="bg-primary-600 py-14 text-bg-0"
  >
    <div class="mx-auto w-full max-w-[1250px] px-6">
      <div class="flex items-end justify-between gap-14">
        <div class="max-w-[600px]">
          <h2
            id="quote-title"
            class="text-[30px] font-semibold leading-tight"
          >
            Siap Kirim Kargo Impor Anda?
          </h2>
          <p class="mt-3 text-[20px] font-medium leading-[1.35] text-bg-0/95">
            Hitung estimasi pengiriman dengan kalkulator kargo kami, atau konsultasikan kebutuhan
            impor bisnis Anda langsung bersama tim ahli ETH Cargo.
          </p>

          <p class="mt-6 text-[13px] font-medium text-bg-0/90">
            Atau hubungi kami via email:
          </p>
          <a
            href="mailto:email@ethcargo.co.id"
            class="mt-1.5 inline-flex items-center gap-2 text-[13px] text-bg-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <Mail
              :size="18"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span>email@ethcargo.co.id</span>
          </a>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <a
            href="#main-services"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-primary-500 px-6 text-[14px] text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <Calculator
              :size="19"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span>Hitung Biaya</span>
          </a>
          <a
            href="#quote"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-green-500 px-6 text-[14px] text-bg-0 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-0"
          >
            <span>Konsultasi Gratis</span>
            <img
              :src="whatsappUrl"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              class="size-5 shrink-0 object-contain"
            >
          </a>
        </div>
      </div>
    </div>
  </section>
</template>