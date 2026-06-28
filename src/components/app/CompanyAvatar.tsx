// careeros-view MemberAvatar pattern — adapted for company initials
const COLORS = [
  'rgb(139,92,246)', 'rgb(59,130,246)', 'rgb(34,197,94)',
  'rgb(234,179,8)',  'rgb(239,68,68)',  'rgb(99,102,241)',
  'rgb(236,72,153)', 'rgb(20,184,166)',
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
      color: 'white', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}
