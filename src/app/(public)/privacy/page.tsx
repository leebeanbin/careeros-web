import Link from 'next/link'
import type { CSSProperties } from 'react'

const sectionStyle = {
  backgroundColor: 'rgb(13,14,15)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '24px',
} satisfies CSSProperties

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'rgb(8,9,10)', color: 'rgb(247,248,248)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'rgb(138,143,152)', fontSize: '13px', textDecoration: 'none' }}>← CareerOS</Link>
        <h1 style={{ fontSize: '32px', fontWeight: 600, margin: '32px 0 12px' }}>개인정보처리방침</h1>
        <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, marginBottom: '28px' }}>
          CareerOS는 커리어 매칭 서비스를 제공하기 위해 필요한 최소한의 개인정보만 처리합니다.
        </p>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '16px', margin: '0 0 12px' }}>처리하는 정보</h2>
          <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, margin: 0 }}>
            계정 정보, 이력서 파일, GitHub 연동 정보, 서비스 이용 기록을 사용자 동의와 서비스 제공 목적 안에서 처리합니다.
          </p>
          <h2 style={{ fontSize: '16px', margin: '24px 0 12px' }}>보관 및 삭제</h2>
          <p style={{ color: 'rgb(138,143,152)', lineHeight: 1.7, margin: 0 }}>
            사용자는 설정에서 계정 삭제를 요청할 수 있으며, 법령상 보관이 필요한 정보를 제외한 데이터는 삭제됩니다.
          </p>
        </div>
      </div>
    </main>
  )
}
