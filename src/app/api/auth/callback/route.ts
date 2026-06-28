import { NextResponse } from 'next/server'
import { connectGitHub } from '@/lib/api/github'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/github?error=no_code', request.url))
  }

  try {
    await connectGitHub({ mode: 'oauth', code })
    return NextResponse.redirect(new URL('/github?connected=true', request.url))
  } catch {
    return NextResponse.redirect(new URL('/github?error=connect_failed', request.url))
  }
}
