// careeros-view MemberAvatar pattern — adapted for company initials
const COLORS = [
  'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.12)',
  'rgba(255,255,255,0.2)',  'rgba(255,255,255,0.14)', 'rgba(255,255,255,0.16)',
  'rgba(255,255,255,0.13)', 'rgba(255,255,255,0.17)',
]

function hashColor(str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff
  return COLORS[h % COLORS.length]
}

interface Props {
  company: string
  size?: number
}

export function CompanyAvatar({ company, size = 18 }: Props) {
  const initials = company.replace(/[^a-zA-Z가-힣]/g, '').slice(0, 2).toUpperCase() || company.slice(0, 2).toUpperCase()
  const color = hashColor(company)
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: `${Math.floor(size * 0.45)}px`, fontWeight: 600,
      color: 'rgba(255,255,255,0.82)', flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {initials}
    </div>
  )
}
