'use client'

import { BskyAgent } from '@atproto/api'
import { createContext, useEffect } from 'react'
import { bskyAgent, resumeAtpSessionFromCookie } from './bsky-agent'
import { useCookies } from 'react-cookie'
import { kAtpCookieName } from './atp-constants'

// Initialize AtpContext
export const AtpAgentContext = createContext<BskyAgent>(bskyAgent)

// ATP Agent Provider
// Allows us to make this agenct available globally to the application context
export default function AtpAgentProvider({ children }: { children: React.ReactNode }) {
  // useEffect is a lifecycle appropriate hook for running client-only functions
  // that may effect state and could disrupt hydration if called without useEffect
  useEffect(() => {
    // Attempt to resume the session (browser only)
    resumeAtpSessionFromCookie()
  })

  // Return the provider wrapped children (makes the agent available everywhere via useContext)
  // Example:   let agent = useContext(AtpAgentContext)
  return <AtpAgentContext.Provider value={bskyAgent}>{children}</AtpAgentContext.Provider>
}
