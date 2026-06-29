import Link from 'next/link'
import type { CSSProperties } from 'react'

const sectionStyle = {
  backgroundColor: 'rgb(13,14,15)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '24px',
} satisfies CSSProperties

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'rgb(8,9,10)', color: 'rgb(247,248,248)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'rgb(138,143,152)', fontSize: '13px', textDecoration: 'none' }}>← CareerOS</Link>
        <h1 style={{ fontSize: '32px', fontWeight: 600, margin: '32px 0 12px' }}>이용약관</h1>
        <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, marginBottom: '28px' }}>
          CareerOS는 사용자의 이력과 선호도를 바탕으로 커리어 매칭 정보를 제공하는 서비스입니다.
        </p>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '16px', margin: '0 0 12px' }}>서비스 이용</h2>
          <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, margin: 0 }}>
            사용자는 정확한 정보를 입력해야 하며, 추천 결과는 채용 합격이나 고용을 보장하지 않습니다.
          </p>
          <h2 style={{ fontSize: '16px', margin: '24px 0 12px' }}>책임의 한계</h2>
          <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, margin: 0 }}>
            CareerOS는 외부 채용 공고, GitHub, OAuth 제공자의 정책 변경으로 인한 제한에 대해 별도의 책임을 지지 않습니다.
          </p>
        </div>
      </div>
    </main>
  )
}
