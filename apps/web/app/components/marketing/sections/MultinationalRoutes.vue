<script setup lang="ts">
import chinaFlagUrl from '~/assets/images/flag/china.png'
import taiwanFlagUrl from '~/assets/images/flag/taiwan.png'
import singaporeFlagUrl from '~/assets/images/flag/singapore.png'
import malaysiaFlagUrl from '~/assets/images/flag/malaysia.png'
import koreaFlagUrl from '~/assets/images/flag/korea.png'
import usaFlagUrl from '~/assets/images/flag/USA.png'
import australiaFlagUrl from '~/assets/images/flag/australia.png'

withDefaults(defineProps<{
  showTopBorder?: boolean
}>(), {
  showTopBorder: true,
})

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

      <ul class="mx-auto mt-8 grid max-w-[500px] grid-cols-2 items-start gap-x-5 gap-y-8 lg:mt-10 lg:max-w-[980px] lg:grid-cols-7">
        <li
          v-for="country in countries"
          :key="country.name"
          class="flex justify-center last:col-span-2 lg:last:col-span-1"
        >
          <NuxtLink
            to="/multinational-cargo#quote"
            :aria-label="`Lihat layanan kargo ${country.name}`"
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
              {{ country.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
