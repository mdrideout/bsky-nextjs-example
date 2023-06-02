export const kAtpCookieName = 'atp-cookie'
export const kAtpServiceHost = 'https://bsky.social'

// Server
export const kAtpServerGetSessionUri = kAtpServiceHost + '/xrpc/com.atproto.server.getSession'
export const kAtpServerDeleteSessionUri = kAtpServiceHost + '/xrpc/com.atproto.server.deleteSession'

// Feed
// https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/getTimeline.json
export const kAtpFeedGetTimeline = kAtpServiceHost + '/xrpc/app.bsky.feed.getTimeline'
export function kAtpFeedGetPostThread(postUri: string): string {
  console.log(`Encoded URI: ${postUri};`, encodeURIComponent(postUri))

  return kAtpServiceHost + '/xrpc/app.bsky.feed.getPostThread' + '?uri=' + encodeURIComponent(postUri)
}
