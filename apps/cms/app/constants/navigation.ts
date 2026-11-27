export interface CmsNavigationItem {
  label: string
  to: string
}

export interface CmsNavigationGroup {
  label: string
  items: CmsNavigationItem[]
}

export const cmsNavigation: CmsNavigationGroup[] = [
  {
    label: 'Utama',
    items: [{ label: 'Ringkasan', to: '/dashboard' }],
  },
  {
    label: 'Konten',
    items: [
      { label: 'Artikel', to: '/articles' },
      { label: 'Banner', to: '/articles/banners' },
      { label: 'Kategori', to: '/articles/categories' },
      { label: 'Tag', to: '/articles/tags' },
      { label: 'Media', to: '/media' },
    ],
  },
  {
    label: 'Sistem',
    items: [{ label: 'Pengaturan', to: '/settings' }],
  },
]
