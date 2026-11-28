export interface CmsNavigationItem {
  label: string
  to: string
  icon: 'dashboard' | 'article' | 'banner' | 'category' | 'tag' | 'media' | 'settings'
}

export interface CmsNavigationGroup {
  label: string
  items: CmsNavigationItem[]
}

export const cmsNavigation: CmsNavigationGroup[] = [
  {
    label: 'Utama',
    items: [{ label: 'Ringkasan', to: '/dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Konten',
    items: [
      { label: 'Artikel', to: '/articles', icon: 'article' },
      { label: 'Banner', to: '/articles/banners', icon: 'banner' },
      { label: 'Kategori', to: '/articles/categories', icon: 'category' },
      { label: 'Tag', to: '/articles/tags', icon: 'tag' },
      { label: 'Media', to: '/media', icon: 'media' },
    ],
  },
  {
    label: 'Sistem',
    items: [{ label: 'Pengaturan', to: '/settings', icon: 'settings' }],
  },
]
