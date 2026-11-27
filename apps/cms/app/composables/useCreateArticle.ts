import axios from 'axios'
import { useMutation } from '@tanstack/vue-query'
import type { ArticleDraft } from '~/types/article'
import type { ApiEnvelope, ApiErrorResponse } from '#shared/types/api'
import type {
  ArticleMedia,
  CreateArticlePayload,
  CreatedArticle,
  PublishedArticle,
} from '#shared/types/article'

type PublishStage = 'idle' | 'cover' | 'body' | 'article' | 'verify'

function errorDetail(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return undefined
  return error.response?.data.data?.error ?? error.response?.data.error
}

function errorMessage(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined
  const detail = errorDetail(error)
  if (error instanceof Error && !axios.isAxiosError(error)) return error.message
  if (status === 401) return 'Sesi berakhir. Silakan masuk kembali sebelum menerbitkan.'
  if (detail?.code === 'ARTICLE_SLUG_CONFLICT') return 'Slug sudah digunakan artikel lain. Ubah slug lalu coba kembali.'
  if (detail?.code === 'AUTHOR_PROFILE_REQUIRED') return 'Profil penulis akun ini belum lengkap.'
  if (detail?.code === 'DEFAULT_BANNER_NOT_CONFIGURED') return 'Pilih banner karena banner default belum tersedia.'
  if (status === 413) return 'Ukuran gambar melebihi batas 5 MB.'
  if (status === 502 || (axios.isAxiosError(error) && !error.response))
    return 'API belum dapat dihubungi. Data form dan hasil upload yang berhasil tetap disimpan untuk dicoba kembali.'
  return detail?.message || 'Artikel gagal diterbitkan. Periksa kembali data lalu coba lagi.'
}

export function useCreateArticle() {
  const { $api } = useNuxtApp()
  const stage = ref<PublishStage>('idle')
  const fieldErrors = ref<Record<string, string[]>>({})
  const verificationWarning = ref('')
  const uploadedAssets = new WeakMap<File, ArticleMedia>()

  async function uploadAsset(file: File, kind: 'ARTICLE_COVER' | 'ARTICLE_BODY') {
    const existing = uploadedAssets.get(file)
    if (existing) return existing

    const form = new FormData()
    form.append('file', file)
    form.append('kind', kind)
    const response = await $api.post<ApiEnvelope<ArticleMedia>>('/cms/articles/assets', form)
    uploadedAssets.set(file, response.data.data)
    return response.data.data
  }

  function bodyWithMediaIds(
    html: string,
    mediaIds: Map<string, string>,
    images: ArticleDraft['bodyImages'],
  ) {
    const body = new DOMParser().parseFromString(html, 'text/html').body
    const imagesById = new Map(images.map(image => [image.id, image]))

    for (const image of body.querySelectorAll('img')) {
      const localId = image.dataset.localImageId
      const mediaId = localId ? mediaIds.get(localId) : image.dataset.mediaId
      const alt = localId ? imagesById.get(localId)?.alt : image.alt
      if (!mediaId || !alt)
        throw new Error('Gambar isi belum memiliki file atau teks alternatif yang valid.')

      for (const attribute of [...image.attributes])
        image.removeAttribute(attribute.name)
      image.dataset.mediaId = mediaId
      image.alt = alt
    }
    return body.innerHTML
  }

  async function verifyArticle(slug: string, title: string, authorId: string, bodyImageCount: number) {
    try {
      const response = await $api.get<ApiEnvelope<PublishedArticle>>(`/articles/${encodeURIComponent(slug)}`)
      const article = response.data.data
      const body = new DOMParser().parseFromString(article.bodyHtml, 'text/html').body
      const images = [...body.querySelectorAll('img')]
      const bodyIsValid = Boolean(body.textContent?.trim() || images.length)
        && images.length >= bodyImageCount
        && images.every(image => image.dataset.mediaId && image.src.startsWith('https://'))
      return article.title === title && article.author.id === authorId && bodyIsValid ? article : null
    } catch {
      return null
    }
  }

  const mutation = useMutation({
    retry: false,
    mutationFn: async (draft: ArticleDraft) => {
      stage.value = 'cover'
      const cover = await uploadAsset(draft.coverFile, 'ARTICLE_COVER')

      stage.value = 'body'
      const bodyAssets = await Promise.all(draft.bodyImages.map(async image => ({
        localId: image.id,
        asset: await uploadAsset(image.file, 'ARTICLE_BODY'),
      })))
      const bodyMediaIds = new Map(bodyAssets.map(item => [item.localId, item.asset.id]))

      const payload: CreateArticlePayload = {
        title: draft.title,
        slug: draft.slug,
        metaDescription: draft.metaDescription,
        coverMediaId: cover.id,
        coverImageAlt: draft.coverImageAlt,
        bodyHtml: bodyWithMediaIds(draft.bodyHtml, bodyMediaIds, draft.bodyImages),
        keyPoints: draft.keyPoints,
        categoryId: draft.categoryId,
        tagIds: draft.tagIds,
        ...(draft.bannerId ? { bannerId: draft.bannerId } : {}),
      }

      stage.value = 'article'
      let article: CreatedArticle
      try {
        const response = await $api.post<ApiEnvelope<CreatedArticle>>('/cms/articles', payload)
        article = response.data.data
      } catch (error) {
        const mayHaveReachedApi = !axios.isAxiosError(error) || !error.response || error.response.status >= 500
        if (!mayHaveReachedApi) throw error

        stage.value = 'verify'
        const recovered = await verifyArticle(draft.slug, draft.title, draft.authorId, draft.bodyImages.length)
        if (!recovered) throw error
        article = recovered
      }

      stage.value = 'verify'
      const verified = await verifyArticle(article.slug, article.title, draft.authorId, draft.bodyImages.length)
      verificationWarning.value = verified
        ? ''
        : 'Artikel tersimpan, tetapi public read belum dapat diverifikasi. Jangan publish ulang sebelum memeriksa slug ini.'
      return article
    },
  })

  async function publish(draft: ArticleDraft) {
    mutation.reset()
    fieldErrors.value = {}
    verificationWarning.value = ''
    try {
      return await mutation.mutateAsync(draft)
    } catch (error) {
      fieldErrors.value = errorDetail(error)?.fields ?? {}
      throw error
    } finally {
      stage.value = 'idle'
    }
  }

  return {
    publish,
    isPublishing: computed(() => mutation.isPending.value),
    publishResult: computed(() => mutation.data.value),
    publishError: computed(() => mutation.error.value),
    publishErrorMessage: computed(() => mutation.error.value ? errorMessage(mutation.error.value) : ''),
    fieldErrors: readonly(fieldErrors),
    verificationWarning: readonly(verificationWarning),
    stage: readonly(stage),
  }
}
