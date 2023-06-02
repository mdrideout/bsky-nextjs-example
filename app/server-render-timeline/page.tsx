import { kAtpCookieName, kAtpFeedGetTimeline, kAtpServerGetSessionUri, kAtpServiceHost } from '@/atp/atp-constants'
import { bskyAgent } from '@/atp/bsky-agent'
import { AppBskyEmbedRecord, AppBskyFeedGetTimeline, AtpAgent, AtpSessionData, AtpSessionEvent } from '@atproto/api'
import { cookies } from 'next/dist/client/components/headers'
import Link from 'next/link'
import PostThread from './post-thread'

async function getData() {
  console.log('timeline getData() running...')

  try {
    // Resume the agent session
    const cookieStore = cookies()
    const cookieValue = cookieStore.get(kAtpCookieName)

    if (typeof cookieValue != 'undefined') {
      const sessionData: AtpSessionData = JSON.parse(cookieValue.value)
      console.log('Access token: ', sessionData.accessJwt)

      const fetchResponse = await fetch(kAtpFeedGetTimeline, {
        headers: {
          Authorization: `Bearer ${sessionData.accessJwt}`,
        },
        cache: 'no-store', // user specific data should not be cached
      })

      const data = await fetchResponse.json()

      return data
    }
  } catch (e) {
    console.error('timeline getData() error: ', e)
  }

  return null

  // LEFT OFF: Can we use the fetch handler to use the fetch() feature for server-side rendering?
  // https://github.com/bluesky-social/atproto/blob/95252ddb4fd10ac7e7035303b125a80ee8dd88f0/packages/xrpc/src/client.ts#L25
  //
  // Is there a way to convert Bluesky agent calls into fetch calls more easily?
  // Probably need to make a code generator
}

export default async function ServerRenderTimeline() {
  const data = await getData()
  // console.log('DATA: ', data)

  function FeedList() {
    if (data == null) {
      return null
    }

    return (
      <div>
        {data.feed.map((post: any) => {
          const postData = post['post']
          const author = postData['author']
          const record = postData['record']

          const displayName = author['displayName']
          const text = record['text']
          const postUri = postData['uri']
          console.log('ORIGINAL URI: ', postUri)

          return (
            <div className="py-5">
              <div>{displayName}</div>
              <div className="whitespace-pre">{text}</div>
              {/* @ts-expect-error Async Server Component */}
              <PostThread key={postData['cid']} postUri={postUri}></PostThread>
              <div className="py-2">
                <pre className="text-[10px]">{JSON.stringify(postData, null, 2)}</pre>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <p className="p-5">
        <Link href="/">Home</Link>
      </p>

      <div className="px-5">
        <FeedList />
      </div>
    </div>
  )
}
