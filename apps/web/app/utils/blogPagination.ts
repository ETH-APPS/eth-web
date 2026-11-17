export const BLOG_PAGE_SIZE = 12

export function parseBlogPage(value: unknown, totalPages: number): number | null {
  if (value === undefined)
    return 1

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value))
    return null

  const page = Number(value)
  return Number.isSafeInteger(page) && page <= totalPages ? page : null
}
