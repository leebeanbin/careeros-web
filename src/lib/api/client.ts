export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// ponytail: simple flag — concurrent 401s may each trigger reissue, acceptable for now
let isRefreshing = false

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })

  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true
    try {
      const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      })
      isRefreshing = false
      if (reissueRes.ok) return apiFetch<T>(path, options)
    } catch {
      isRefreshing = false
    }
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new ApiError('E_AUTH', '인증이 필요합니다.')
  }

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(body.code ?? 'E_UNKNOWN', body.message ?? '오류가 발생했습니다.')
  }

  return ('data' in body ? body.data : body) as T
}
