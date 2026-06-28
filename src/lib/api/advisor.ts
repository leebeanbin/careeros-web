import { apiFetch } from './client'
import type { AdvisorDashboard, AdvisorReport, CursorPage } from './types'

export const getDashboard = () =>
  apiFetch<AdvisorDashboard>('/advisor/dashboard')

export const requestReport = () =>
  apiFetch<AdvisorReport>('/advisor/report', { method: 'POST' })

export const listReports = (cursor?: string) =>
  apiFetch<CursorPage<AdvisorReport>>(`/advisor/reports${cursor ? `?cursor=${cursor}` : ''}`)

export const getReport = (reportId: number) =>
  apiFetch<AdvisorReport>(`/advisor/reports/${reportId}`)
