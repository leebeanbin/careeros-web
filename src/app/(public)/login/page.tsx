'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { login } from '@/lib/api/auth'
import { ApiError, BASE_URL } from '@/lib/api/client'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { LogoMark } from '@/components/brand/Logo'

interface LoginForm {
  email: string
  password: string
}

const btn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  width: '100%', height: '42px',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', fontSize: '14px', fontWeight: 500,
  color: 'rgb(208,214,224)', cursor: 'pointer',
  textDecoration: 'none', transition: 'background-color 0.15s',
}
const inputCss: React.CSSProperties = {
  width: '100%', height: '42px',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '0 14px',
  fontSize: '14px', color: 'rgb(247,248,248)',
  outline: 'none', boxSizing: 'border-box',
}

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const { add } = useToastStore()
  const [showEmail, setShowEmail] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data)
      setAuth(res.userId, res.role)
      router.push('/dashboard')
    } catch (err) {
      add('error', err instanceof ApiError ? err.message : '로그인에 실패했습니다.')
    }
  }

  return (
    <main style={{
      backgroundColor: 'rgb(8,9,10)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        backgroundColor: 'rgb(13,14,15)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '40px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <LogoMark size={28} />
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'rgb(247,248,248)', margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.02em' }}>
          다시 오셨군요
        </h1>
        <p style={{ fontSize: '14px', color: 'rgb(138,143,152)', margin: '0 0 28px', textAlign: 'center', lineHeight: 1.5 }}>
          CareerOS 계정으로 로그인하세요
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <a href={`${BASE_URL}/auth/oauth/github`} style={btn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgb(208,214,224)">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub으로 계속하기
          </a>

          {!showEmail ? (
            <button type="button" onClick={() => setShowEmail(true)} style={btn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(208,214,224)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              이메일로 계속하기
            </button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="email" placeholder="name@example.com"
                     {...register('email', { required: true })}
                     style={{ ...inputCss, borderColor: errors.email ? 'rgba(255,99,99,0.5)' : 'rgba(255,255,255,0.1)' }} />
              <input type="password" placeholder="비밀번호"
                     {...register('password', { required: true, minLength: 8 })}
                     style={{ ...inputCss, borderColor: errors.password ? 'rgba(255,99,99,0.5)' : 'rgba(255,255,255,0.1)' }} />
              <button type="submit" disabled={isSubmitting} style={{
                width: '100%', height: '42px',
                backgroundColor: isSubmitting ? 'rgba(229,229,230,0.5)' : 'rgb(229,229,230)',
                color: 'rgb(8,9,10)', fontSize: '14px', fontWeight: 510,
                border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}>
                {isSubmitting ? '로그인 중...' : '계속하기'}
              </button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}/>
          <span style={{ fontSize: '12px', color: 'rgb(138,143,152)' }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}/>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgb(138,143,152)', margin: 0 }}>
          계정이 없으신가요?{' '}
          <Link href="/signup" style={{ color: 'rgb(99,102,241)', textDecoration: 'none', fontWeight: 500 }}>
            회원가입
          </Link>
        </p>
      </div>

      <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgb(138,143,152)', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
        로그인하면 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </main>
  )
}
