import { apiFetch } from './client'
import type { RoleCategory } from './types'

export const listRoles = () =>
  apiFetch<RoleCategory[]>('/taxonomy/roles')

export const listSkills = () =>
  apiFetch<string[]>('/taxonomy/skills')
