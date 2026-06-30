import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'muted'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border-[rgba(255,255,255,0.16)] bg-[rgba(238,238,239,0.94)] text-[rgb(8,9,10)] hover:bg-[rgb(247,248,248)]',
  secondary: 'border-[var(--da-border)] bg-[var(--da-control)] text-[var(--da-text)] hover:bg-[var(--da-control-hover)]',
  ghost: 'border-transparent bg-transparent text-[var(--da-text-2)] hover:bg-[var(--da-hover)] hover:text-[var(--da-text)]',
  danger: 'border-[rgba(248,113,113,0.28)] bg-[var(--da-danger-dim)] text-[var(--da-danger)] hover:bg-[rgba(248,113,113,0.2)]',
  success: 'border-[rgba(255,255,255,0.12)] bg-[var(--da-control-active)] text-[var(--da-success)] hover:bg-[rgba(255,255,255,0.16)]',
  muted: 'border-[var(--da-border)] bg-transparent text-[var(--da-text-3)] hover:bg-[var(--da-hover)] hover:text-[var(--da-text-2)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3.5 text-[13px]',
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        'ds-focus-ring inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
