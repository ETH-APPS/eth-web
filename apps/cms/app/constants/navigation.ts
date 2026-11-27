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
    items: [{ label: 'Dashboard', to: '/dashboard' }],
  },
  {
    label: 'Artikel',
    items: [
      { label: 'Daftar artikel', to: '/articles' },
      { label: 'Tulis artikel', to: '/articles/create' },
      { label: 'Kategori', to: '/articles/categories' },
      { label: 'Tag', to: '/articles/tags' },
      { label: 'Banner', to: '/articles/banners' },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { label: 'Media', to: '/media' },
      { label: 'Pengaturan', to: '/settings' },
    ],
  },
]
