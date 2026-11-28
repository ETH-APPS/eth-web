import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { listArticles, listTaxonomy } from '~/services/api/articles'

export function useArticles() {
  const { $api } = useNuxtApp()
  const page = ref(1)
  const search = ref('')
  const category = ref('')

  const articlesQuery = useQuery({
    queryKey: computed(() => ['articles', 'list', page.value, search.value, category.value]),
    queryFn: () => listArticles($api, {
      page: page.value,
      limit: 12,
      ...(search.value ? { q: search.value } : {}),
      ...(category.value ? { category: category.value } : {}),
    }),
    placeholderData: keepPreviousData,
  })

  const categoriesQuery = useQuery({
    queryKey: ['articles', 'categories'],
    queryFn: () => listTaxonomy($api, 'categories'),
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
