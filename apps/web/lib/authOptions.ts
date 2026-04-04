import { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@repo/db"

export const authOptions : AuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {strategy: "jwt"},
    callbacks: {
        async redirect({ url, baseUrl}) {
            if(url.startsWith("/")) return `${baseUrl}${url}`
            if(new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            }
        })
    }
}