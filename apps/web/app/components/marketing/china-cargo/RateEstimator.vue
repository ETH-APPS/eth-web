<script setup lang="ts">
import { ArrowUpRight, ChevronDown } from 'lucide-vue-next'

const categories = [
  'Barang umum',
  'Elektronik',
  'Fashion & tekstil',
  'Mesin & perlengkapan industri',
  'Furnitur & perlengkapan rumah',
  'Kosmetik & perawatan diri',
]

const cargoServices = [
  'FCL Cargo',
  'LCL Cargo',
  'Air Cargo',
]
</script>

<template>
  <section
    id="rate-estimator"
    aria-labelledby="rate-estimator-title"
    class="bg-bg-100 py-16 sm:py-20"
  >
    <UiContainer>
      <div class="text-center">
        <h2
          id="rate-estimator-title"
          class="text-[30px] font-semibold leading-tight text-primary-500 sm:text-[34px]"
        >
          Hitung Estimasi Tarif
        </h2>

        <p class="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.55] text-text-tertiary sm:text-[15px]">
          Dapatkan kalkulasi perkiraan biaya pengiriman All-In dari China ke Indonesia secara
          instan untuk perencanaan modal bisnis Anda.
        </p>
      </div>

      <form
        class="mx-auto mt-8 max-w-[560px] rounded-[20px] border border-border-200 bg-bg-0 p-5 shadow-md sm:p-7"
        @submit.prevent
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              for="item-name"
              class="mb-2 block text-[12px] font-medium text-text-secondary"
            >
              Nama Barang
            </label>
            <input
              id="item-name"
              name="item-name"
              type="text"
              required
              autocomplete="off"
              placeholder="Masukkan nama barang"
              class="h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </div>

          <div>
            <label
              for="item-category"
              class="mb-2 block text-[12px] font-medium text-text-secondary"
            >
              Kategori Barang
            </label>

            <div class="relative">
              <select
                id="item-category"
                name="item-category"
                required
                class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-3 pr-10 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] invalid:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="" disabled selected>
                  Pilih kategori
                </option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>

              <ChevronDown
                :size="17"
                :stroke-width="1.8"
                aria-hidden="true"
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
            </div>

            <p class="mt-1.5 text-[10px] leading-tight text-text-tertiary">
              Bingung kategori?
              <NuxtLink
                to="#quote"
                class="font-medium text-primary-500 underline underline-offset-2 hover:text-primary-700"
              >
                Hubungi Customer Service
              </NuxtLink>
            </p>
          </div>
        </div>

        <div class="mt-4">
          <label
            for="cargo-service"
            class="mb-2 block text-[12px] font-medium text-text-secondary"
          >
            Jenis Layanan Kargo
          </label>

          <div class="relative">
            <select
              id="cargo-service"
              name="cargo-service"
              required
              class="h-12 w-full appearance-none rounded-lg border border-border-200 bg-bg-0 px-3 pr-10 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] invalid:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="" disabled selected>
                Pilih jenis layanan
              </option>
              <option
                v-for="service in cargoServices"
                :key="service"
                :value="service"
              >
                {{ service }}
              </option>
            </select>

            <ChevronDown
              :size="17"
              :stroke-width="1.8"
              aria-hidden="true"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
          </div>
        </div>

        <fieldset class="mt-4">
          <legend class="sr-only">
            Dimensi barang
          </legend>

          <div class="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            <label class="block text-[12px] font-medium text-text-secondary">
              Panjang <span class="font-normal text-text-tertiary">(cm)</span>
              <input
                name="length"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>

            <label class="block text-[12px] font-medium text-text-secondary">
              Lebar <span class="font-normal text-text-tertiary">(cm)</span>
              <input
                name="width"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>

            <label class="block text-[12px] font-medium text-text-secondary">
              Tinggi <span class="font-normal text-text-tertiary">(cm)</span>
              <input
                name="height"
                type="number"
                min="0"
                step="0.1"
                required
                inputmode="decimal"
                placeholder="0 cm"
                class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
            </label>
          </div>
        </fieldset>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <label class="block text-[12px] font-medium text-text-secondary">
            Berat Box <span class="font-normal text-text-tertiary">(kg)</span>
            <input
              name="weight"
              type="number"
              min="0"
              step="0.1"
              required
              inputmode="decimal"
              placeholder="0 kg"
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>

          <label class="block text-[12px] font-medium text-text-secondary">
            Jumlah Box <span class="font-normal text-text-tertiary">(koli)</span>
            <input
              name="box-count"
              type="number"
              min="1"
              step="1"
              required
              inputmode="numeric"
              placeholder="0 box"
              class="mt-2 h-12 w-full rounded-lg border border-border-200 bg-bg-0 px-3 text-[13px] text-text-secondary outline-none transition-[border-color,box-shadow] placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
          </label>
        </div>

        <div class="mt-7 flex justify-end">
          <button
            type="submit"
            class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary-500 px-5 text-[13px] font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto"
          >
            Hitung Estimasi Tarif
          </button>
        </div>
      </form>

      <div class="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
        <p class="text-[12px] text-text-tertiary">
          Pelajari panduan pengkategorian barang
        </p>

        <NuxtLink
          to="/#sourcing"
          class="inline-flex h-9 items-center gap-2 rounded-xl bg-primary-50 px-4 text-[11px] font-medium text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span>Lihat Panduan Kategori</span>
          <ArrowUpRight
            :size="15"
            :stroke-width="2"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>
