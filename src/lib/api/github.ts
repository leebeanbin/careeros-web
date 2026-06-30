import { apiFetch } from './client'
import type { GitHubProfile, GitHubRepo, SyncStatus, CursorPage } from './types'
import { normalizeCursorPage, normalizeGitHubRepo } from './adapters'

export const connectGitHub = (body: { mode: 'username'; username: string } | { mode: 'oauth'; code: string }) =>
  apiFetch<GitHubProfile>('/github/connect', { method: 'POST', body: JSON.stringify(body) })

export const getGitHubProfile = () =>
  apiFetch<GitHubProfile>('/github/profile')

export const getConnectionStatus = () =>
  apiFetch<GitHubProfile>('/github/connect')

export const disconnectGitHub = () =>
  apiFetch<void>('/github/connect', { method: 'DELETE' })

export const syncGitHub = () =>
  apiFetch<{ syncId: string }>('/github/sync', { method: 'POST' })

export const getSyncStatus = (syncId: string) =>
  apiFetch<SyncStatus>(`/github/sync/${syncId}`)

export const listRepos = (cursor?: string) =>
  apiFetch<CursorPage<GitHubRepo>>(`/github/repositories${cursor ? `?cursor=${cursor}` : ''}`)
    .then((page) => normalizeCursorPage(page, normalizeGitHubRepo))

export const toggleRepoIncluded = (repoId: string | number, included: boolean) =>
  apiFetch<{ repositoryId: string; included: boolean }>(`/github/repositories/${repoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ included }),
  })
