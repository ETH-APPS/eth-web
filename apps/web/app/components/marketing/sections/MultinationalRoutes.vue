<script setup lang="ts">
import chinaFlagUrl from '~/assets/images/flag/china.png'
import { multinationalCountries, multinationalCountryPath } from '~/constants/multinationalCountries'

withDefaults(defineProps<{
  showTopBorder?: boolean
}>(), {
  showTopBorder: true,
})

const route = useRoute()

const allCountries = [
  { name: 'China', navigationName: 'China', routeLabel: 'CHINA', flag: chinaFlagUrl, to: '/china-cargo' },
  ...multinationalCountries.map(country => ({
    ...country,
    to: multinationalCountryPath(country.slug),
  })),
]

const countries = computed(() => allCountries.filter(country => country.to !== route.path))
</script>

<template>
  <section
    id="multinational-routes"
    aria-labelledby="multinational-routes-title"
    class="bg-bg-0 py-14"
    :class="showTopBorder ? 'border-t-4 border-primary-700' : ''"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="multinational-routes-title"
          class="text-[24px] font-bold leading-tight text-primary-500 lg:text-[32px] lg:font-semibold"
        >
          Layanan Kargo Multinasional
        </h2>

        <p class="mx-auto mt-5 max-w-[880px] text-[14px] font-medium leading-[1.45] text-text-tertiary lg:mt-10 lg:text-[19px] lg:font-normal">
          Selain spesialisasi rute China–Indonesia, ETH Cargo juga melayani pengiriman kargo
          internasional dari berbagai negara pusat manufaktur dan perdagangan dunia langsung ke
          lokasi bisnis Anda.
        </p>
      </div>

      <ul
        class="mx-auto mt-8 grid max-w-[500px] grid-cols-2 items-start gap-x-5 gap-y-8 lg:mt-10 lg:max-w-[1080px]"
        :class="countries.length === 7 ? 'lg:grid-cols-7' : 'lg:grid-cols-8'"
      >
        <li
          v-for="(country, index) in countries"
          :key="country.name"
          class="flex justify-center"
          :class="countries.length === 7 && index === countries.length - 1 ? 'col-span-2 lg:col-span-1' : ''"
        >
          <NuxtLink
            :to="country.to"
            :aria-label="`Lihat layanan kargo ${country.navigationName}`"
            class="group flex min-w-[92px] flex-col items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 lg:pb-9"
          >
            <span
              aria-hidden="true"
              class="block size-[64px] rounded-full bg-bg-0 p-[3px] shadow-[2px_5px_6px_rgb(52_64_81/0.3)] lg:size-[66px]"
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
              class="mt-4 text-center text-[16px] font-semibold leading-none text-text-secondary transition-colors duration-200 group-hover:text-primary-500 group-focus-visible:text-primary-500 lg:text-[14px]"
            >
              {{ country.routeLabel }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
