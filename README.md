# AT Protocol Bluesky NextJS 13.4 Client

This is a proof of concept NextJS client for AT Protocol / Bluesky that works with NextJS 13.4's App Router and React Server Components for server-side rendering.

## Start

```bash
# Install the packages
npm i

# Start the dev server
npm run dev

# Open in browser: http://localhost:3000
```

## Auth Middleware

The middleware handles automatic redirection of logged in and logged out users to the appropriate pages during server-request.

The primary middleware function `hasActiveAtpSessionMiddleware()` which checks for a session cookie and gets the session from the AT Protocol server uses the [`fetch()`](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching) function for server-side compatibility.

The fetch function is used instead of the XRPC wrapper. See below for reasons.

**Cookies**

- Cookies are used to allow server-side functions to access the client's auth session tokens

## Data Fetching

The built-in `@atproto/api` package instantiates a BskyAgent for convenient access to Bluesky queries and procedures.

**Example:** `await bskyAgent.getTimeline()`

However, these methods do not appear to be compatible with NextJS server-side rendering and data fetching and will result in the following error

```bash
ReferenceError: document is not defined
```

In the cases of server-side data fetching, the XRPC wrapper is bypassed and we call the endpoint URL directly with the [`fetch()`](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching) function.

## Areas for Continued Development / Left Off

I have not spent much time troubleshooting the `document is not defined` errors when trying to execute `BskyAgent` calls on the server.

The `defaultFetchHandler()` function at the root of the XRPC calls appears to use the `fetch()` method which should be server-side compatible.

### Possible Solutions

- It's possible this is a simple packaging issue or a bug in my code pattern
- It's possible that the code-generator could be modified to generate NextJS server-side compatible agent functions for each of the lexicon defined endpoints
