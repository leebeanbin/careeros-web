import { apiFetch } from './client'
import type { UserDto, AiCallDto, AiCallStats, AdminJobDto, CursorPage } from './types'

export const listUsers = (params?: { status?: string; keyword?: string; cursor?: string }) =>
  apiFetch<CursorPage<UserDto>>(`/users?${new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  )}`)

export const getUser = (userId: number) =>
  apiFetch<UserDto>(`/users/${userId}`)

export const updateUserRole = (userId: number, role: 'USER' | 'ADMIN') =>
  apiFetch<void>(`/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })

export const updateUserStatus = (userId: number, status: 'ACTIVE' | 'SUSPENDED') =>
  apiFetch<void>(`/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

export const listAiCalls = (params?: { useCase?: string; success?: boolean; cursor?: string }) =>
  apiFetch<CursorPage<AiCallDto>>(`/admin/ai-calls?${new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  )}`)

export const getAiCallStats = () =>
  apiFetch<AiCallStats>('/admin/ai-calls/stats')

export const listAdminJobs = (params?: { cursor?: string }) =>
  apiFetch<CursorPage<AdminJobDto>>(`/admin/jobs?${new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  )}`)

export const updateJobStatus = (jobId: number, status: string) =>
  apiFetch<void>(`/admin/jobs/${jobId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
