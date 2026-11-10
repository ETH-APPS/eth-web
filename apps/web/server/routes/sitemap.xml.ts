import { indexableRoutes } from '../utils/indexableRoutes'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler((event) => {
  const configuredSiteUrl = useRuntimeConfig(event).public.siteUrl
  const siteUrl = configuredSiteUrl || (import.meta.dev ? getRequestURL(event).origin : '')

  // Fail closed in production instead of publishing URLs with a missing or incorrect origin.
  if (!siteUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Sitemap requires NUXT_PUBLIC_SITE_URL',
    })
  }

  // A sitemap advertises canonical, indexable pages to crawlers; it is not a list of every reachable route.
  // The explicit allowlist excludes noindex filters, placeholder content, and unverified dynamic slugs.
  const urls = indexableRoutes
    .map(path => `  <url><loc>${escapeXml(new URL(path, siteUrl).href)}</loc></url>`)
    .join('\n')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')
})
