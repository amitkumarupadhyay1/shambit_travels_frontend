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
            const data = res.data as { 
              user: { 
                id: string; 
                email?: string;
                username?: string;
                first_name?: string;
                last_name?: string;
                phone?: string;
              }; 
              access: string; 
              refresh: string 
            }
            if (data && data.user) {
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.first_name && data.user.last_name 
                  ? `${data.user.first_name} ${data.user.last_name}`.trim()
                  : data.user.first_name || data.user.email,
                username: data.user.username,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                phone: data.user.phone,
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
            const data = res.data as { 
              user: { 
                id: string; 
                email?: string;
                username?: string;
                first_name?: string;
                last_name?: string;
                phone?: string;
              }; 
              access: string; 
              refresh: string 
            }
            if (data && data.user) {
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.first_name && data.user.last_name 
                  ? `${data.user.first_name} ${data.user.last_name}`.trim()
                  : data.user.first_name || data.user.email,
                username: data.user.username,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                phone: data.user.phone,
                accessToken: data.access,
                refreshToken: data.refresh
              }
            }
          }
          return null
        } catch (err: unknown) {
          console.error("Auth Error:", err)
          if (err && typeof err === 'object' && 'isAxiosError' in err && err.isAxiosError) {
            const axiosErr = err as { response?: { data: unknown; status: number } }
            if (axiosErr.response) {
              console.error("Backend Error Response:", axiosErr.response.data)
              console.error("Backend Error Status:", axiosErr.response.status)
            }
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
        token.username = user.username
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone

        // Sync Social Login
        if (account?.provider === "google" || account?.provider === "facebook") {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const fullName = user.name || ""
            const [firstName, ...restName] = fullName.split(" ")
            const lastName = restName.join(" ")
            const providerToken = account.provider === "google" ? (account as Record<string, unknown>).id_token as string : (account as Record<string, unknown>).access_token as string

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
            const data = res.data as { 
              access: string; 
              refresh: string; 
              user_id: string;
              username?: string;
              first_name?: string;
              last_name?: string;
            }
            token.accessToken = data.access
            token.refreshToken = data.refresh
            token.id = data.user_id
            token.username = data.username
            token.firstName = data.first_name || firstName
            token.lastName = data.last_name || lastName
          } catch (e) {
            console.error("Sync failed", e)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
        session.user.id = token.id as string;
        session.user.username = token.username as string | undefined;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
        session.user.phone = token.phone as string | undefined;
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
