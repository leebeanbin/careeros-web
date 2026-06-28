import { apiFetch } from './client'
import type { AdminJobDto, CursorPage, JobDto, JobSearchParams } from './types'

const toParams = (obj: Record<string, unknown>) =>
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    ),
  )

export const listJobs = (params: JobSearchParams) =>
  apiFetch<CursorPage<JobDto>>(`/jobs?${toParams(params as Record<string, unknown>)}`)

export const getJob = (jobId: number) => apiFetch<JobDto>(`/jobs/${jobId}`)

export const saveJob = (jobId: number) =>
  apiFetch<void>(`/jobs/${jobId}/save`, { method: 'POST' })

export const unsaveJob = (jobId: number) =>
  apiFetch<void>(`/jobs/${jobId}/save`, { method: 'DELETE' })

export const listSavedJobs = (cursor?: string) =>
  apiFetch<CursorPage<JobDto>>(`/jobs/saved${cursor ? `?cursor=${cursor}` : ''}`)

export const getSimilarJobs = (jobId: number) =>
  apiFetch<JobDto[]>(`/jobs/${jobId}/similar`)

export const recordApplyClick = (jobId: number) =>
  apiFetch<void>(`/jobs/${jobId}/apply-click`, { method: 'POST' })

export const listAdminJobs = (params?: { cursor?: string; size?: number }) =>
  apiFetch<CursorPage<AdminJobDto>>(
    `/jobs/admin?${toParams((params ?? {}) as Record<string, unknown>)}`,
  )

export const createJob = (body: Partial<AdminJobDto>) =>
  apiFetch<AdminJobDto>('/jobs', { method: 'POST', body: JSON.stringify(body) })

export const updateJobStatus = (jobId: number, status: string) =>
  apiFetch<void>(`/jobs/${jobId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
