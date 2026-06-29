import { apiFetch } from './client'
import type { UserDto, AiCallDto, AiCallStats, AdminJobDto, CursorPage } from './types'
import { normalizeCursorPage } from './adapters'

const toParams = (obj: Record<string, unknown>) =>
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]),
    ),
  )

// --- Users (admin) ---

export const listUsers = (params?: { status?: string; keyword?: string; cursor?: string }) =>
  apiFetch<CursorPage<UserDto>>(`/users?${toParams((params ?? {}) as Record<string, unknown>)}`)
    .then((page) => normalizeCursorPage(page, (u) => u))

export const getUser = (userId: number) =>
  apiFetch<UserDto>(`/users/${userId}`)

export const updateUserRole = (userId: number, role: 'USER' | 'ADMIN') =>
  apiFetch<void>(`/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })

export const updateUserStatus = (userId: number, status: 'ACTIVE' | 'SUSPENDED') =>
  apiFetch<void>(`/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// --- AI Calls (admin) ---

export const listAiCalls = (params?: { useCase?: string; success?: boolean; cursor?: string }) =>
  apiFetch<CursorPage<AiCallDto>>(`/admin/ai-calls?${toParams((params ?? {}) as Record<string, unknown>)}`)
    .then((page) => normalizeCursorPage(page, (c) => c))

export const getAiCallStats = () =>
  apiFetch<AiCallStats>('/admin/ai-calls/stats')

// --- Jobs (admin) ---

export const listAdminJobs = (params?: { cursor?: string }) =>
  apiFetch<CursorPage<AdminJobDto>>(`/admin/jobs?${toParams((params ?? {}) as Record<string, unknown>)}`)
    .then((page) => normalizeCursorPage(page, (j) => j))

export const createJob = (body: Partial<AdminJobDto>) =>
  apiFetch<AdminJobDto>('/admin/jobs', { method: 'POST', body: JSON.stringify(body) })

export const updateAdminJobStatus = (jobId: string | number, status: string) =>
  apiFetch<void>(`/admin/jobs/${jobId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
