"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Clock, History, Receipt, Users, User, HeadphonesIcon, LogOut, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { performLogout } from "@/lib/auth-utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/bookings", icon: Calendar },
    { name: "Upcoming Trips", href: "/bookings?filter=upcoming", icon: Clock },
    { name: "Past Trips", href: "/bookings?filter=past", icon: History },
    { name: "Payments & Receipts", href: "/payments", icon: Receipt },
    { name: "Saved Travellers", href: "/travellers", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Support", href: "/support", icon: HeadphonesIcon },
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
            await performLogout("/")
        } catch (error) {
            console.error("Logout failed:", error)
            setLoggingOut(false)
        }
    }

    // Get user display name
    const getUserDisplayName = () => {
        if (!session?.user) return 'User';
        
        const firstName = session.user.firstName || '';
        const lastName = session.user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        if (fullName) return fullName;
        if (session.user.name) return session.user.name;
        if (session.user.email) return session.user.email.split('@')[0];
        
        return 'User';
    };

    // Get user initials
    const getUserInitials = () => {
        if (!session?.user) return 'U';
        
        const firstName = session.user.firstName || '';
        const lastName = session.user.lastName || '';
        
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        
        if (firstName) {
            return firstName.charAt(0).toUpperCase();
        }
        
        const name = getUserDisplayName();
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
                {/* Logo & Tagline */}
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="block">
                        <div className="text-2xl font-playfair font-bold tracking-tight mb-1">
                            <span className="text-blue-900">Sham</span>
                            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Bit</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">A Bit of Goodness in Every Deal</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                        isActive
                                            ? "bg-orange-50 text-orange-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                                    <span className="flex-1">{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 text-orange-600" />}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {getUserInitials()}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className={`w-4 h-4 mr-2 ${loggingOut ? 'animate-spin' : ''}`} />
                        {loggingOut ? "Signing Out..." : "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
