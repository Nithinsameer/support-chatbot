/**
 * v0 by Vercel.
 * @see https://v0.dev/t/svNFuj7K6M3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import Link from "next/link"
import { useAuth } from "../app/context/AuthContext"
// import {
//     ClerkProvider,
//     SignInButton,
//     SignedIn,
//     SignedOut,
//     UserButton
//   } from '@clerk/nextjs'

export default function Landingpage() {
    const {user, googleSignIn, logOut} = useAuth()

    const handleSignIn = async () =>{
        try {
            await googleSignIn()
        }catch (error) {
            console.log(error)
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut()
        }catch (error) {
            console.log(error)
        }
    }
    // console.log(user)
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Headstarter Support Chatbot
        </h1>
        {!user ? ( <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
                        <>
                            <Link
                                href="#"
                                onClick={handleSignIn}
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                            >
                                Continue with Google
                            </Link>
                            {/* <Link
                                href="#"
                                className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                            >
                                Chat
                            </Link> */}
                        </>
                    </div>) : (
                        <>
                        <div className="mt-2 text-lg text-muted-foreground">Welcome {user.displayName}!</div>
                        <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
                            <Link
                                href="/chat"
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                                // prefetch={false}
                            >
                                Chat
                            </Link>
                            <Link
                                href="#"
                                onClick={handleSignOut}
                                className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                                // prefetch={false}
                            >
                                Signout
                            </Link>
                        </div>
                    </>)}
          {/* <Link
            href="#"
            onClick={handleSignIn}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            // prefetch={false}
          >
            Sign Up
          </Link> */}
          {/* <Link
            href="#"
            className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            // prefetch={false}
          >
            Login
          </Link> */}
          {/* <Link
            href="#"
            className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            // prefetch={false}
          >
            Chat
          </Link> */}

      </div>
    </div>
  )
}