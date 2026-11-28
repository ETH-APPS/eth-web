import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ArticleBanner } from '#shared/types/article'
import { createBanner as createBannerRequest, listBanners, type CreateBannerInput } from '~/services/api/articles'

const bannerKey = ['articles', 'banners'] as const

export function useArticleBanners() {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: bannerKey,
    queryFn: () => listBanners($api),
    staleTime: 5 * 60 * 1000,
  })
  const mutation = useMutation({
    mutationFn: (input: CreateBannerInput) => createBannerRequest($api, input),
    onSuccess: async (banner) => {
      await queryClient.cancelQueries({ queryKey: bannerKey })
      queryClient.setQueryData<ArticleBanner[]>(bannerKey, values => [
        banner,
        ...(values ?? []).filter(item => item.id !== banner.id),
      ])
      void queryClient.invalidateQueries({ queryKey: bannerKey })
    },
  })

  function createBanner(input: CreateBannerInput) {
    mutation.reset()
    return mutation.mutateAsync(input)
  }

  return {
    banners: computed(() => query.data.value ?? []),
    isLoading: query.isPending,
    loadError: query.error,
    reloadBanners: query.refetch,
    isCreatingBanner: mutation.isPending,
    bannerError: mutation.error,
    createBanner,
  }
}
