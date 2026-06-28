import { apiFetch } from './client'
import type { CursorPage, MatchDto } from './types'

const toParams = (obj: Record<string, unknown>) =>
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    ),
  )

export const listMatches = (params?: {
  cursor?: string
  size?: number
  hideHidden?: boolean
}) =>
  apiFetch<CursorPage<MatchDto>>(
    `/matches?${toParams((params ?? {}) as Record<string, unknown>)}`,
  )

export const getMatch = (matchId: number) => apiFetch<MatchDto>(`/matches/${matchId}`)

export const hideMatch = (matchId: number) =>
  apiFetch<void>(`/matches/${matchId}/hide`, { method: 'PATCH' })
