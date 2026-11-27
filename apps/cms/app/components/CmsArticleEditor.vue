<script setup lang="ts">
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { ArticleBodyImageDraft } from '~/types/article'

const props = defineProps<{
  modelValue: string
  images: ArticleBodyImageDraft[]
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:images': [value: ArticleBodyImageDraft[]]
}>()

const BodyImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-local-image-id': {
        default: null,
        parseHTML: element => element.getAttribute('data-local-image-id'),
        renderHTML: attributes => attributes['data-local-image-id']
          ? { 'data-local-image-id': attributes['data-local-image-id'] }
          : {},
      },
      'data-media-id': {
        default: null,
        parseHTML: element => element.getAttribute('data-media-id'),
        renderHTML: attributes => attributes['data-media-id']
          ? { 'data-media-id': attributes['data-media-id'] }
          : {},
      },
    }
  },
})

const imageInput = ref<HTMLInputElement | null>(null)
const imageDialog = ref<HTMLDialogElement | null>(null)
const pendingImageFile = ref<File | null>(null)
const pendingImageUrl = ref('')
const imageAlt = ref('')
const imageError = ref('')
const drafts = shallowRef<ArticleBodyImageDraft[]>([...props.images])

function syncImages(html: string) {
  const body = new DOMParser().parseFromString(html, 'text/html').body
  const usedIds = new Set(
    [...body.querySelectorAll('img[data-local-image-id]')]
      .map(image => image.getAttribute('data-local-image-id'))
      .filter((id): id is string => Boolean(id)),
  )
  const removed = drafts.value.filter(image => !usedIds.has(image.id))
  removed.forEach(image => URL.revokeObjectURL(image.previewUrl))
  if (removed.length) {
    drafts.value = drafts.value.filter(image => usedIds.has(image.id))
    emit('update:images', drafts.value)
  }
}

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      blockquote: false,
      bulletList: false,
      code: false,
      codeBlock: false,
      heading: { levels: [2, 3] },
      horizontalRule: false,
      link: false,
      listItem: false,
      orderedList: false,
      strike: false,
      underline: false,
    }),
    BodyImage.configure({ allowBase64: false }),
    Placeholder.configure({ placeholder: 'Mulai tulis artikel di sini...' }),
  ],
  editorProps: {
    attributes: {
      'aria-label': 'Isi artikel',
      'aria-multiline': 'true',
      'role': 'textbox',
    },
    handlePaste: (_view, event) => Boolean(event.clipboardData?.files.length),
    handleDrop: (_view, event) => Boolean(event.dataTransfer?.files.length),
    transformPastedHTML(html) {
      const body = new DOMParser().parseFromString(html, 'text/html').body
      body.querySelectorAll('img').forEach(image => image.remove())
      return body.innerHTML
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    syncImages(html)
  },
})

function openImagePicker() {
  imageError.value = ''
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
  pendingImageFile.value = file
  pendingImageUrl.value = URL.createObjectURL(file)
  imageAlt.value = ''
  imageError.value = ''
  imageDialog.value?.showModal()
}

function resetPendingImage() {
  if (pendingImageUrl.value)
    URL.revokeObjectURL(pendingImageUrl.value)
  pendingImageFile.value = null
  pendingImageUrl.value = ''
  imageAlt.value = ''
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
  if (!editor.value || !pendingImageFile.value || !pendingImageUrl.value) return

  const image: ArticleBodyImageDraft = {
    id: crypto.randomUUID(),
    file: pendingImageFile.value,
    previewUrl: pendingImageUrl.value,
    alt,
  }
  drafts.value = [...drafts.value, image]
  emit('update:images', drafts.value)
  editor.value.chain().focus().insertContent({
    type: 'image',
    attrs: {
      src: image.previewUrl,
      alt: image.alt,
      'data-local-image-id': image.id,
    },
  }).run()

  pendingImageFile.value = null
  pendingImageUrl.value = ''
  imageAlt.value = ''
  imageError.value = ''
  imageDialog.value?.close()
}

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value)
    editor.value.commands.setContent(value, { emitUpdate: false })
})

watch(() => props.images, (value) => {
  drafts.value = [...value]
})

onBeforeUnmount(() => {
  resetPendingImage()
  drafts.value.forEach(image => URL.revokeObjectURL(image.previewUrl))
})
</script>

<template>
  <div>
    <div role="toolbar" aria-label="Format isi artikel" class="flex flex-wrap items-center gap-1 border-b border-border-200 px-3 py-2 text-[12px] text-text-tertiary sm:px-5">
      <button type="button" :class="{ 'bg-bg-100 text-primary-500': editor?.isActive('paragraph') }" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().setParagraph().run()">Paragraf</button>
      <button type="button" :class="{ 'bg-bg-100 text-primary-500': editor?.isActive('heading', { level: 2 }) }" class="min-h-9 rounded px-2 font-semibold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" :class="{ 'bg-bg-100 text-primary-500': editor?.isActive('heading', { level: 3 }) }" class="min-h-9 rounded px-2 font-semibold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      <span class="mx-1 h-5 w-px bg-border-200" aria-hidden="true" />
      <button type="button" aria-label="Tebal" :class="{ 'bg-bg-100 text-primary-500': editor?.isActive('bold') }" class="min-h-9 min-w-9 rounded font-bold hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().toggleBold().run()">B</button>
      <button type="button" aria-label="Miring" :class="{ 'bg-bg-100 text-primary-500': editor?.isActive('italic') }" class="min-h-9 min-w-9 rounded italic hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().toggleItalic().run()">I</button>
      <button type="button" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="editor?.chain().focus().setHardBreak().run()">Baris baru</button>
      <button type="button" class="min-h-9 rounded px-2 hover:bg-bg-100 focus-visible:outline-2 focus-visible:outline-primary-500" @click="openImagePicker">Gambar</button>
      <input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="selectImage">
    </div>
    <p v-if="imageError" role="alert" class="border-b border-border-200 px-5 py-2 text-[11px] text-error-600">{{ imageError }}</p>
    <EditorContent :editor="editor" class="article-editor min-h-[300px] px-5 py-5 text-[13px] leading-[1.75] text-text-secondary lg:min-h-[410px]" />

    <dialog
      ref="imageDialog"
      aria-labelledby="body-image-title"
      class="m-auto w-[min(92vw,460px)] rounded-xl border border-border-200 bg-bg-0 p-0 shadow-xl backdrop:bg-black/40"
      @cancel.prevent="cancelImage"
    >
      <form method="dialog" class="p-5" @submit.prevent="insertImage">
        <h3 id="body-image-title" class="text-base font-semibold text-primary-500">Tambahkan gambar</h3>
        <img v-if="pendingImageUrl" :src="pendingImageUrl" alt="Pratinjau gambar yang akan ditambahkan" class="mt-4 max-h-56 w-full rounded-lg bg-bg-100 object-contain">
        <p class="mt-2 truncate text-[11px] text-text-disable">{{ pendingImageFile?.name }}</p>
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
.article-editor :deep(.ProseMirror) {
  min-height: inherit;
  outline: none;
}

.article-editor :deep(.ProseMirror-focused) {
  box-shadow: inset 0 0 0 2px var(--color-primary-100);
}

.article-editor :deep(p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
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
