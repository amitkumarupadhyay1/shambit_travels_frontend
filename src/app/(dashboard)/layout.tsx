"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Clock, History, Receipt, Users, User, HeadphonesIcon, LogOut, ChevronRight, Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { performLogout } from "@/lib/auth-utils"
import { motion, AnimatePresence } from "framer-motion"

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

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
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <div className="text-xl font-playfair font-bold tracking-tight">
                        <span className="text-blue-900">Sham</span>
                        <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Bit</span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 hover:text-orange-600 transition-colors touch-manipulation"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop: Fixed, Mobile: Slide-in */}
            <AnimatePresence>
                <motion.aside
                    initial={false}
                    animate={{
                        x: isMobileMenuOpen ? 0 : '-100%'
                    }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="lg:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-50 lg:z-auto"
                >
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
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all touch-manipulation ${
                                            isActive
                                                ? "bg-orange-50 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
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
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                        >
                            <LogOut className={`w-4 h-4 mr-2 ${loggingOut ? 'animate-spin' : ''}`} />
                            {loggingOut ? "Signing Out..." : "Sign Out"}
                        </button>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 overflow-y-auto pt-16 lg:pt-0">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
