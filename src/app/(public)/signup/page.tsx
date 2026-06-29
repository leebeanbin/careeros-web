'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { signup } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { useToastStore } from '@/stores/toastStore'
import { LogoMark } from '@/components/brand/Logo'

interface SignupForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const router = useRouter()
  const { add } = useToastStore()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignupForm>()
  const password = useWatch({ control, name: 'password' })

  const onSubmit = async ({ name, email, password: pw }: SignupForm) => {
    try {
      await signup({ name, email, password: pw })
      add('success', '회원가입 완료! 로그인해주세요.')
      router.push('/login')
    } catch (err) {
      add('error', err instanceof ApiError ? err.message : '회원가입에 실패했습니다.')
    }
  }

  const fields = [
    { name: 'name' as const, label: '이름', type: 'text', placeholder: '홍길동', rules: { required: '이름을 입력하세요' } },
    { name: 'email' as const, label: '이메일', type: 'email', placeholder: 'name@example.com', rules: { required: '이메일을 입력하세요' } },
    { name: 'password' as const, label: '비밀번호', type: 'password', placeholder: '8자 이상', rules: { required: '비밀번호를 입력하세요', minLength: { value: 8, message: '최소 8자 이상' } } },
    { name: 'confirmPassword' as const, label: '비밀번호 확인', type: 'password', placeholder: '', rules: { required: '비밀번호를 다시 입력하세요', validate: (v: string) => v === password || '비밀번호가 일치하지 않습니다' } },
  ]

  const inputCss: React.CSSProperties = {
    width: '100%', height: '42px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '0 14px',
    fontSize: '14px', color: 'rgb(247,248,248)',
    outline: 'none', boxSizing: 'border-box',
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
          시작하기
        </h1>
        <p style={{ fontSize: '14px', color: 'rgb(138,143,152)', margin: '0 0 28px', textAlign: 'center', lineHeight: 1.5 }}>
          CareerOS 계정을 만드세요
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {fields.map((field) => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                {field.label}
              </label>
              <input
                type={field.type}
                {...register(field.name, field.rules)}
                disabled={isSubmitting}
                placeholder={field.placeholder}
                style={{ ...inputCss, borderColor: errors[field.name] ? 'rgba(255,99,99,0.5)' : 'rgba(255,255,255,0.1)' }}
              />
              {errors[field.name] && (
                <p style={{ fontSize: '12px', color: 'rgba(255,99,99,0.8)', margin: 0 }}>{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <button type="submit" disabled={isSubmitting} style={{
            width: '100%', height: '42px', marginTop: '4px',
            backgroundColor: isSubmitting ? 'rgba(229,229,230,0.5)' : 'rgb(229,229,230)',
            color: 'rgb(8,9,10)', fontSize: '14px', fontWeight: 510,
            border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}>
            {isSubmitting ? '처리 중...' : '계정 만들기'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'rgb(138,143,152)', margin: '24px 0 0' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" style={{ color: 'rgb(99,102,241)', textDecoration: 'none', fontWeight: 500 }}>
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
