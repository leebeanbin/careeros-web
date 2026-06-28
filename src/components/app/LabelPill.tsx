// careeros-view active/page.tsx LabelPill pattern — colored dot + tag
interface Props {
  label: string
  color: string
}

export function LabelPill({ label, color }: Props) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '0 6px', height: '18px', borderRadius: '10px',
      border: `1px solid ${color}40`,
      backgroundColor: `${color}18`,
      fontSize: '11px', color, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      {label}
    </span>
  )
}
