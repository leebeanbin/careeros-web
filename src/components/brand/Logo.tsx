import type { CSSProperties } from 'react'

interface LogoMarkProps {
  size?: number
  className?: string
  style?: CSSProperties
  title?: string
  accentColor?: string
}

interface LogoWordmarkProps extends LogoMarkProps {
  textClassName?: string
}

export function LogoMark({
  size = 20,
  className,
  style,
  title = 'CareerOS',
  accentColor = 'rgb(129,140,248)',
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      role="img"
      aria-label={title}
      className={className}
      style={{ display: 'block', flexShrink: 0, color: 'rgb(247,248,248)', ...style }}
      fill="none"
    >
      <path
        d="M10 3.25a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.82"
      />
      <path
        d="M10 1.9v2.15M10 15.95v2.15M1.9 10h2.15M15.95 10h2.15"
        stroke="rgba(255,255,255,0.36)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M7.15 12.85 9.08 8.55 12.85 7.15l-1.93 4.3-3.77 1.4Z"
        fill={accentColor}
      />
      <circle cx="10" cy="10" r="1.05" fill="rgb(8,9,10)" opacity="0.9" />
    </svg>
  )
}

export function LogoWordmark({
  size = 20,
  className,
  style,
  textClassName,
  title = 'CareerOS',
  accentColor,
}: LogoWordmarkProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(8, Math.round(size * 0.45)), ...style }}
    >
      <LogoMark size={size} title={title} accentColor={accentColor} />
      <span className={textClassName} style={{ lineHeight: 1 }}>
        CareerOS
      </span>
    </span>
  )
}
