import { useId, type CSSProperties } from 'react'

interface LogoMarkProps {
  size?: number
  className?: string
  style?: CSSProperties
  title?: string
  accentColor?: string
}

interface LogoWordmarkProps extends LogoMarkProps {
  textClassName?: string
  showSubtitle?: boolean
}

export function LogoMark({
  size = 20,
  className,
  style,
  title = 'CareerOS',
  accentColor = 'rgba(122,151,214,0.92)',
}: LogoMarkProps) {
  const gradientId = `cos-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-${size}`
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
      <title>{title}</title>
      <defs>
        <linearGradient id={`${gradientId}-case`} x1="3.5" y1="5.8" x2="16.8" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.94)" />
          <stop offset="0.58" stopColor="rgba(218,222,230,0.74)" />
          <stop offset="1" stopColor="rgba(122,151,214,0.64)" />
        </linearGradient>
        <linearGradient id={`${gradientId}-glass`} x1="4.6" y1="7.3" x2="15.8" y2="12.3" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.96)" />
          <stop offset="0.48" stopColor={accentColor} />
          <stop offset="1" stopColor="rgba(255,255,255,0.68)" />
        </linearGradient>
      </defs>
      <path
        d="M6.35 6.2V5.55c0-.82.66-1.48 1.48-1.48h4.34c.82 0 1.48.66 1.48 1.48v.65"
        stroke={`url(#${gradientId}-case)`}
        strokeWidth="1.18"
        strokeLinecap="round"
      />
      <path
        d="M4.25 7.25h11.5c.68 0 1.2.52 1.2 1.2v5.95c0 .68-.52 1.2-1.2 1.2H4.25c-.68 0-1.2-.52-1.2-1.2V8.45c0-.68.52-1.2 1.2-1.2Z"
        stroke={`url(#${gradientId}-case)`}
        strokeWidth="1.28"
        strokeLinejoin="round"
      />
      <path
        d="M4.05 10.28h12.1"
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="0.78"
        strokeLinecap="round"
      />
      <path
        d="M5.42 8.94c1.22-.88 2.86-.52 3.35.74.18.46.42.68.78.72.36.04.66-.12.92-.5.72-1.05 2.42-1.08 3.46-.05"
        stroke={`url(#${gradientId}-glass)`}
        strokeWidth="1.18"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-10 9.75 9.62)"
      />
      <path
        d="M6.18 9.38c.78-.5 1.78-.22 2.06.58M11.42 9.82c.56-.7 1.66-.7 2.35-.08"
        stroke="rgba(255,255,255,0.82)"
        strokeWidth="0.82"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-10 9.75 9.62)"
        opacity="0.66"
      />
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
  showSubtitle = false,
}: LogoWordmarkProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(8, Math.round(size * 0.45)), ...style }}
    >
      <LogoMark size={size} title={title} accentColor={accentColor} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span className={textClassName} style={{ lineHeight: 1, letterSpacing: '-0.01em' }}>
          C<span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 460 }}>O</span><span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 620 }}>S</span>
        </span>
        {showSubtitle && (
          <span style={{ fontSize: Math.max(8, Math.round(size * 0.42)), lineHeight: 1, color: 'rgba(255,255,255,0.36)', fontWeight: 500, letterSpacing: '0.01em' }}>
            CareerOS
          </span>
        )}
      </span>
    </span>
  )
}
