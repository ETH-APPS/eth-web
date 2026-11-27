<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const editor = ref<HTMLElement | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const imageDialog = ref<HTMLDialogElement | null>(null)
const pendingImageUrl = ref('')
const pendingImageName = ref('')
const imageAlt = ref('')
const imageError = ref('')
const activeImageUrls = new Set<string>()
let insertionRange: Range | null = null

function syncContent() {
  const usedImageUrls = new Set(
    [...(editor.value?.querySelectorAll<HTMLImageElement>('img[data-local-image-id]') ?? [])]
      .map(image => image.src),
  )
  activeImageUrls.forEach((url) => {
    if (!usedImageUrls.has(url)) {
      URL.revokeObjectURL(url)
      activeImageUrls.delete(url)
    }
  })
  emit('update:modelValue', editor.value?.innerHTML ?? '')
}

function format(command: 'bold' | 'italic' | 'formatBlock' | 'insertLineBreak', value?: string) {
  editor.value?.focus()
  document.execCommand(command, false, value)
  syncContent()
}

function pastePlainText(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
  syncContent()
}

function openImagePicker() {
  imageError.value = ''
  const selection = window.getSelection()
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null
  insertionRange = range && editor.value?.contains(range.commonAncestorContainer)
    ? range.cloneRange()
    : null
  imageInput.value?.click()
}

function selectImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    imageError.value = 'Gunakan JPG, PNG, atau WebP maksimal 5 MB.'
    return
  }

  if (pendingImageUrl.value)
    URL.revokeObjectURL(pendingImageUrl.value)

  pendingImageUrl.value = URL.createObjectURL(file)
  pendingImageName.value = file.name
  imageAlt.value = ''
  imageError.value = ''
  imageDialog.value?.showModal()
}

function resetPendingImage() {
  if (pendingImageUrl.value)
    URL.revokeObjectURL(pendingImageUrl.value)
  pendingImageUrl.value = ''
  pendingImageName.value = ''
  imageAlt.value = ''
  insertionRange = null
}

function cancelImage() {
  imageDialog.value?.close()
  resetPendingImage()
}

function insertImage() {
  const alt = imageAlt.value.trim()
  if (!alt) {
    imageError.value = 'Teks alternatif gambar wajib diisi.'
    return
  }
  if (!editor.value || !pendingImageUrl.value) return

  const image = document.createElement('img')
  image.src = pendingImageUrl.value
  image.alt = alt
  image.dataset.localImageId = crypto.randomUUID()

  const range = insertionRange && editor.value.contains(insertionRange.commonAncestorContainer)
    ? insertionRange
    : document.createRange()
  if (!insertionRange || !editor.value.contains(range.commonAncestorContainer)) {
    range.selectNodeContents(editor.value)
    range.collapse(false)
  }

  range.deleteContents()
  range.insertNode(image)
  range.setStartAfter(image)
  range.collapse(true)

  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)

  activeImageUrls.add(pendingImageUrl.value)
  pendingImageUrl.value = ''
  imageError.value = ''
  imageDialog.value?.close()
  pendingImageName.value = ''
  imageAlt.value = ''
  insertionRange = null
  editor.value.focus()
  syncContent()
}

watch(() => props.modelValue, value => {
  if (editor.value && editor.value.innerHTML !== value)
    editor.value.innerHTML = value
})

onBeforeUnmount(() => {
  if (pendingImageUrl.value)
    URL.revokeObjectURL(pendingImageUrl.value)
  activeImageUrls.forEach(url => URL.revokeObjectURL(url))
})
</script>

<template>
  <div>
    <div role="toolbar" aria-label="Format isi artikel" class="flex flex-wrap items-center gap-1 border-b border-border-200 px-3 py-2 text-[12px] text-text-tertiary sm:px-5">
      <button type="button" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('formatBlock', 'p')">Paragraf</button>
      <button type="button" class="min-h-9 rounded px-2 font-semibold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('formatBlock', 'h2')">H2</button>
      <button type="button" class="min-h-9 rounded px-2 font-semibold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('formatBlock', 'h3')">H3</button>
      <span class="mx-1 h-5 w-px bg-border-200" aria-hidden="true" />
      <button type="button" aria-label="Tebal" class="min-h-9 min-w-9 rounded font-bold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('bold')">B</button>
      <button type="button" aria-label="Miring" class="min-h-9 min-w-9 rounded italic hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('italic')">I</button>
      <button type="button" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="format('insertLineBreak')">Baris baru</button>
      <button type="button" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @mousedown.prevent @click="openImagePicker">Gambar</button>
      <input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="selectImage">
    </div>
    <p v-if="imageError" role="alert" class="border-b border-border-200 px-5 py-2 text-[11px] text-error-600">{{ imageError }}</p>
    <div
      ref="editor"
      contenteditable="true"
      role="textbox"
      aria-label="Isi artikel"
      aria-multiline="true"
      data-placeholder="Mulai tulis artikel di sini..."
      class="article-editor min-h-[300px] px-5 py-5 text-[13px] leading-[1.75] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-100 lg:min-h-[410px]"
      @input="syncContent"
      @paste="pastePlainText"
    />

    <dialog
      ref="imageDialog"
      aria-labelledby="body-image-title"
      class="m-auto w-[min(92vw,460px)] rounded-xl border border-border-200 bg-bg-0 p-0 shadow-xl backdrop:bg-black/40"
      @cancel.prevent="cancelImage"
    >
      <form method="dialog" class="p-5" @submit.prevent="insertImage">
        <h3 id="body-image-title" class="text-base font-semibold text-primary-500">Tambahkan gambar</h3>
        <img v-if="pendingImageUrl" :src="pendingImageUrl" alt="Pratinjau gambar yang akan ditambahkan" class="mt-4 max-h-56 w-full rounded-lg bg-bg-100 object-contain">
        <p class="mt-2 truncate text-[11px] text-text-disable">{{ pendingImageName }}</p>
        <label for="body-image-alt" class="mt-4 block text-[11px] font-semibold text-text-tertiary">Teks alternatif <span class="text-primary-500">*</span></label>
        <input
          id="body-image-alt"
          v-model="imageAlt"
          type="text"
          maxlength="300"
          autofocus
          placeholder="Jelaskan isi gambar"
          class="mt-2 w-full rounded-lg border border-border-200 bg-bg-0 px-3 py-2.5 text-[12px] text-text-secondary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          :aria-invalid="!!imageError"
        >
        <div class="mt-5 flex justify-end gap-2">
          <button type="button" class="min-h-10 rounded-lg border border-border-200 px-4 text-[12px] text-text-secondary" @click="cancelImage">Batal</button>
          <button type="submit" class="min-h-10 rounded-lg bg-primary-500 px-4 text-[12px] font-semibold text-white">Tambahkan</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.article-editor:empty::before {
  content: attr(data-placeholder);
  color: var(--color-text-disable);
  pointer-events: none;
}

.article-editor :deep(h2) {
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.article-editor :deep(h3) {
  margin: 0.9rem 0 0.4rem;
  font-size: 1rem;
  font-weight: 600;
}

.article-editor :deep(p) {
  margin: 0.45rem 0;
}

.article-editor :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
}
</style>
