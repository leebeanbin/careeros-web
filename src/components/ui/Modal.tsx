'use client'
import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: number
}

export default function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) el.showModal()
    else if (el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      className="ds-focus-ring"
      style={{
        width: `min(${maxWidth}px, calc(100vw - 48px))`,
        border: '1px solid var(--da-border)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--da-surface-2)',
        boxShadow: 'var(--shadow-modal)',
        color: 'var(--da-text)',
        padding: '22px',
      }}
    >
      <h2 style={{
        margin: '0 0 16px',
        color: 'var(--da-text)',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.4,
      }}>{title}</h2>
      {children}
    </dialog>
  )
}
