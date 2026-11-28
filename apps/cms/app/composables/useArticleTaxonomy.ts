import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ArticleTaxonomy } from '#shared/types/article'
import { createTaxonomy, listTaxonomy, type TaxonomyResource } from '~/services/api/articles'

export function useArticleTaxonomy(resource: TaxonomyResource) {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const queryKey = ['articles', resource] as const

  const query = useQuery({
    queryKey,
    queryFn: () => listTaxonomy($api, resource),
    staleTime: 5 * 60 * 1000,
  })
  const mutation = useMutation({
    mutationFn: (name: string) => createTaxonomy($api, resource, name),
    onSuccess: async (item) => {
      await queryClient.cancelQueries({ queryKey })
      queryClient.setQueryData<ArticleTaxonomy[]>(queryKey, values => (
        [...(values ?? []).filter(value => value.id !== item.id), item]
          .sort((left, right) => left.name.localeCompare(right.name))
      ))
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  function create(name: string) {
    mutation.reset()
    return mutation.mutateAsync(name)
  }

  return {
    items: computed(() => query.data.value ?? []),
    isLoading: query.isPending,
    loadError: query.error,
    reload: query.refetch,
    isCreating: mutation.isPending,
    createError: mutation.error,
    create,
  }
}
