// careeros-view active/page.tsx FilterPill — Filter/Group/Display header buttons
interface Props {
  label: string
  onClick?: () => void
  active?: boolean
  title?: string
}

export function FilterPill({ label, onClick, active = false, title }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      style={{
        display: 'flex', alignItems: 'center',
        height: '26px', padding: '0 10px', borderRadius: '4px',
        border: active ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: active ? 'rgba(99,102,241,0.14)' : 'transparent',
        color: active ? 'rgb(199,210,254)' : 'rgba(255,255,255,0.5)',
        fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = active ? 'rgba(99,102,241,0.14)' : 'transparent')}
    >
      {label}
    </button>
  )
}
