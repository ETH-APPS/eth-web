export interface ApiEnvelope<T> {
  request_id: string
  data: T
}

export interface ApiErrorDetail {
  code: string
  message: string
  fields?: Record<string, string[]>
}

export interface ApiErrorResponse {
  error?: ApiErrorDetail
  data?: { error?: ApiErrorDetail }
}
