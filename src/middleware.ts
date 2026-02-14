import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/bookings"]
const authRoutes = ["/login", "/register", "/forgot-password"]

export default async function middleware(request: NextRequest) {
    const session = await auth()
    const isAuth = !!session?.user

    const { pathname } = request.nextUrl

    // 2. Redirect to /login if accessing protected route without auth
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuth) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // 3. Redirect to /dashboard if accessing auth routes while authenticated
    if (authRoutes.some(route => pathname.startsWith(route)) && isAuth) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

// 4. Matcher to filter relevant paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
