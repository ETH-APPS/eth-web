<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Tulis artikel | ETH Cargo CMS' })

const title = ref('')
const slug = ref('')
const slugEdited = ref(false)
const metaDescription = ref('')
const coverFile = ref<File | null>(null)
const coverPreview = ref('')
const coverAlt = ref('')
const bodyHtml = ref('')
const category = ref('')
const categories = ref<string[]>([])
const newCategory = ref('')
const addingCategory = ref(false)
const tags = ref<string[]>([])
const newTag = ref('')
const addingTag = ref(false)
const keyPoints = ref([
  { id: 1, value: '' },
  { id: 2, value: '' },
  { id: 3, value: '' },
])
let nextPointId = 4
const coverInput = ref<HTMLInputElement | null>(null)
const previewDialog = ref<HTMLDialogElement | null>(null)
const notice = ref('')
const errors = reactive({ title: '', slug: '', metaDescription: '', cover: '', coverAlt: '', body: '', category: '', keyPoints: '' })

const inputClass = 'mt-2 w-full rounded-lg border border-border-200 bg-bg-0 px-3 py-2.5 text-[12px] text-text-secondary outline-none transition-colors placeholder:text-text-disable focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
const labelClass = 'block text-[11px] font-semibold text-text-tertiary'
const bodyText = computed(() => bodyHtml.value.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/(?:p|h2|h3|div)>/gi, '\n\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim())
const previewTitle = computed(() => title.value.trim() || 'Judul artikel')
const seoTitle = computed(() => `${previewTitle.value} | ETH Cargo`)

function toSlug(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180)
}

watch(title, value => {
  if (!slugEdited.value)
    slug.value = toSlug(value)
})

function handleSlugInput() {
  slugEdited.value = true
  slug.value = toSlug(slug.value)
}

function handleCoverChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  errors.cover = ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    errors.cover = 'Gunakan JPG, PNG, atau WebP maksimal 5 MB.'
    input.value = ''
    return
  }

  if (coverPreview.value)
    URL.revokeObjectURL(coverPreview.value)

  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => {
  if (coverPreview.value)
    URL.revokeObjectURL(coverPreview.value)
})

function addCategory() {
  const value = newCategory.value.trim()
  if (!value) return
  if (!categories.value.some(item => item.toLowerCase() === value.toLowerCase()))
    categories.value.push(value)
  category.value = categories.value.find(item => item.toLowerCase() === value.toLowerCase()) ?? value
  newCategory.value = ''
  addingCategory.value = false
}

function addTag() {
  const value = newTag.value.trim()
  if (!value) return
  if (!tags.value.some(item => item.toLowerCase() === value.toLowerCase()))
    tags.value.push(value)
  newTag.value = ''
  addingTag.value = false
}

function addKeyPoint() {
  keyPoints.value.push({ id: nextPointId++, value: '' })
}

function removeKeyPoint(id: number) {
  if (keyPoints.value.length > 1)
    keyPoints.value = keyPoints.value.filter(point => point.id !== id)
}

function openPreview() {
  previewDialog.value?.showModal()
}

function validate() {
  errors.title = title.value.trim() ? '' : 'Judul artikel wajib diisi.'
  errors.slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value) ? '' : 'Slug URL wajib diisi dengan huruf kecil, angka, dan tanda hubung.'
  errors.metaDescription = metaDescription.value.trim() ? '' : 'Ringkasan artikel wajib diisi.'
  errors.cover = coverFile.value ? '' : 'Gambar sampul wajib dipilih.'
  errors.coverAlt = coverAlt.value.trim() ? '' : 'Teks alternatif gambar wajib diisi.'
  errors.body = !bodyText.value ? 'Isi artikel wajib diisi.' : bodyHtml.value.length > 500_000 ? 'Isi artikel terlalu panjang.' : ''
  errors.category = category.value ? '' : 'Kategori wajib dipilih.'
  errors.keyPoints = keyPoints.value.some(point => point.value.trim()) ? '' : 'Tambahkan minimal satu poin utama.'
  return Object.values(errors).every(value => !value)
}

function handlePublish() {
  if (!validate()) {
    notice.value = 'Periksa kembali kolom yang ditandai sebelum menerbitkan artikel.'
    return
  }
  notice.value = 'Form siap. Penerbitan artikel akan tersedia setelah login dan API CMS terhubung.'
}
</script>

<template>
  <form id="article-create-form" class="mx-auto w-full max-w-[1400px]" novalidate @submit.prevent="handlePublish">
    <div class="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary-500">ARTIKEL / BARU</p>
        <h1 class="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-primary-500 sm:text-[32px]">Tulis artikel</h1>
        <p class="mt-1 text-[12px] text-text-disable">Susun konten dan periksa tampilannya sebelum dipublikasikan.</p>
      </div>
      <div class="flex w-full flex-wrap gap-2 sm:w-auto">
        <button type="button" disabled title="Draft belum didukung oleh CMS" class="min-h-11 rounded-lg border border-border-200 px-4 text-[12px] font-medium text-text-disable disabled:cursor-not-allowed">Simpan draft</button>
        <button type="button" class="min-h-11 rounded-lg border border-primary-500 px-4 text-[12px] font-semibold text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" @click="openPreview">Pratinjau</button>
        <button type="submit" class="min-h-11 rounded-lg bg-primary-500 px-4 text-[12px] font-semibold text-bg-0 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">Terbitkan artikel</button>
      </div>
    </div>

    <p v-if="notice" role="alert" class="mb-5 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-[12px] text-primary-600">{{ notice }}</p>

    <div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_315px]">
      <div class="min-w-0 space-y-4">
        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="article-information-title">
          <div class="border-b border-border-200 px-5 py-5 sm:px-6">
            <h2 id="article-information-title" class="text-[16px] font-semibold text-primary-500">Informasi artikel</h2>
            <p class="mt-1 text-[11px] text-text-disable">Informasi utama yang muncul di halaman artikel</p>
          </div>
          <div class="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <label for="article-title" :class="labelClass">Judul artikel <span class="text-primary-500">*</span></label>
              <input id="article-title" v-model="title" type="text" maxlength="180" autocomplete="off" placeholder="Contoh: Panduan Memahami Dokumen Impor dari China" :class="inputClass" :aria-invalid="!!errors.title" :aria-describedby="errors.title ? 'article-title-error' : undefined">
              <p v-if="errors.title" id="article-title-error" class="mt-1 text-[11px] text-error-600">{{ errors.title }}</p>
            </div>
            <div>
              <label for="article-slug" :class="labelClass">Slug URL <span class="text-primary-500">*</span></label>
              <input id="article-slug" v-model="slug" type="text" maxlength="180" autocomplete="off" placeholder="panduan-dokumen-impor-china" :class="inputClass" :aria-invalid="!!errors.slug" :aria-describedby="errors.slug ? 'article-slug-error' : undefined" @input="handleSlugInput">
              <p class="mt-1 break-all text-[10px] text-text-disable">ethcargoindo.com/artikel/{{ slug || 'slug-artikel' }}</p>
              <p v-if="errors.slug" id="article-slug-error" class="mt-1 text-[11px] text-error-600">{{ errors.slug }}</p>
            </div>
            <div>
              <label for="article-summary" :class="labelClass">Ringkasan artikel <span class="text-primary-500">*</span></label>
              <textarea id="article-summary" v-model="metaDescription" rows="2" maxlength="320" placeholder="Ringkasan singkat untuk pembaca dan hasil pencarian" :class="[inputClass, 'min-h-[60px] resize-y']" :aria-invalid="!!errors.metaDescription" :aria-describedby="errors.metaDescription ? 'article-summary-error' : undefined" />
              <p v-if="errors.metaDescription" id="article-summary-error" class="mt-1 text-[11px] text-error-600">{{ errors.metaDescription }}</p>
            </div>
            <div>
              <label for="article-cover" :class="labelClass">Gambar sampul <span class="text-primary-500">*</span></label>
              <input id="article-cover" ref="coverInput" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="handleCoverChange">
              <div class="mt-2 flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-border-300 p-3">
                <img v-if="coverPreview" :src="coverPreview" :alt="coverAlt || 'Pratinjau gambar sampul'" class="h-[66px] w-[100px] rounded object-cover">
                <div v-else class="flex h-[66px] w-[100px] items-center justify-center rounded bg-bg-100 text-[11px] text-text-disable">JPG / PNG / WebP</div>
                <div class="min-w-0 flex-1 text-[11px]">
                  <p class="truncate font-medium text-text-secondary">{{ coverFile?.name || 'Belum ada gambar sampul' }}</p>
                  <p class="mt-1 text-text-disable">Maksimal 5 MB · JPG, PNG, atau WebP</p>
                  <button type="button" class="mt-1 min-h-8 font-medium text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500" @click="coverInput?.click()">{{ coverFile ? 'Ganti gambar' : 'Pilih gambar' }}</button>
                </div>
              </div>
              <p v-if="errors.cover" class="mt-1 text-[11px] text-error-600">{{ errors.cover }}</p>
              <label for="article-cover-alt" :class="[labelClass, 'mt-4']">Teks alternatif gambar <span class="text-primary-500">*</span></label>
              <input id="article-cover-alt" v-model="coverAlt" type="text" maxlength="300" placeholder="Jelaskan gambar sampul untuk aksesibilitas" :class="inputClass" :aria-invalid="!!errors.coverAlt">
              <p v-if="errors.coverAlt" class="mt-1 text-[11px] text-error-600">{{ errors.coverAlt }}</p>
            </div>
          </div>
        </section>

        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="article-body-title">
          <div class="border-b border-border-200 px-5 py-5 sm:px-6">
            <h2 id="article-body-title" class="text-[16px] font-semibold text-primary-500">Isi artikel</h2>
            <p class="mt-1 text-[11px] text-text-disable">Gunakan paragraf, H2, dan H3 agar isi artikel tersusun rapi</p>
          </div>
          <CmsArticleEditor v-model="bodyHtml" />
          <p v-if="errors.body" class="border-t border-border-200 px-5 py-2 text-[11px] text-error-600">{{ errors.body }}</p>
        </section>
      </div>

      <div class="min-w-0 space-y-4">
        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="publication-title">
          <h2 id="publication-title" class="border-b border-border-200 px-5 py-5 text-[16px] font-semibold text-primary-500">Publikasi</h2>
          <dl class="space-y-3 px-5 py-5 text-[11px]">
            <div class="flex justify-between gap-3"><dt class="text-text-tertiary">Status</dt><dd class="text-right font-medium text-text-secondary">Belum diterbitkan</dd></div>
            <div class="flex justify-between gap-3"><dt class="text-text-tertiary">Penulis</dt><dd class="text-right font-medium text-text-secondary">Dari akun CMS</dd></div>
            <div class="flex justify-between gap-3"><dt class="text-text-tertiary">Tanggal terbit</dt><dd class="text-right font-medium text-text-secondary">Setelah dipublikasikan</dd></div>
            <div class="flex justify-between gap-3"><dt class="text-text-tertiary">Visibilitas</dt><dd class="text-right font-medium text-text-secondary">Publik saat terbit</dd></div>
          </dl>
        </section>

        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="grouping-title">
          <h2 id="grouping-title" class="border-b border-border-200 px-5 py-5 text-[16px] font-semibold text-primary-500">Pengelompokan</h2>
          <div class="space-y-5 px-5 py-5">
            <div>
              <label for="article-category" :class="labelClass">Kategori <span class="text-primary-500">*</span></label>
              <select id="article-category" v-model="category" :class="[inputClass, 'min-h-10']" :aria-invalid="!!errors.category">
                <option value="" disabled>Pilih kategori</option>
                <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
              </select>
              <button type="button" class="mt-2 min-h-8 text-[11px] font-medium text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500" @click="addingCategory = !addingCategory">+ Tambah kategori</button>
              <div v-if="addingCategory" class="flex gap-2">
                <input v-model="newCategory" type="text" aria-label="Nama kategori baru" placeholder="Nama kategori" :class="[inputClass, '!mt-0 min-w-0 flex-1']" @keydown.enter.prevent="addCategory">
                <button type="button" class="min-h-10 rounded-lg border border-primary-200 px-3 text-[11px] text-primary-500" @click="addCategory">Tambah</button>
              </div>
              <p v-if="errors.category" class="mt-1 text-[11px] text-error-600">{{ errors.category }}</p>
            </div>
            <div>
              <p :class="labelClass">Tag artikel</p>
              <div v-if="tags.length" class="mt-2 flex flex-wrap gap-1.5">
                <span v-for="tag in tags" :key="tag" class="inline-flex min-h-8 items-center gap-1 rounded border border-border-200 bg-bg-100 px-2 text-[10px] text-text-tertiary">
                  {{ tag }}
                  <button type="button" :aria-label="`Hapus tag ${tag}`" class="flex size-6 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-primary-500" @click="tags = tags.filter(item => item !== tag)">×</button>
                </span>
              </div>
              <button type="button" class="mt-2 min-h-8 rounded border border-primary-200 px-2 text-[11px] text-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500" @click="addingTag = !addingTag">+ Tambah tag</button>
              <div v-if="addingTag" class="mt-2 flex gap-2">
                <input v-model="newTag" type="text" aria-label="Nama tag baru" placeholder="Nama tag" :class="[inputClass, '!mt-0 min-w-0 flex-1']" @keydown.enter.prevent="addTag">
                <button type="button" class="min-h-10 rounded-lg border border-primary-200 px-3 text-[11px] text-primary-500" @click="addTag">Tambah</button>
              </div>
            </div>
            <div>
              <label for="article-banner" :class="labelClass">Banner CTA</label>
              <select id="article-banner" disabled :class="[inputClass, 'min-h-10 text-text-disable']"><option>Banner default tersedia setelah integrasi</option></select>
            </div>
            <p class="text-[10px] leading-relaxed text-text-disable">Kategori dan tag yang ditambahkan di sini masih untuk pratinjau lokal.</p>
          </div>
        </section>

        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="key-points-title">
          <div class="border-b border-border-200 px-5 py-5">
            <h2 id="key-points-title" class="text-[16px] font-semibold text-primary-500">Poin utama</h2>
            <p class="mt-1 text-[11px] text-text-disable">Tampil sebagai Key Points</p>
          </div>
          <div class="space-y-4 px-5 py-5">
            <div v-for="(point, index) in keyPoints" :key="point.id">
              <div class="flex items-center justify-between">
                <label :for="`key-point-${point.id}`" :class="labelClass">Poin {{ index + 1 }}</label>
                <button v-if="keyPoints.length > 1" type="button" :aria-label="`Hapus poin ${index + 1}`" class="min-h-8 text-[11px] text-text-disable hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" @click="removeKeyPoint(point.id)">Hapus</button>
              </div>
              <input :id="`key-point-${point.id}`" v-model="point.value" type="text" maxlength="500" :placeholder="`Tulis poin ${index + 1}...`" :class="inputClass">
            </div>
            <button type="button" class="min-h-9 text-[11px] font-medium text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500" @click="addKeyPoint">+ Tambah poin</button>
            <p v-if="errors.keyPoints" class="text-[11px] text-error-600">{{ errors.keyPoints }}</p>
          </div>
        </section>

        <section class="overflow-hidden rounded-lg border border-border-200 bg-bg-0" aria-labelledby="seo-preview-title">
          <h2 id="seo-preview-title" class="border-b border-border-200 px-5 py-5 text-[16px] font-semibold text-primary-500">SEO &amp; hasil pencarian</h2>
          <div class="px-5 py-5">
            <div class="flex justify-between gap-2 text-[10px] text-text-tertiary"><span>Meta title</span><span>{{ seoTitle.length }} karakter</span></div>
            <div class="mt-3 overflow-hidden rounded-lg border border-border-200 bg-bg-100 p-3 text-[11px] leading-[1.5]">
              <p class="font-medium text-[#1754a0]">{{ seoTitle }}</p>
              <p class="mt-1 truncate text-[10px] text-[#25864d]">ethcargoindo.com › artikel › {{ slug || 'slug-artikel' }}</p>
              <p class="mt-1 line-clamp-2 text-text-tertiary">{{ metaDescription || 'Ringkasan artikel akan muncul di hasil pencarian.' }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <dialog ref="previewDialog" aria-labelledby="article-preview-title" class="m-auto max-h-[90vh] w-[min(92vw,760px)] overflow-y-auto rounded-xl border border-border-200 bg-bg-0 p-0 shadow-xl backdrop:bg-black/40">
      <div class="sticky top-0 flex items-center justify-between gap-4 border-b border-border-200 bg-bg-0 px-5 py-4">
        <h2 id="article-preview-title" class="text-[18px] font-semibold text-text-secondary">Pratinjau artikel</h2>
        <button type="button" aria-label="Tutup pratinjau" class="flex size-10 items-center justify-center rounded-lg text-[24px] text-text-tertiary focus-visible:outline-2 focus-visible:outline-primary-500" @click="previewDialog?.close()">×</button>
      </div>
      <div class="space-y-4 px-5 py-6 sm:px-8">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-primary-500">{{ category || 'Kategori artikel' }}</p>
        <h3 class="text-[28px] font-semibold leading-tight text-text-secondary">{{ previewTitle }}</h3>
        <p class="text-[14px] text-text-tertiary">{{ metaDescription || 'Ringkasan artikel akan tampil di sini.' }}</p>
        <img v-if="coverPreview" :src="coverPreview" :alt="coverAlt || 'Gambar sampul artikel'" class="max-h-[320px] w-full rounded-lg object-cover">
        <p class="whitespace-pre-wrap text-[14px] leading-7 text-text-secondary">{{ bodyText || 'Isi artikel akan tampil di sini.' }}</p>
        <ul v-if="keyPoints.some(point => point.value.trim())" class="list-disc space-y-1 pl-5 text-[13px] text-text-secondary"><li v-for="point in keyPoints.filter(item => item.value.trim())" :key="point.id">{{ point.value }}</li></ul>
      </div>
    </dialog>
  </form>
</template>
