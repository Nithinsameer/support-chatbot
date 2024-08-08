/**
 * v0 by Vercel.
 * @see https://v0.dev/t/svNFuj7K6M3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../app/context/AuthContext"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
// import {
//     ClerkProvider,
//     SignInButton,
//     SignedIn,
//     SignedOut,
//     UserButton
//   } from '@clerk/nextjs'

export default function Landingpage() {
    const {user, googleSignIn, logOut} = useAuth()

    const [selectedLanguage, setSelectedLanguage] = useState("en")
    const router = useRouter()


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

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language)
        router.push(`/chat?lang=${language}`)
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
                            {/* <Link
                                href="/chat"
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                                // prefetch={false}
                            >
                                Chat
                            </Link> */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                                >
                                    Chat
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleLanguageSelect("en")}>
                                    <Link href={`/chat?lang=en`} prefetch={false}>
                                    English
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleLanguageSelect("fr")}>
                                    <Link href={`/chat?lang=fr`} prefetch={false}>
                                    French
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleLanguageSelect("de")}>
                                    <Link href={`/chat?lang=de`} prefetch={false}>
                                    German
                                    </Link>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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

function ChevronDownIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  }