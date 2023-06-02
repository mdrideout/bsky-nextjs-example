import { kAtpCookieName, kAtpFeedGetPostThread } from '@/atp/atp-constants'
import { AtpSessionData } from '@atproto/api'
import { cookies } from 'next/dist/client/components/headers'

interface PostThreadProps {
  postUri: string
}

async function getData(postUri: string) {
  try {
    // Resume the agent session
    const cookieStore = cookies()
    const cookieValue = cookieStore.get(kAtpCookieName)

    if (typeof cookieValue != 'undefined') {
      const sessionData: AtpSessionData = JSON.parse(cookieValue.value)
      const requestUrl = kAtpFeedGetPostThread(postUri)
      console.log('Post thread request url: ', requestUrl)

      const fetchResponse = await fetch(kAtpFeedGetPostThread(postUri), {
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

// Post Thread
// Renders the container for the entire post thread (post and it's nested responses)
export default async function PostThread(props: PostThreadProps) {
  const data = await getData(props.postUri)
  console.log(`THREAD DATA for postUri ${props.postUri}`, data)

  // const thread = data['data']['thread']
  // const replies = thread['replies']

  return <p>Number of replies in post thread: </p>
}
