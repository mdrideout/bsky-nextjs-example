import { AtpAgent, AtpSessionData, AtpSessionEvent, BskyAgent } from '@atproto/api'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest } from 'next/server'
import { kAtpCookieName, kAtpServerGetSessionUri, kAtpServiceHost } from './atp-constants'
import { useCookies } from 'react-cookie'

// Default Bluesky Agent
export const bskyAgent = new BskyAgent({
  service: kAtpServiceHost,
  persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
    if (sess != null) {
      // Store session in a cookie
      document.cookie = `${kAtpCookieName}=${JSON.stringify(sess)}`
    } else {
      console.error('Session is null, cannot store to persistence.')
    }
  },
})

export async function deleteAtpSession(): Promise<void> {
  console.warn('The deleteSession endpoint seems broken, ignore and just clear local state and cookies. ')
  const hasSession: boolean = bskyAgent.hasSession

  if (hasSession) {
    try {
      const response = await bskyAgent.com.atproto.server.deleteSession()
      console.log('Sign out success? ', response.success)
    } catch (e) {
      console.warn('Error deleting session (LIKELY UNFINISHED IMPLEMENTATION ON SERVER): ', e)
    }
  } else {
    console.log('No session to sign out.')
  }
}

/**
 * Check ATP Session
 * Checks the ATP session and attempts to resume it from cookie if not active
 */
export async function resumeAtpSessionFromCookie(): Promise<void> {
  // console.log('Resuming ATP session from cookie... ')

  const hasSession: boolean = bskyAgent.hasSession
  // console.log('Have a bsky session?', hasSession)

  if (hasSession == false) {
    // Get the value of the atp cookie using regex
    const cookieValue = getAtpSessionCookieValue()

    if (cookieValue == null) {
      // console.log('No cookie value to resume session with.')
      return
    }

    const sessionData: AtpSessionData = JSON.parse(cookieValue)
    // console.log(`${kAtpCookieName} data converted to AtpSessionData. Executing resume request...`)

    // Resume the session
    try {
      const response = await bskyAgent.resumeSession(sessionData)
      // console.log('Resume session response success? ', response.success)
      return
    } catch (e) {
      console.error('Error resuming session: ', e)
      return
    }
  }
}

/**
 * Has Active Atp Session Middleware
 * An authenticationn guard function designed to be used with NextJS 13+ App Router middleware
 *
 * How It Works:
 *  - Checks for a valid session against the AT Proto server getSession endpoint
 *    https://github.com/bluesky-social/atproto/blob/main/lexicons/com/atproto/server/getSession.json
 *
 * - Returns true if response is 200
 * - Returns false if response is otherwise
 */
export async function hasActiveAtpSessionMiddleware(request: NextRequest): Promise<boolean> {
  const hasSessionCookie: boolean = request.cookies.has(kAtpCookieName)
  console.log(`Session cookie ${kAtpCookieName} exists?`, hasSessionCookie)

  if (hasSessionCookie) {
    console.log(`Attempting to resume session with ${kAtpCookieName}...`)

    // Read the cookie data
    const cookieValue: RequestCookie | undefined = request.cookies.get(kAtpCookieName)

    if (typeof cookieValue != 'undefined') {
      const sessionData: AtpSessionData = JSON.parse(cookieValue.value)
      // console.log('Parsed session data: ', sessionData)
      // console.log(`${kAtpCookieName} data converted to AtpSessionData. Executing resume request...`)

      console.warn('Can we actually use the XRPC function here after resuming the bskyAgent session?')

      try {
        const fetchResponse = await fetch(kAtpServerGetSessionUri, {
          headers: {
            Authorization: `Bearer ${sessionData.accessJwt}`,
          },
        })

        // Return the status of the session
        return fetchResponse.ok
      } catch (e) {
        console.error('Error getting session: ', e)

        return false
      }
    } else {
      console.error(`Cookie ${kAtpCookieName} value is undefined.`)
      return false
    }
  }

  return false
}

/**
 * Get Atp Session Cookie Value
 */
function getAtpSessionCookieValue(): string | null {
  // Get the value of the atp cookie using regex
  var match = document.cookie.match(new RegExp('(^| )' + kAtpCookieName + '=([^;]+)'))
  let cookieValue = match ? match[2] : null
  return cookieValue
}
