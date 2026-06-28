import { apiFetch } from './client'

export const signup = (body: { name: string; email: string; password: string }) =>
  apiFetch<void>('/auth/signup', { method: 'POST', body: JSON.stringify(body) })

export const login = (body: { email: string; password: string }) =>
  apiFetch<{ userId: number; role: 'USER' | 'ADMIN' }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const logout = () =>
  apiFetch<void>('/auth/logout', { method: 'POST' })

export const reissue = () =>
  apiFetch<void>('/auth/reissue', { method: 'POST' })
