import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import type { ApiEnvelope } from '#shared/types/api'
import type { ArticleList, ArticleTaxonomy } from '#shared/types/article'

export function useArticles() {
  const { $api } = useNuxtApp()
  const page = ref(1)
  const search = ref('')
  const category = ref('')

  const articlesQuery = useQuery({
    queryKey: computed(() => ['articles', 'list', page.value, search.value, category.value]),
    queryFn: async () => {
      const response = await $api.get<ApiEnvelope<ArticleList>>('/articles', {
        params: {
          page: page.value,
          limit: 12,
          ...(search.value ? { q: search.value } : {}),
          ...(category.value ? { category: category.value } : {}),
        },
      })
      return response.data.data
    },
    placeholderData: keepPreviousData,
  })

  const categoriesQuery = useQuery({
    queryKey: ['articles', 'categories'],
    queryFn: async () => {
      const response = await $api.get<ApiEnvelope<ArticleTaxonomy[]>>('/cms/categories')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  function applyFilters(input: { search: string, category: string }) {
    page.value = 1
    search.value = input.search.trim()
    category.value = input.category
  }

  return {
    articles: computed(() => articlesQuery.data.value?.items ?? []),
    pagination: computed(() => articlesQuery.data.value?.pagination ?? {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    }),
    categories: computed(() => categoriesQuery.data.value ?? []),
    page,
    search,
    category,
    applyFilters,
    refresh: articlesQuery.refetch,
    isLoading: computed(() => articlesQuery.isPending.value),
    isFetching: computed(() => articlesQuery.isFetching.value),
    error: computed(() => articlesQuery.error.value),
  }
}
