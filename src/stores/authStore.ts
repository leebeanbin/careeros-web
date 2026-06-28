import { create } from 'zustand'

interface AuthStore {
  userId: number | null
  role: 'USER' | 'ADMIN' | null
  setAuth: (userId: number, role: 'USER' | 'ADMIN') => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  role: null,
  setAuth: (userId, role) => set({ userId, role }),
  clear: () => set({ userId: null, role: null }),
}))
