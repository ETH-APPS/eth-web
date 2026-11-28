export function useArticleOptions() {
  const categories = useArticleTaxonomy('categories')
  const tags = useArticleTaxonomy('tags')
  const {
    banners,
    isLoading: isLoadingBanners,
    loadError: bannerLoadError,
    isCreatingBanner,
    bannerError,
    createBanner,
  } = useArticleBanners()

  return {
    categories: categories.items,
    tags: tags.items,
    banners,
    isLoading: computed(() => (
      categories.isLoading.value
      || tags.isLoading.value
      || isLoadingBanners.value
    )),
    loadError: computed(() => (
      categories.loadError.value
      || tags.loadError.value
      || bannerLoadError.value
    )),
    isCreatingCategory: categories.isCreating,
    isCreatingTag: tags.isCreating,
    isCreatingBanner,
    categoryError: categories.createError,
    tagError: tags.createError,
    bannerError,
    createCategory: categories.create,
    createTag: tags.create,
    createBanner,
  }
}
