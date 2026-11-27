<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const editor = ref<HTMLElement | null>(null)

function syncContent() {
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

watch(() => props.modelValue, value => {
  if (editor.value && editor.value.innerHTML !== value)
    editor.value.innerHTML = value
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
      <button type="button" disabled title="Gambar isi tersedia saat editor terhubung ke API" class="min-h-9 rounded px-2 text-text-disable">Gambar</button>
    </div>
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
</style>
