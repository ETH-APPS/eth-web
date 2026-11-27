import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiEnvelope } from '#shared/types/api'
import type { ArticleBanner, ArticleTaxonomy } from '#shared/types/article'

const categoryKey = ['articles', 'categories'] as const
const tagKey = ['articles', 'tags'] as const
const bannerKey = ['articles', 'banners'] as const

export function useArticleOptions() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()

  async function listTaxonomy(resource: 'categories' | 'tags') {
    const response = await $api.get<ApiEnvelope<ArticleTaxonomy[]>>(`/cms/${resource}`)
    return response.data.data
  }

  async function createTaxonomy(resource: 'categories' | 'tags', name: string) {
    const response = await $api.post<ApiEnvelope<ArticleTaxonomy>>(`/cms/${resource}`, { name })
    return response.data.data
  }

  async function createBanner(input: { title: string, description: string, image: File }) {
    const form = new FormData()
    form.append('title', input.title)
    form.append('description', input.description)
    form.append('image', input.image)
    const response = await $api.post<ApiEnvelope<ArticleBanner>>('/cms/banners', form)
    return response.data.data
  }

  const categoriesQuery = useQuery({
    queryKey: categoryKey,
    queryFn: () => listTaxonomy('categories'),
    staleTime: 5 * 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: tagKey,
    queryFn: () => listTaxonomy('tags'),
    staleTime: 5 * 60 * 1000,
  })
  const bannersQuery = useQuery({
    queryKey: bannerKey,
    queryFn: async () => {
      const response = await $api.get<ApiEnvelope<ArticleBanner[]>>('/cms/banners')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const categoryMutation = useMutation({
    mutationFn: (name: string) => createTaxonomy('categories', name),
    onSuccess: category => queryClient.setQueryData<ArticleTaxonomy[]>(categoryKey, values => (
      [...(values ?? []).filter(item => item.id !== category.id), category]
        .sort((left, right) => left.name.localeCompare(right.name))
    )),
  })
  const tagMutation = useMutation({
    mutationFn: (name: string) => createTaxonomy('tags', name),
    onSuccess: tag => queryClient.setQueryData<ArticleTaxonomy[]>(tagKey, values => (
      [...(values ?? []).filter(item => item.id !== tag.id), tag]
        .sort((left, right) => left.name.localeCompare(right.name))
    )),
  })
  const bannerMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: banner => queryClient.setQueryData<ArticleBanner[]>(bannerKey, values => [
      banner,
      ...(values ?? []).filter(item => item.id !== banner.id),
    ]),
  })

  async function createCategory(name: string) {
    categoryMutation.reset()
    return categoryMutation.mutateAsync(name)
  }

  async function createTag(name: string) {
    tagMutation.reset()
    return tagMutation.mutateAsync(name)
  }

  async function addBanner(input: { title: string, description: string, image: File }) {
    bannerMutation.reset()
    return bannerMutation.mutateAsync(input)
  }

  return {
    categories: computed(() => categoriesQuery.data.value ?? []),
    tags: computed(() => tagsQuery.data.value ?? []),
    banners: computed(() => bannersQuery.data.value ?? []),
    isLoading: computed(() => (
      categoriesQuery.isPending.value
      || tagsQuery.isPending.value
      || bannersQuery.isPending.value
    )),
    loadError: computed(() => (
      categoriesQuery.error.value
      || tagsQuery.error.value
      || bannersQuery.error.value
    )),
    isCreatingCategory: computed(() => categoryMutation.isPending.value),
    isCreatingTag: computed(() => tagMutation.isPending.value),
    isCreatingBanner: computed(() => bannerMutation.isPending.value),
    categoryError: computed(() => categoryMutation.error.value),
    tagError: computed(() => tagMutation.error.value),
    bannerError: computed(() => bannerMutation.error.value),
    createCategory,
    createTag,
    createBanner: addBanner,
  }
}
