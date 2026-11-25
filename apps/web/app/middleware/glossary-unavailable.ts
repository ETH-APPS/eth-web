export default defineNuxtRouteMiddleware(() => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Glossary is not available',
  })
})
