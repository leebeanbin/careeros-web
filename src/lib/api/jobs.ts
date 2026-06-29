import { apiFetch } from './client'
import type { CursorPage, JobDto, JobSearchParams } from './types'
import { normalizeCursorPage, normalizeJob } from './adapters'

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
    .then((page) => normalizeCursorPage(page, normalizeJob))

export const getJob = (jobId: string | number) =>
  apiFetch<JobDto>(`/jobs/${jobId}`).then(normalizeJob)

export const saveJob = (jobId: string | number) =>
  apiFetch<void>(`/jobs/${jobId}/save`, { method: 'POST' })

export const unsaveJob = (jobId: string | number) =>
  apiFetch<void>(`/jobs/${jobId}/save`, { method: 'DELETE' })

export const listSavedJobs = (params?: { cursor?: string; size?: number }) =>
  apiFetch<CursorPage<JobDto>>(`/jobs/saved?${toParams((params ?? {}) as Record<string, unknown>)}`)
    .then((page) => normalizeCursorPage(page, normalizeJob))

export const getSimilarJobs = (jobId: string | number) =>
  apiFetch<JobDto[]>(`/jobs/${jobId}/similar`).then((jobs) => jobs.map(normalizeJob))

export const recordApplyClick = (jobId: string | number) =>
  apiFetch<void>(`/jobs/${jobId}/apply-click`, { method: 'POST' })
