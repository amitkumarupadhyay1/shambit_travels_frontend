"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Loader2, Calendar, Search, Package as PackageIcon, Clock, Download } from "lucide-react"
import Link from "next/link"
import { apiService, BookingDetail } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

export default function BookingsPage() {
    const { status } = useSession()
    const [bookings, setBookings] = useState<BookingDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (status === 'authenticated') {
                    const data = await apiService.getBookings()
                    setBookings(data)
                }
            } catch (e) {
                console.error("Failed to fetch bookings", e)
            } finally {
                setLoading(false)
            }
        }
        
        if (status !== 'loading') {
            fetchBookings()
        }
    }, [status])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'paid':
                return 'bg-green-100 text-green-700'
            case 'pending':
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-700'
            case 'cancelled':
                return 'bg-red-100 text-red-700'
            case 'expired':
                return 'bg-gray-100 text-gray-700'
            default:
                return 'bg-blue-100 text-blue-700'
        }
    }

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true
        
        const bookingDate = new Date(booking.booking_date)
        const today = new Date()
        
        if (filter === 'upcoming') {
            return bookingDate >= today && booking.status !== 'CANCELLED'
        }
        if (filter === 'past') {
            return bookingDate < today && booking.status !== 'CANCELLED'
        }
        if (filter === 'cancelled') {
            return booking.status === 'CANCELLED'
        }
        
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-500 mt-1">View and manage your travel bookings</p>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'upcoming'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'past'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'cancelled'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                    </h3>
                    <p className="text-gray-500 mt-2 mb-6">
                        {filter === 'all' 
                            ? "You haven't made any bookings yet. Start your journey today!"
                            : `You don't have any ${filter} bookings.`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/packages"
                            className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all inline-flex items-center"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Explore Packages
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <PackageIcon className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {booking.package.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {booking.package.city_name}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            Booked on {new Date(booking.created_at).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                            {getStatusLabel(booking.status)}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(parseFloat(booking.total_price) * booking.num_travelers)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatCurrency(parseFloat(booking.total_price))} × {booking.num_travelers} traveler{booking.num_travelers > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                    <Link
                                        href={`/bookings/${booking.booking_reference}`}
                                        className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                            onClick={() => {
                                                // TODO: Implement download voucher
                                                alert('Download voucher feature coming soon!')
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Voucher
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
