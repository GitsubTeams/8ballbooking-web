import { isAxiosError } from 'axios'
import type { ApiEnvelope } from '@/types/api'

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiEnvelope<Record<string, string[]>>>(error)) {
    const body = error.response?.data

    const firstError = body?.data ? Object.values(body.data)[0]?.[0] : undefined
    if (firstError) {
      return firstError
    }

    if (body?.message) {
      return body.message
    }
  }

  return 'Terjadi kesalahan. Silakan coba lagi.'
}
