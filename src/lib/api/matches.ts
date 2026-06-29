import { apiFetch } from './client'
import type { CursorPage, MatchDto } from './types'
import { normalizeCursorPage, normalizeMatch } from './adapters'

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
  ).then((page) => normalizeCursorPage(page, normalizeMatch))

export const getMatch = (matchId: string | number) =>
  apiFetch<MatchDto>(`/matches/${matchId}`).then(normalizeMatch)

export const hideMatch = (matchId: string | number) =>
  apiFetch<void>(`/matches/${matchId}/hide`, { method: 'PATCH' })
