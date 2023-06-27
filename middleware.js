import { NextResponse } from 'next/server'
import { UrlPath } from './type/urlPath'

export function middleware(req) {
  const { origin } = req.nextUrl
  const cookies = req.cookies.get('jwt_token')
  const role = req.cookies.get('role')
  if (!cookies) {
    return NextResponse.rewrite(`${origin}${UrlPath.auth.url}`)
  }



  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
  ]
}
