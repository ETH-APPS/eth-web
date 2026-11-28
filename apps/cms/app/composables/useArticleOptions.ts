import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createBanner as createBannerRequest,
  createTaxonomy,
  listBanners,
  listTaxonomy,
  type CreateBannerInput,
} from '~/services/api/articles'
import type { ArticleBanner, ArticleTaxonomy } from '#shared/types/article'

const categoryKey = ['articles', 'categories'] as const
const tagKey = ['articles', 'tags'] as const
const bannerKey = ['articles', 'banners'] as const

export function useArticleOptions() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: categoryKey,
    queryFn: () => listTaxonomy($api, 'categories'),
    staleTime: 5 * 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: tagKey,
    queryFn: () => listTaxonomy($api, 'tags'),
    staleTime: 5 * 60 * 1000,
  })
  const bannersQuery = useQuery({
    queryKey: bannerKey,
    queryFn: () => listBanners($api),
    staleTime: 5 * 60 * 1000,
  })

  const categoryMutation = useMutation({
    mutationFn: (name: string) => createTaxonomy($api, 'categories', name),
    onSuccess: category => queryClient.setQueryData<ArticleTaxonomy[]>(categoryKey, values => (
      [...(values ?? []).filter(item => item.id !== category.id), category]
        .sort((left, right) => left.name.localeCompare(right.name))
    )),
  })
  const tagMutation = useMutation({
    mutationFn: (name: string) => createTaxonomy($api, 'tags', name),
    onSuccess: tag => queryClient.setQueryData<ArticleTaxonomy[]>(tagKey, values => (
      [...(values ?? []).filter(item => item.id !== tag.id), tag]
        .sort((left, right) => left.name.localeCompare(right.name))
    )),
  })
  const bannerMutation = useMutation({
    mutationFn: (input: CreateBannerInput) => createBannerRequest($api, input),
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

  async function addBanner(input: CreateBannerInput) {
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
