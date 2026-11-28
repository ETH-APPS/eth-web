import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createTaxonomy,
  listTaxonomy,
} from '~/services/api/articles'
import type { ArticleTaxonomy } from '#shared/types/article'

const categoryKey = ['articles', 'categories'] as const
const tagKey = ['articles', 'tags'] as const

export function useArticleOptions() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const {
    banners,
    isLoading: isLoadingBanners,
    loadError: bannerLoadError,
    isCreatingBanner,
    bannerError,
    createBanner,
  } = useArticleBanners()

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

  async function createCategory(name: string) {
    categoryMutation.reset()
    return categoryMutation.mutateAsync(name)
  }

  async function createTag(name: string) {
    tagMutation.reset()
    return tagMutation.mutateAsync(name)
  }

  return {
    categories: computed(() => categoriesQuery.data.value ?? []),
    tags: computed(() => tagsQuery.data.value ?? []),
    banners,
    isLoading: computed(() => (
      categoriesQuery.isPending.value
      || tagsQuery.isPending.value
      || isLoadingBanners.value
    )),
    loadError: computed(() => (
      categoriesQuery.error.value
      || tagsQuery.error.value
      || bannerLoadError.value
    )),
    isCreatingCategory: computed(() => categoryMutation.isPending.value),
    isCreatingTag: computed(() => tagMutation.isPending.value),
    isCreatingBanner,
    categoryError: computed(() => categoryMutation.error.value),
    tagError: computed(() => tagMutation.error.value),
    bannerError,
    createCategory,
    createTag,
    createBanner,
  }
}
