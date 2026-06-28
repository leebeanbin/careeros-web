import { apiFetch } from './client'
import type { NotificationDto, CursorPage } from './types'

export const listNotifications = (params?: { cursor?: string; size?: number; unreadOnly?: boolean }) =>
  apiFetch<CursorPage<NotificationDto>>(`/notifications?${new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  )}`)

export const markRead = (notificationId: number) =>
  apiFetch<void>(`/notifications/${notificationId}/read`, { method: 'PATCH' })

export const markAllRead = () =>
  apiFetch<void>('/notifications/read-all', { method: 'PATCH' })

export const deleteNotification = (notificationId: number) =>
  apiFetch<void>(`/notifications/${notificationId}`, { method: 'DELETE' })
