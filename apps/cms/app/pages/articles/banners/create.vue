<script setup lang="ts">
import { ArrowLeft, ImagePlus } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Buat banner | ETH Cargo CMS' })

const { isCreatingBanner, createBanner } = useArticleBanners()

const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxImageBytes = 5 * 1024 * 1024
const inputClass = 'mt-1.5 block min-h-11 w-full rounded-lg border border-border-200 px-3 py-2.5 text-[13px] text-text-secondary outline-none placeholder:text-text-disable focus:border-primary-500'

const title = ref('')
const description = ref('')
const image = shallowRef<File>()
const imageUrl = ref('')
const imageError = ref('')
const formError = ref('')

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
    await createBanner({
      title: title.value.trim(),
      description: description.value.trim(),
      image: image.value,
    })
  } catch {
    formError.value = 'Banner belum dapat disimpan. Periksa gambar dan coba lagi.'
    return
  }

  await navigateTo('/articles/banners')
}

onBeforeUnmount(clearImage)
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header>
      <NuxtLink to="/articles/banners" class="inline-flex min-h-11 items-center gap-2 rounded text-[13px] font-medium text-text-tertiary hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
        <ArrowLeft :size="16" aria-hidden="true" /> Daftar banner
      </NuxtLink>
      <h1 class="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.04em] text-text-secondary sm:text-[32px]">Buat banner</h1>
    </header>

    <div class="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_365px]">
      <section class="min-w-0 rounded-xl border border-border-200 bg-bg-0" aria-labelledby="banner-preview-title">
        <div class="border-b border-border-200 px-4 py-4 sm:px-6">
          <h2 id="banner-preview-title" class="text-[16px] font-semibold text-text-secondary">Pratinjau banner artikel</h2>
        </div>
        <div class="p-3 2xl:p-5">
          <CmsBannerPreview :title="title.trim() || 'Judul banner'" :description="description.trim() || 'Deskripsi banner'" :image="imageUrl ? { url: imageUrl } : undefined" />
        </div>
      </section>

      <section class="min-w-0 rounded-xl border border-border-200 bg-bg-0" aria-labelledby="banner-form-title">
        <div class="border-b border-border-200 px-4 py-4 sm:px-6">
          <h2 id="banner-form-title" class="text-[16px] font-semibold text-text-secondary">Konten banner</h2>
        </div>
      <form class="space-y-4 p-4 sm:p-6" @submit.prevent="submitBanner">
        <fieldset :disabled="isCreatingBanner" class="min-w-0 space-y-4">
          <label class="block text-[12px] font-medium text-text-secondary">
            Judul banner
            <input v-model="title" type="text" required maxlength="180" placeholder="Contoh: Siap untuk Transfer RMB?" :class="inputClass">
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

        <p v-if="formError" role="alert" class="text-[12px] text-primary-700">{{ formError }}</p>

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
