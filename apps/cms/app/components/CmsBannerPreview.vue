<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image?: { url: string, width?: number, height?: number }
}>()

// The public article's 1080px grid leaves 756px for the banner beside its sidebar.
const articleColumnWidth = 756
const viewport = useTemplateRef<HTMLDivElement>('viewport')
const zoom = ref(1)

watch(viewport, (element, _, onCleanup) => {
  if (!element) return

  function resize(width: number) {
    if (width > 0) zoom.value = Math.min(1, width / articleColumnWidth)
  }

  resize(element.clientWidth)
  const observer = new ResizeObserver(([entry]) => resize(entry.contentRect.width))
  observer.observe(element)
  onCleanup(() => observer.disconnect())
}, { flush: 'post' })
</script>

<template>
  <div ref="viewport" class="mx-auto w-full max-w-[756px] overflow-hidden">
    <div :style="{ width: `${articleColumnWidth}px`, zoom }" class="wrap-anywhere" inert>
      <UiArticleCtaBanner
        :title="title"
        :description="description"
        :image="image?.url"
        :image-width="image?.width"
        :image-height="image?.height"
        :image-top-offset="0"
        class="pl-8"
      />
    </div>
  </div>
</template>
