import { NextRequest, NextResponse } from 'next/server'
import { bskyAgent, hasActiveAtpSessionMiddleware } from './atp/bsky-agent'
import { kAtpCookieName } from './atp/atp-constants'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { AtpSessionData } from '@atproto/api'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  console.log('Running middleware...')

  // Get session status
  const isAuthenticated: boolean = await hasActiveAtpSessionMiddleware(req)
  console.log('isAuthenticated: ', isAuthenticated)

  // If we are on the sign-in screen, redirect to the home screen
  if (req.nextUrl.pathname == '/sign-in' && isAuthenticated) {
    console.log('Middleware redirecting signed-in user to home screen.')
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect non-authenticated users to the sign-in screen
  if (req.nextUrl.pathname != '/sign-in' && !isAuthenticated) {
    console.log('Middleware redirecting signed-out user to the sign-in screen.')
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

// Stop Middleware running on static files
export const config = { matcher: '/((?!.*\\.).*)' }
