'use client'

import { useContext } from 'react'
import { AtpAgentContext } from '../atp/bsky-agent-provider'
import { signOutAndClearSessionCookies } from '@/atp/atp-sign-out'
import { useRouter } from 'next/navigation'
import { bskyAgent } from '@/atp/bsky-agent'
import Link from 'next/link'

export default function Home() {
  // Context
  // let agent = useContext(AtpAgentContext)
  const router = useRouter()

  async function getTimeline() {
    // Get the data
    const response = await bskyAgent.getTimeline()
    console.log('Response: ', response)
  }

  async function getPostThread() {
    // Get the data
    const response = await bskyAgent.getPostThread({ uri: 'at://did:plc:cfy5rgqvohpdqxgu2geb5u2b/app.bsky.feed.post/3jx2vwpsect23' })
    console.log('Post Thread Response: ', response)
  }

  async function handleSignOut() {
    signOutAndClearSessionCookies(router)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div>
            <h1 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">You are signed in.</h1>
            <p className="py-1">
              <Link
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                href="/server-render-timeline"
              >
                View server rendered timeline
              </Link>
            </p>
            <p className="py-1">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={getTimeline}
              >
                Console Log Timeline
              </button>
            </p>
            <p className="py-1">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={getPostThread}
              >
                Console Test PostThread Request
              </button>
            </p>
            <p className="py-1">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
