// careeros-view active/page.tsx FilterPill — Filter/Group/Display header buttons
interface Props {
  label: string
  onClick?: () => void
}

export function FilterPill({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center',
        height: '26px', padding: '0 10px', borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
        fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {label}
    </button>
  )
}
