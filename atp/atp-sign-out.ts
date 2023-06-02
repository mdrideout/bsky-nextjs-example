import { kAtpCookieName } from './atp-constants'
import { redirect } from 'next/navigation'
import { deleteAtpSession } from './bsky-agent'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

// Sign out and redirect to the sign-in page
export async function signOutAndClearSessionCookies(router: AppRouterInstance) {
  // Call the sign-out function with the agent
  try {
    await deleteAtpSession()
  } catch (e) {
    console.error(e)
  }

  // Clear the atp cookie (must be called after because we need it to get the sign out compatible agent)
  document.cookie = `${kAtpCookieName}=; Max-Age=-1;`

  // Redirect to sign-in screen
  router.replace('/sign-in')
}
