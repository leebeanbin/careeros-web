// Circular match score indicator — mirrors linear.app StatusIcon pattern

interface Props {
  score: number
  size?: number
}

export function MatchStatusIcon({ score, size = 16 }: Props) {
  const s = size
  const cx = s / 2
  const cy = s / 2
  const r = s / 2 - 1.5
  const checkSize = s * 0.38

  // ≥80: filled green circle + checkmark (strong match)
  if (score >= 80) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <circle cx={cx} cy={cy} r={r + 1} fill="rgb(34,197,94)" />
        <polyline
          points={`${cx - checkSize * 0.6},${cy} ${cx - checkSize * 0.1},${cy + checkSize * 0.5} ${cx + checkSize * 0.7},${cy - checkSize * 0.45}`}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // ≥65: amber circle with half-fill arc (good match)
  if (score >= 65) {
    const innerR = r - 2
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const x1 = cx + innerR * Math.cos(toRad(-90))
    const y1 = cy + innerR * Math.sin(toRad(-90))
    const x2 = cx + innerR * Math.cos(toRad(90))
    const y2 = cy + innerR * Math.sin(toRad(90))
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <circle cx={cx} cy={cy} r={r} stroke="rgb(234,179,8)" strokeWidth="1.5" />
        <path
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${innerR} ${innerR} 0 0 1 ${x2} ${y2} Z`}
          fill="rgb(234,179,8)"
        />
      </svg>
    )
  }

  // ≥50: outlined indigo circle with center dot (moderate)
  if (score >= 50) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.82)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={r - 3} fill="rgba(255,255,255,0.82)" />
      </svg>
    )
  }

  // <50: dashed gray circle (weak match)
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle
        cx={cx} cy={cy} r={r}
        stroke="rgb(138,143,152)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
    </svg>
  )
}
