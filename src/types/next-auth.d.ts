import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session extends Record<string, unknown> {
        accessToken?: string
        refreshToken?: string
        user: {
            id: string
            username?: string
            firstName?: string
            lastName?: string
            phone?: string
        } & DefaultSession["user"]
    }

    interface User extends Record<string, unknown> {
        accessToken?: string
        refreshToken?: string
        id: string
        username?: string
        firstName?: string
        lastName?: string
        phone?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        refreshToken?: string
        id?: string
        username?: string
        firstName?: string
        lastName?: string
        phone?: string
    }
}
