"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Calendar, MapPin, Ticket } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {session?.user?.name || "Traveler"}!
                </h1>
                <p className="text-gray-500 mt-2">
                    Ready for your next spiritual journey?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
                        <h3 className="text-xl font-bold text-gray-900">0</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Destinations Visited</p>
                        <h3 className="text-xl font-bold text-gray-900">0</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                        <h3 className="text-xl font-bold text-gray-900">0</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Activity could go here */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-8 text-gray-500">
                    <p>No recent activity found.</p>
                    <Link href="/packages" className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block">
                        Explore Packages
                    </Link>
                </div>
            </div>
        </div>
    )
}
