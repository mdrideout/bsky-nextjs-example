'use client'

import { CircularProgress, ThemeProvider } from '@mui/material'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { circularProgressTheme } from '../../theme/mui-theme'
import { bskyAgent } from '@/atp/bsky-agent'
import { AtpAgentContext } from '@/atp/bsky-agent-provider'

type Inputs = {
  email: string
  password: string
}

export default function SignIn() {
  // // Context
  // // Bluesky Agent from Context
  let agent = useContext(AtpAgentContext)

  // Local State
  const [signInError, setSignInError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Perform Sign In
  async function performSignIn(data: Inputs) {
    setSignInError('')
    setLoading(true)

    console.log('login input data: ', data)

    try {
      // Perform the sign in
      const response = await bskyAgent.login({
        identifier: data.email,
        password: data.password,
      })

      if (response.success == false) {
        console.log('login success == false.', response)
      }

      // Redirect to home screen
      window.location.replace('/')
    } catch (e) {
      console.log('login failure (catch)', e)
      if (e == 'Error: Invalid identifier or password') {
        setSignInError('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  // Sign in error component
  function SignInError() {
    if (signInError != '') {
      return (
        <div>
          <p className="text-center text-red-700">{signInError}</p>
        </div>
      )
    } else {
      return null
    }
  }

  function ButtonLoader() {
    if (loading) {
      return (
        <div className="ml-2 mt-[1px]">
          <ThemeProvider theme={circularProgressTheme}>
            <CircularProgress size={12} thickness={7} />
          </ThemeProvider>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div>
            <h1 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Bluesky NextJS Client</h1>
            <p className="text-center italic">unofficial application</p>
            <h2 className="mt-10 text-center text-1xl leading-9 tracking-tight text-gray-900">Sign in with a Bluesky app password</h2>
          </div>
          <form className="space-y-6" method="POST" onSubmit={handleSubmit((data) => performSignIn(data))}>
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  {...register('email', { required: true })}
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  {...register('password', { required: true })}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <SignInError />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
                <ButtonLoader />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
