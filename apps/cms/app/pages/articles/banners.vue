<script setup lang="ts">
import { ImagePlus, Plus } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Banner | ETH Cargo CMS' })

const { banners, isLoading, loadError, reloadBanners, isCreatingBanner, createBanner } = useArticleBanners()

const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxImageBytes = 5 * 1024 * 1024
const inputClass = 'mt-1.5 block min-h-11 w-full rounded-lg border border-border-200 px-3 py-2.5 text-[13px] text-text-secondary outline-none placeholder:text-text-disable focus:border-primary-500'

const selectedBannerId = ref('')
const selectedBanner = computed(() => banners.value.find(banner => banner.id === selectedBannerId.value) ?? banners.value[0])
const titleInput = useTemplateRef<HTMLInputElement>('titleInput')
const title = ref('')
const description = ref('')
const image = shallowRef<File>()
const imageUrl = ref('')
const imageError = ref('')
const formError = ref('')
const savedMessage = ref('')

function clearImage() {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  image.value = undefined
  imageUrl.value = ''
}

function chooseImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  clearImage()
  savedMessage.value = ''
  if (!acceptedImageTypes.includes(file.type) || file.size === 0 || file.size > maxImageBytes) {
    imageError.value = 'Pilih gambar JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.'
    return
  }

  image.value = file
  imageUrl.value = URL.createObjectURL(file)
  imageError.value = ''
}

async function submitBanner() {
  if (isCreatingBanner.value) return
  savedMessage.value = ''
  formError.value = ''

  if (!image.value) {
    imageError.value ||= 'Gambar banner wajib dipilih.'
    return
  }
  if (!title.value.trim() || !description.value.trim()) {
    formError.value = 'Isi judul dan deskripsi banner.'
    return
  }

  try {
    const banner = await createBanner({
      title: title.value.trim(),
      description: description.value.trim(),
      image: image.value,
    })
    selectedBannerId.value = banner.id
    title.value = ''
    description.value = ''
    clearImage()
    savedMessage.value = 'Banner berhasil disimpan dan tersedia untuk dipilih di editor artikel.'
  } catch {
    formError.value = 'Banner belum dapat disimpan. Periksa gambar dan coba lagi.'
  }
}

onBeforeUnmount(clearImage)
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-semibold tracking-[0.16em] text-primary-500">MANAJEMEN KONTEN</p>
        <h1 class="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.04em] text-text-secondary sm:text-[32px]">Banner</h1>
        <p class="mt-2 text-[13px] leading-6 text-text-tertiary">Kelola banner yang dapat digunakan di halaman artikel.</p>
      </div>
      <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="titleInput?.focus()">
        <Plus :size="15" aria-hidden="true" /> Buat banner
      </button>
    </header>

    <div class="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,365px)]">
      <section class="min-w-0 rounded-xl border border-border-200 bg-bg-0" aria-labelledby="banner-list-title">
        <div class="border-b border-border-200 px-4 sm:px-6">
          <h2 id="banner-list-title" class="inline-flex min-h-12 items-center gap-2 border-b-2 border-primary-500 text-[12px] font-semibold text-primary-500">
            Semua banner <span v-if="!isLoading && !loadError" class="text-text-tertiary">{{ banners.length }}</span>
          </h2>
        </div>

        <div v-if="isLoading" role="status" class="px-5 py-10 text-center text-[13px] text-text-tertiary">Memuat banner...</div>
        <div v-else-if="loadError && !banners.length" class="px-5 py-10 text-center">
          <p class="text-[13px] text-text-secondary">Daftar banner belum dapat dimuat.</p>
          <button type="button" class="mt-2 min-h-11 rounded px-3 text-[13px] font-semibold text-primary-500 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-500" @click="reloadBanners()">Coba lagi</button>
        </div>
        <p v-else-if="!selectedBanner" class="px-5 py-10 text-center text-[13px] text-text-tertiary">Belum ada banner. Isi formulir untuk membuat banner pertama.</p>

        <div v-else class="space-y-3 p-3 sm:p-5">
          <div id="saved-banner-preview" role="region" class="rounded-xl border border-border-200 p-3 sm:p-4" aria-label="Pratinjau banner tersimpan">
            <CmsBannerPreview :title="selectedBanner.title" :description="selectedBanner.description" :image="selectedBanner.image" />
          </div>

          <ul class="space-y-2" aria-label="Pilih banner untuk ditinjau">
            <li v-for="banner in banners" :key="banner.id">
              <button
                type="button"
                aria-controls="saved-banner-preview"
                :aria-pressed="selectedBanner.id === banner.id"
                class="flex w-full min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                :class="selectedBanner.id === banner.id ? 'border-primary-200 text-primary-600' : 'border-border-200 text-text-secondary'"
                @click="selectedBannerId = banner.id"
              >
                <img :src="banner.image.url" alt="" width="88" height="56" loading="lazy" class="h-12 w-16 shrink-0 rounded bg-bg-100 object-contain sm:w-[88px]">
                <span class="min-w-0 flex-1 wrap-anywhere text-[13px] font-semibold">{{ banner.title }}</span>
                <span v-if="banner.isDefault" class="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-800">Default</span>
              </button>
            </li>
          </ul>
        </div>
      </section>

      <section class="min-w-0 rounded-xl border border-border-200 bg-bg-0" aria-labelledby="banner-form-title">
        <div class="border-b border-border-200 px-4 py-5 sm:px-6">
          <h2 id="banner-form-title" class="text-[16px] font-semibold text-text-secondary">Buat banner baru</h2>
          <p class="mt-1 text-[12px] leading-5 text-text-tertiary">Isi konten banner untuk digunakan di artikel.</p>
        </div>

        <form class="space-y-4 p-4 sm:p-6" @submit.prevent="submitBanner">
          <fieldset :disabled="isCreatingBanner" class="min-w-0 space-y-4">
            <label class="block text-[12px] font-medium text-text-secondary">
              Judul banner
              <input ref="titleInput" v-model="title" type="text" required maxlength="180" placeholder="Contoh: Siap untuk Transfer RMB?" :class="inputClass" class="scroll-mt-24">
            </label>

            <label class="block text-[12px] font-medium text-text-secondary">
              Deskripsi
              <textarea v-model="description" required maxlength="1000" rows="4" placeholder="Tulis deskripsi yang tampil di banner" :class="inputClass" class="resize-y" />
            </label>

            <div>
              <p class="text-[12px] font-medium text-text-secondary">Gambar banner</p>
              <input id="banner-image" type="file" :accept="acceptedImageTypes.join(',')" aria-label="Gambar banner" :aria-describedby="imageError ? 'banner-image-help banner-image-error' : 'banner-image-help'" :aria-invalid="Boolean(imageError)" class="peer sr-only" @change="chooseImage">
              <label for="banner-image" class="mt-1.5 flex min-h-24 cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border-300 p-4 text-center text-text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-primary-500">
                <img v-if="imageUrl" :src="imageUrl" alt="" class="h-16 max-w-full object-contain">
                <ImagePlus v-else :size="22" class="text-text-tertiary" aria-hidden="true" />
                <span class="max-w-full wrap-anywhere text-[12px] font-semibold">{{ image?.name ?? 'Unggah gambar' }}</span>
                <span id="banner-image-help" class="text-[11px] text-text-tertiary">JPG, PNG, atau WebP · maksimal 5 MB</span>
                <span class="mt-1 inline-flex min-h-8 items-center rounded-md border border-border-200 px-3 text-[11px] font-medium text-primary-600">{{ image ? 'Ganti gambar' : 'Pilih file' }}</span>
              </label>
              <p v-if="imageError" id="banner-image-error" role="alert" class="mt-2 text-[12px] text-primary-700">{{ imageError }}</p>
            </div>
          </fieldset>

          <div v-if="title.trim() || description.trim() || imageUrl" role="region" class="space-y-2" aria-labelledby="draft-banner-preview-title">
            <h3 id="draft-banner-preview-title" class="text-[12px] font-semibold text-text-secondary">Pratinjau banner baru</h3>
            <CmsBannerPreview :title="title.trim() || 'Judul banner'" :description="description.trim() || 'Deskripsi banner'" :image="imageUrl ? { url: imageUrl } : undefined" />
          </div>

          <p v-if="formError" role="alert" class="text-[12px] text-primary-700">{{ formError }}</p>
          <p v-if="savedMessage" role="status" class="text-[12px] text-green-800">{{ savedMessage }}</p>

          <div class="flex justify-end">
            <button type="submit" :disabled="isCreatingBanner" class="min-h-11 rounded-lg bg-primary-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-wait disabled:opacity-60">
              {{ isCreatingBanner ? 'Menyimpan...' : 'Simpan banner' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
