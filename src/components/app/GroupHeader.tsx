// careeros-view active/page.tsx GroupHeader pattern — section divider with count
interface Props {
  label: string
  count: number
}

export function GroupHeader({ label, count }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      height: '36px', padding: '0 16px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{
        fontSize: '11px', fontWeight: 500,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </span>
      <span style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.4)',
        borderRadius: '10px', fontSize: '11px', fontWeight: 500,
        padding: '0 6px', lineHeight: '18px',
      }}>
        {count}
      </span>
    </div>
  )
}
