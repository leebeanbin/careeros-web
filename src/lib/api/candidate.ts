import { apiFetch } from './client'
import type { CandidateGraph, CandidatePreferences } from './types'

export const getGraph = () =>
  apiFetch<CandidateGraph>('/candidates/me/graph')

export const getPreferences = () =>
  apiFetch<CandidatePreferences>('/candidates/me/preferences')

export const updatePreferences = (body: Partial<CandidatePreferences>) =>
  apiFetch<CandidatePreferences>('/candidates/me/preferences', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
