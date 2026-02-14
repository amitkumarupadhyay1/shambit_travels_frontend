import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Facebook from "next-auth/providers/facebook"
import Google from "next-auth/providers/google"
import axios from "axios"

const hasFacebookEnv =
  !!process.env.AUTH_FACEBOOK_ID && !!process.env.AUTH_FACEBOOK_SECRET

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    ...(hasFacebookEnv ? [Facebook] : []),
    Credentials({
      credentials: {
        phone: {},
        otp: {},
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          // If OTP login
          if (credentials.phone && credentials.otp) {
            const res = await axios.post(`${apiUrl}/auth/login-otp/`, {
              phone: credentials.phone,
              otp: credentials.otp,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = res.data as any
            if (data) {
              return {
                ...data.user,
                accessToken: data.access,
                refreshToken: data.refresh
              }
            }
          }
          // If Password login
          else if (credentials.email && credentials.password) {
            const res = await axios.post(`${apiUrl}/auth/login/`, {
              email: credentials.email,
              password: credentials.password,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = res.data as any
            if (data) {
              return {
                ...data.user,
                accessToken: data.access,
                refreshToken: data.refresh
              }
            }
          }
          return null
        } catch (err: unknown) {
          console.error("Auth Error:", err)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error = err as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((axios as any).isAxiosError(error) && error.response) {
            console.error("Backend Error Response:", error.response.data)
            console.error("Backend Error Status:", error.response.status)
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.accessToken = (user as any).accessToken
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.refreshToken = (user as any).refreshToken
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.id = (user as any).id

        // Sync Social Login
        if (account?.provider === "google" || account?.provider === "facebook") {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const fullName = user.name || ""
            const [firstName, ...restName] = fullName.split(" ")
            const lastName = restName.join(" ")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const providerToken = account.provider === "google" ? (account as any).id_token : (account as any).access_token

            if (!providerToken) {
              console.error(`Missing ${account.provider} provider token`)
              return token
            }

            const res = await axios.post(`${apiUrl}/auth/nextauth-sync/`, {
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              provider: account.provider,
              uid: account.providerAccountId,
              token: providerToken,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = res.data as any
            token.accessToken = data.access
            token.refreshToken = data.refresh
            token.id = data.user_id
            // Update user info from backend
            Object.assign(token, data)
          } catch (e) {
            console.error("Sync failed", e)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).accessToken = token.accessToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).user.id = token.id as string;
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})
