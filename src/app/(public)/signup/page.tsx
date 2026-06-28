'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signup } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { useToastStore } from '@/stores/toastStore'
import Spinner from '@/components/ui/Spinner'

interface SignupForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const router = useRouter()
  const { add } = useToastStore()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupForm>()
  const password = watch('password')

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] rounded-xl bg-white p-8
                      shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.12)]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">CareerOS</h1>
          <p className="mt-1 text-sm text-gray-500">새 계정을 만드세요</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                {...register(field.name, field.rules)}
                disabled={isSubmitting}
                placeholder={field.placeholder}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           disabled:bg-gray-100"
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-600">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                       hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isSubmitting && <Spinner size="sm" className="text-white" />}
            회원가입
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
