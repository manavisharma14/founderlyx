"use client"
import { signIn } from "next-auth/react"

export default function Login(){
    return(
        <div className="flex justify-center mt-10 items-center">
            <button className="bg-pink-300 py-4 px-2 shadow-md rounded-3xl text-center" onClick={() => signIn("google", { callbackUrl: "/dashboard"})}>
            Login with google
        </button>
        </div>
    )
}