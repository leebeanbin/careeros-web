import type { CSSProperties, ReactNode } from 'react'

const toneColors = {
  indigo: 'rgba(255,255,255,0.9)',
  green: 'rgba(255,255,255,0.82)',
  amber: 'rgba(255,255,255,0.66)',
  red: 'rgba(255,255,255,0.72)',
  muted: 'rgba(255,255,255,0.42)',
} as const

type Tone = keyof typeof toneColors

interface AgentIntroProps {
  eyebrow?: string
  title: string
  description: string
  steps?: string[]
  action?: ReactNode
  style?: CSSProperties
}

export function AgentIntro({
  eyebrow = 'AI agent',
  title,
  description,
  steps = ['맥락 수집', '근거 분석', '다음 행동 정리'],
  action,
  style,
}: AgentIntroProps) {
  return (
    <section
      className="agent-surface agent-reveal"
      style={{
        border: '1px solid rgba(255,255,255,0.075)',
        backgroundColor: 'rgba(14,15,16,0.94)',
        borderRadius: '9px',
        padding: '18px',
        marginBottom: '18px',
        ...style,
      }}
    >
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: action ? '1fr auto' : '1fr', gap: '16px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.38)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '9px', fontWeight: 600 }}>
            <span className="agent-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.62)' }} />
            {eyebrow}
          </div>
          <h1 style={{ margin: '0 0 7px', color: 'rgba(255,255,255,0.92)', fontSize: '19px', lineHeight: 1.32, fontWeight: 560 }}>
            {title}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.48)', fontSize: '13px', lineHeight: 1.62, fontWeight: 400 }}>
            {description}
          </p>
        </div>
        {action}
      </div>
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
        {steps.map((step, index) => (
          <span
            key={step}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '24px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.07)',
              backgroundColor: 'rgba(255,255,255,0.025)',
              padding: '0 10px',
              color: 'rgba(255,255,255,0.52)',
              fontSize: '11px',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.84)', fontWeight: 600 }}>{index + 1}</span>
            {step}
          </span>
        ))}
      </div>
    </section>
  )
}

interface AgentPanelProps {
  children: ReactNode
  delay?: number
  style?: CSSProperties
  className?: string
}

export function AgentPanel({ children, delay = 0, style, className = '' }: AgentPanelProps) {
  return (
    <div
      className={`agent-reveal ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        border: '1px solid rgba(255,255,255,0.065)',
        backgroundColor: 'rgb(13,14,15)',
        borderRadius: '8px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function AgentStatusStrip({ items }: { items: Array<{ label: string; value: string | number; tone?: Tone }> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: '8px', marginBottom: '16px' }}>
      {items.map((item, index) => (
        <AgentPanel key={item.label} delay={index * 55} style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.34)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</div>
          <div style={{ fontSize: '17px', fontWeight: 560, color: toneColors[item.tone ?? 'indigo'], lineHeight: 1 }}>{item.value}</div>
        </AgentPanel>
      ))}
    </div>
  )
}

export function AgentStepList({ steps }: { steps: Array<{ label: string; detail: string; tone?: Tone }> }) {
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      {steps.map((step, index) => (
        <div key={step.label} className="agent-reveal" style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: '8px', animationDelay: `${index * 70}ms` }}>
          <span style={{ width: '18px', height: '18px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)', color: toneColors[step.tone ?? 'indigo'], fontSize: '10px', fontWeight: 600 }}>
            {index + 1}
          </span>
          <span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.78)', fontSize: '12px', fontWeight: 560, marginBottom: '3px' }}>{step.label}</span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.44)', fontSize: '12px', lineHeight: 1.56 }}>{step.detail}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
