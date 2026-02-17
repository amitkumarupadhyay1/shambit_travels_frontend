"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Calendar, MapPin, CheckCircle2, ArrowRight, FileText, Compass, Package, Clock } from "lucide-react"
import { useState } from "react"

interface Booking {
    id: string
    destination: string
    startDate: string
    endDate: string
    status: string
    amountPaid: number
}

export default function DashboardPage() {
    const { data: session } = useSession()
    
    // TODO: Replace with actual API calls to fetch user bookings
    const [upcomingBooking] = useState<Booking | null>(null)
    const [stats] = useState({
        totalBookings: 0,
        upcomingTrips: 0,
        completedTrips: 0
    })
    const [recentActivity] = useState<Array<{
        id: string
        type: string
        message: string
        time: string
    }>>([])

    // Get user first name
    const getUserFirstName = () => {
        if (!session?.user) return 'Traveler';
        
        const firstName = session.user.firstName || '';
        if (firstName) return firstName;
        
        if (session.user.name) {
            return session.user.name.split(' ')[0];
        }
        
        if (session.user.email) {
            return session.user.email.split('@')[0];
        }
        
        return 'Traveler';
    };

    return (
        <div className="space-y-6">
            {/* Greeting Section */}
            <div>
                <h1 className="text-3xl font-playfair font-semibold text-gray-900">
                    Welcome back, {getUserFirstName()}.
                </h1>
                <p className="text-sm text-gray-500 mt-1">A Bit of Goodness in Every Deal</p>
            </div>

            {/* Upcoming Trip Card - Hero Element */}
            {upcomingBooking ? (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-orange-700 mb-1">Upcoming Trip</p>
                            <h2 className="text-2xl font-playfair font-semibold text-gray-900">
                                {upcomingBooking.destination}
                            </h2>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {upcomingBooking.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Travel Dates</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {upcomingBooking.startDate} – {upcomingBooking.endDate}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Amount Paid</p>
                            <p className="text-sm font-semibold text-gray-900">
                                ₹{upcomingBooking.amountPaid.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/bookings/${upcomingBooking.id}`}
                            className="flex-1 bg-white text-orange-600 font-medium px-4 py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-center text-sm border border-orange-200"
                        >
                            View Details
                        </Link>
                        <button className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium px-4 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm">
                            Download Voucher
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Compass className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">
                        Start Your First Journey
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Discover spiritual destinations and book your perfect travel experience with us.
                    </p>
                    <Link
                        href="/packages"
                        className="inline-flex items-center bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        Explore Packages
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            )}

            {/* Booking Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Upcoming Trips</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Completed Trips</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/packages"
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Plan New Journey</h3>
                    <p className="text-sm text-gray-600">Explore destinations and packages</p>
                </Link>

                <Link
                    href="/destinations"
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Explore Destinations</h3>
                    <p className="text-sm text-gray-600">Discover new places to visit</p>
                </Link>

                <Link
                    href="/bookings"
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">My Itineraries</h3>
                    <p className="text-sm text-gray-600">View all your bookings</p>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    )
}
