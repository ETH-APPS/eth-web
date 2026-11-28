<script setup lang="ts">
import axios from 'axios'
import { Plus } from 'lucide-vue-next'
import type { TaxonomyResource } from '~/services/api/articles'

const props = defineProps<{
  resource: TaxonomyResource
  label: string
  description: string
  placeholder: string
  showFormInitially?: boolean
}>()

const { items, isLoading, loadError, reload, isCreating, create } = useArticleTaxonomy(props.resource)
const panelId = useId()
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')
const openButton = useTemplateRef<HTMLButtonElement>('openButton')
const formOpen = ref(props.showFormInitially ?? false)
const name = ref('')
const errorMessage = ref('')
const successMessage = ref('')

async function openForm() {
  formOpen.value = true
  await nextTick()
  nameInput.value?.focus()
}

async function closeForm() {
  formOpen.value = false
  name.value = ''
  errorMessage.value = ''
  await nextTick()
  openButton.value?.focus()
}

async function submitForm() {
  if (isCreating.value) return
  errorMessage.value = ''
  successMessage.value = ''

  const value = name.value.trim()
  if (!value) {
    errorMessage.value = `Nama ${props.label} wajib diisi.`
    return
  }

  try {
    const created = await create(value)
    name.value = ''
    successMessage.value = `“${created.name}” berhasil ditambahkan.`
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    if (status === 409)
      errorMessage.value = `Nama ${props.label} tersebut sudah digunakan.`
    else if (status === 400)
      errorMessage.value = `Masukkan nama ${props.label} yang dapat digunakan sebagai slug.`
    else
      errorMessage.value = `Gagal menyimpan ${props.label}. Coba lagi.`
  }
}
</script>

<template>
  <div class="min-w-0 space-y-4">
    <section class="overflow-hidden rounded-xl border border-border-200 bg-bg-0" :aria-labelledby="`${panelId}-list-title`">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border-200 px-4 py-5 sm:px-6">
        <div>
          <h2 :id="`${panelId}-list-title`" class="text-[16px] font-semibold text-text-secondary first-letter:uppercase">{{ label }} artikel</h2>
          <p class="mt-1 text-[12px] leading-5 text-text-tertiary">{{ description }}</p>
        </div>
        <button ref="openButton" type="button" :aria-expanded="formOpen" :aria-controls="`${panelId}-form`" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-500 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="openForm">
          <Plus :size="15" aria-hidden="true" /> Buat {{ label }}
        </button>
      </div>

      <p v-if="isLoading" role="status" class="px-4 py-8 text-center text-[13px] text-text-tertiary">Memuat {{ label }}...</p>
      <div v-else-if="loadError && !items.length" class="px-4 py-8 text-center text-[13px] text-text-tertiary">
        <p>Daftar {{ label }} belum dapat dimuat.</p>
        <button type="button" class="mt-2 min-h-11 rounded px-3 font-semibold text-primary-500 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-500" @click="reload()">Coba lagi</button>
      </div>
      <p v-else-if="!items.length" class="px-4 py-8 text-center text-[13px] text-text-tertiary">Belum ada {{ label }}.</p>

      <ul v-else class="divide-y divide-border-200 px-4 sm:px-6">
        <li v-for="item in items" :key="item.id" class="py-4">
          <p class="wrap-anywhere text-[13px] font-medium text-text-secondary">{{ item.name }}</p>
          <p class="mt-1 wrap-anywhere text-[11px] text-text-tertiary"><span class="sr-only">Slug </span>{{ item.slug }}</p>
        </li>
      </ul>
    </section>

    <section v-show="formOpen" :id="`${panelId}-form`" class="rounded-xl border border-border-200 bg-bg-0 p-4 sm:p-6" :aria-labelledby="`${panelId}-form-title`">
      <h3 :id="`${panelId}-form-title`" class="text-[14px] font-semibold text-text-secondary first-letter:uppercase">{{ label }} baru</h3>
      <form class="mt-4 space-y-4" @submit.prevent="submitForm">
        <div>
          <label :for="`${panelId}-name`" class="block text-[12px] font-medium text-text-secondary">Nama {{ label }}</label>
          <input
            :id="`${panelId}-name`"
            ref="nameInput"
            v-model="name"
            type="text"
            required
            maxlength="100"
            :placeholder="placeholder"
            :disabled="isCreating"
            :aria-invalid="Boolean(errorMessage)"
            :aria-describedby="errorMessage ? `${panelId}-hint ${panelId}-error` : `${panelId}-hint`"
            class="mt-1.5 block min-h-11 w-full scroll-mt-28 rounded-lg border border-border-200 px-3 py-2.5 text-[13px] text-text-secondary outline-none placeholder:text-text-tertiary focus:border-primary-500 disabled:opacity-60"
            @input="errorMessage = ''; successMessage = ''"
          >
          <p :id="`${panelId}-hint`" class="mt-1.5 text-[11px] text-text-tertiary">Slug dibuat otomatis dari nama.</p>
        </div>

        <p v-if="errorMessage" :id="`${panelId}-error`" role="alert" class="text-[12px] text-primary-700">{{ errorMessage }}</p>
        <p v-if="successMessage" role="status" class="wrap-anywhere text-[12px] text-green-800">{{ successMessage }}</p>

        <div class="flex gap-2">
          <button type="button" :disabled="isCreating" class="min-h-11 rounded-lg border border-border-200 px-4 text-[12px] font-semibold text-text-secondary hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-60" @click="closeForm">Batal</button>
          <button type="submit" :disabled="isCreating" class="min-h-11 flex-1 rounded-lg bg-primary-500 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-wait disabled:opacity-60">
            {{ isCreating ? 'Menyimpan...' : `Simpan ${label}` }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
