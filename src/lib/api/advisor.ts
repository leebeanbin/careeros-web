import { apiFetch } from './client'
import type { AdvisorDashboard, AdvisorReport, CursorPage } from './types'
import { normalizeAdvisorDashboard, normalizeAdvisorReport, normalizeCursorPage } from './adapters'

export interface AdvisorReportRequest {
  focus?: 'MATCHING' | 'RESUME' | 'INTERVIEW' | 'ROADMAP'
  note?: string
  includeRoadmap?: boolean
  includeResumeReview?: boolean
}

export const getDashboard = () =>
  apiFetch<AdvisorDashboard>('/advisor/dashboard').then(normalizeAdvisorDashboard)

export const requestReport = (body?: AdvisorReportRequest) =>
  apiFetch<AdvisorReport>('/advisor/report', {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  }).then(normalizeAdvisorReport)

export const listReports = (cursor?: string) =>
  apiFetch<CursorPage<AdvisorReport>>(`/advisor/reports${cursor ? `?cursor=${cursor}` : ''}`)
    .then((page) => normalizeCursorPage(page, normalizeAdvisorReport))

export const getReport = (reportId: string | number) =>
  apiFetch<AdvisorReport>(`/advisor/reports/${reportId}`).then(normalizeAdvisorReport)
