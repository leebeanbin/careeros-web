import { apiFetch } from './client'
import type { UserDto, UpdateUserDto } from './types'

export const getMe = () =>
  apiFetch<UserDto>('/users/me')

export const updateMe = (body: UpdateUserDto) =>
  apiFetch<UserDto>('/users/me', { method: 'PATCH', body: JSON.stringify(body) })

export const deleteMe = () =>
  apiFetch<void>('/users/me', { method: 'DELETE' })
