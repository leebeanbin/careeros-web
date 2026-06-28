'use client'
import { useToastStore } from '@/stores/toastStore'

const iconMap = { success: '✓', error: '✕', info: 'ℹ' }

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
}

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md text-sm font-medium min-w-[260px] ${colorMap[t.type]}`}
        >
          <span>{iconMap[t.type]}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 ml-1">✕</button>
        </div>
      ))}
    </div>
  )
}
