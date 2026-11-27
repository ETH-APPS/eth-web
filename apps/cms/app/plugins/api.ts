import axios from 'axios'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: '/api',
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  })

  return { provide: { api } }
})
