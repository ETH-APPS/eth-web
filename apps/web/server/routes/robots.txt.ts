export default defineEventHandler((event) => {
  const configuredSiteUrl = useRuntimeConfig(event).public.siteUrl
  const siteUrl = configuredSiteUrl || (import.meta.dev ? getRequestURL(event).origin : '')

  // Keep crawling open so search engines can discover pages and read page-level noindex directives.
  const lines = [
    'User-agent: *',
    'Disallow:',
  ]

  // Advertise the sitemap only when a canonical site origin is available.
  if (siteUrl)
    lines.push(`Sitemap: ${new URL('/sitemap.xml', siteUrl).href}`)

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${lines.join('\n')}\n`
})
