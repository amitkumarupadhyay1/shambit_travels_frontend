"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, Calendar, LogOut } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { performLogout } from "@/lib/auth-utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "My Bookings", href: "/bookings", icon: Calendar },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = async () => {
        if (loggingOut) return
        
        const confirmed = window.confirm("Are you sure you want to sign out?")
        if (!confirmed) return

        setLoggingOut(true)
        try {
            await performLogout("/login")
        } catch (error) {
            console.error("Logout failed:", error)
            setLoggingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                        ShamBit
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">User Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 pb-6">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-orange-50 text-orange-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                                {item.name}
                            </Link>
                        )
                    })}

                    <div className="px-4 py-3 mt-6 border-t border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                    {session?.user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className={`w-5 h-5 mr-3 ${loggingOut ? 'animate-spin' : ''}`} />
                            {loggingOut ? "Signing Out..." : "Sign Out"}
                        </button>
                    </div>
                </nav>
            </div>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
