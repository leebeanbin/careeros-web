import { apiFetch } from './client'
import type { GitHubProfile, GitHubRepo, SyncStatus, CursorPage } from './types'

export const connectGitHub = (body: { mode: 'username'; username: string } | { mode: 'oauth'; code: string }) =>
  apiFetch<GitHubProfile>('/github/connect', { method: 'POST', body: JSON.stringify(body) })

export const getGitHubProfile = () =>
  apiFetch<GitHubProfile>('/github/connect')

export const disconnectGitHub = () =>
  apiFetch<void>('/github/connect', { method: 'DELETE' })

export const syncGitHub = () =>
  apiFetch<{ syncId: string }>('/github/sync', { method: 'POST' })

export const getSyncStatus = (syncId: string) =>
  apiFetch<SyncStatus>(`/github/sync/${syncId}`)

export const listRepos = (cursor?: string) =>
  apiFetch<CursorPage<GitHubRepo>>(`/github/repositories${cursor ? `?cursor=${cursor}` : ''}`)
