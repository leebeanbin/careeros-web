// Remote type indicator — mirrors linear.app PriorityIcon bar pattern
// REMOTE: 3 bars (full signal) / HYBRID: 2 bars / ON_SITE: 1 bar

interface Props {
  remoteType: string
  size?: number
}

export function RemoteTypeIcon({ remoteType, size = 16 }: Props) {
  const s = size
  const barW = Math.floor(s * 0.22)
  const gap = Math.floor(s * 0.1)
  const totalW = barW * 3 + gap * 2
  const startX = (s - totalW) / 2
  const maxH = s * 0.72
  const baseY = s * 0.84

  const heights = [maxH * 0.4, maxH * 0.7, maxH]

  const filled =
    remoteType === 'REMOTE' ? 3
    : remoteType === 'HYBRID' ? 2
    : 1 // ON_SITE

  const activeColor =
    remoteType === 'REMOTE' ? 'rgb(99,102,241)'
    : remoteType === 'HYBRID' ? 'rgb(234,179,8)'
    : 'rgb(138,143,152)'

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={startX + i * (barW + gap)}
          y={baseY - h}
          width={barW}
          height={h}
          rx={1}
          fill={i < filled ? activeColor : 'rgba(255,255,255,0.1)'}
        />
      ))}
    </svg>
  )
}
