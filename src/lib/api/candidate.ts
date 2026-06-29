import { apiFetch } from './client'
import type { CandidateGraph, CandidatePreferences } from './types'
import {
  normalizeCandidateGraph,
  normalizeCandidatePreferences,
  toBackendCandidatePreferences,
} from './adapters'

export const getGraph = () =>
  apiFetch<CandidateGraph>('/candidates/me/graph').then(normalizeCandidateGraph)

export const getPreferences = () =>
  apiFetch<CandidatePreferences>('/candidates/me/preferences').then(normalizeCandidatePreferences)

export const updatePreferences = (body: Partial<CandidatePreferences>) =>
  apiFetch<CandidatePreferences>('/candidates/me/preferences', {
    method: 'PATCH',
    body: JSON.stringify(toBackendCandidatePreferences(body)),
  }).then(normalizeCandidatePreferences)
