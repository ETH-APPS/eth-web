<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import chinaFlagUrl from '~/assets/images/flag/china.png'
import taiwanFlagUrl from '~/assets/images/flag/taiwan.png'
import singaporeFlagUrl from '~/assets/images/flag/singapore.png'
import malaysiaFlagUrl from '~/assets/images/flag/malaysia.png'
import koreaFlagUrl from '~/assets/images/flag/korea.png'
import usaFlagUrl from '~/assets/images/flag/USA.png'
import australiaFlagUrl from '~/assets/images/flag/australia.png'

const countries = [
  { name: 'China', label: 'CHINA', flag: chinaFlagUrl },
  { name: 'Taiwan', label: 'TAIWAN', flag: taiwanFlagUrl },
  { name: 'Singapore', label: 'SINGAPORE', flag: singaporeFlagUrl },
  { name: 'Malaysia', label: 'MALAYSIA', flag: malaysiaFlagUrl },
  { name: 'Korea Selatan', label: 'S. KOREA', flag: koreaFlagUrl },
  { name: 'Amerika Serikat', label: 'USA', flag: usaFlagUrl },
  { name: 'Australia', label: 'AUSTRALIA', flag: australiaFlagUrl },
] as const
</script>

<template>
  <section
    id="multinational-routes"
    aria-labelledby="multinational-routes-title"
    class="border-t-4 border-primary-700 bg-bg-0 py-14"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="multinational-routes-title"
          class="text-[32px] font-semibold leading-tight text-primary-500"
        >
          Layanan Kargo Multinasional
        </h2>

        <p class="mx-auto mt-10 max-w-[880px] text-[19px] leading-[1.45] text-text-tertiary">
          Selain spesialisasi rute China–Indonesia, ETH Cargo juga melayani pengiriman kargo
          internasional dari berbagai negara pusat manufaktur dan perdagangan dunia langsung ke
          lokasi bisnis Anda.
        </p>
      </div>

      <ul class="mx-auto mt-10 grid max-w-[980px] grid-cols-2 items-start gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
        <li
          v-for="country in countries"
          :key="country.name"
          class="flex justify-center"
        >
          <NuxtLink
            to="/multinational-cargo#quote"
            :aria-label="`Lihat layanan kargo ${country.name}`"
            class="group flex min-w-[92px] flex-col items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          >
            <span
              aria-hidden="true"
              class="block size-[66px] rounded-full bg-bg-0 p-[3px] shadow-[2px_5px_6px_rgb(52_64_81/0.3)]"
            >
              <img
                :src="country.flag"
                alt=""
                width="60"
                height="60"
                loading="lazy"
                decoding="async"
                class="size-full rounded-full object-cover object-center"
              >
            </span>

            <span
              class="mt-4 text-center text-[14px] font-semibold leading-none text-text-secondary transition-colors duration-200 group-hover:text-primary-500 group-focus-visible:text-primary-500"
            >
              {{ country.label }}
            </span>

            <span
              class="mt-2 flex size-7 translate-y-1 items-center justify-center rounded-lg bg-primary-500 text-bg-0 opacity-0 transition-[background-color,opacity,translate] duration-300 ease-out group-hover:translate-y-0 group-hover:bg-primary-600 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:bg-primary-600 group-focus-visible:opacity-100"
            >
              <ArrowUpRight
                :size="15"
                :stroke-width="2"
                aria-hidden="true"
              />
            </span>
          </NuxtLink>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>