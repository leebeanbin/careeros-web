import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PATHS = [
  '/dashboard', '/jobs', '/matches', '/resume',
  '/github', '/candidate', '/advisor', '/notifications', '/settings',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  const isAuthPath = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isAdminPath = pathname.startsWith('/admin')
  const isPublicAuth = pathname === '/login' || pathname === '/signup'

  if ((isAuthPath || isAdminPath) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isPublicAuth && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*',
    '/matches/:path*',
    '/resume/:path*',
    '/github/:path*',
    '/candidate/:path*',
    '/advisor/:path*',
    '/notifications/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}
