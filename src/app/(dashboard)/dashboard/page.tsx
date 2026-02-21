"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Calendar, MapPin, CheckCircle2, FileText, Compass, Package, Clock, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService, BookingDetail } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/animations"
import { SkeletonHero, SkeletonStat, SkeletonCard } from "@/components/common/SkeletonCard"
import { EmptyState, ErrorState } from "@/components/common/EmptyState"
import VoucherPreview from "@/components/bookings/VoucherPreview"
import toast from "react-hot-toast"

export default function DashboardPage() {
    const { data: session, status } = useSession()
    
    // Real data state
    const [bookings, setBookings] = useState<BookingDetail[]>([])
    const [upcomingBooking, setUpcomingBooking] = useState<BookingDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingTrips: 0,
        completedTrips: 0
    })
    const [showVoucherPreview, setShowVoucherPreview] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null)

    // Fetch real dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (status !== 'authenticated') {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)
                
                // Fetch all bookings
                const data = await apiService.getBookings()
                setBookings(data)
                
                // Calculate stats from real data
                const now = new Date()
                const upcoming = data.filter(b => 
                    new Date(b.booking_date) >= now && b.status === 'CONFIRMED'
                )
                const completed = data.filter(b => 
                    new Date(b.booking_date) < now && b.status === 'CONFIRMED'
                )
                
                setStats({
                    totalBookings: data.length,
                    upcomingTrips: upcoming.length,
                    completedTrips: completed.length
                })
                
                // Get next upcoming booking (sorted by date)
                if (upcoming.length > 0) {
                    const sortedUpcoming = upcoming.sort((a, b) => 
                        new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
                    )
                    setUpcomingBooking(sortedUpcoming[0])
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
                setError('Failed to load dashboard data. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchDashboardData()
    }, [status])

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

    // WhatsApp share handler
    const handleWhatsAppShare = (booking: BookingDetail) => {
        const message = `🕉️ *ShamBit Travel Booking Confirmed!*

📦 *Package:* ${booking.package.name}
📍 *Destination:* ${booking.package.city_name}
📅 *Travel Date:* ${new Date(booking.booking_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}
👥 *Travelers:* ${booking.num_travelers}
💰 *Amount:* ${formatCurrency(parseFloat(booking.total_price) * booking.num_travelers)}

🎫 *Booking Reference:* ${booking.booking_reference || booking.id}

✨ A Bit of Goodness in Every Deal
🌐 Visit: shambit.com`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        toast.success('Opening WhatsApp...');
    };

    // Loading state
    if (loading) {
        return (
            <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div variants={staggerItem}>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </motion.div>
                <motion.div variants={staggerItem}>
                    <SkeletonHero />
                </motion.div>
                <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <SkeletonStat key={i} />
                    ))}
                </motion.div>
                <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <SkeletonCard key={i} />
                    ))}
                </motion.div>
            </motion.div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-playfair font-semibold text-gray-900">
                        Welcome back, {getUserFirstName()}.
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">A Bit of Goodness in Every Deal</p>
                </div>
                <ErrorState
                    message={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        )
    }

    return (
        <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {/* Greeting Section */}
            <motion.div variants={staggerItem}>
                <h1 className="text-3xl font-playfair font-semibold text-gray-900">
                    Welcome back, {getUserFirstName()}.
                </h1>
                <p className="text-sm text-gray-500 mt-1">A Bit of Goodness in Every Deal</p>
            </motion.div>

            {/* Upcoming Trip Card - Hero Element */}
            <motion.div variants={staggerItem}>
            {upcomingBooking ? (
                <motion.div 
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm"
                    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-orange-700 mb-1">Upcoming Trip</p>
                            <h2 className="text-2xl font-playfair font-semibold text-gray-900">
                                {upcomingBooking.package.name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{upcomingBooking.package.city_name}</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {upcomingBooking.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Travel Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {new Date(upcomingBooking.booking_date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Amount Paid</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(parseFloat(upcomingBooking.total_price) * upcomingBooking.num_travelers)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/bookings/${upcomingBooking.booking_reference || upcomingBooking.id}`}
                            className="flex-1 bg-white text-orange-600 font-medium px-4 py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-center text-sm border border-orange-200"
                        >
                            View Details
                        </Link>
                        <button 
                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium px-4 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm"
                            onClick={() => {
                                setSelectedBooking(upcomingBooking)
                                setShowVoucherPreview(true)
                            }}
                        >
                            View Voucher
                        </button>
                        <button
                            onClick={() => handleWhatsAppShare(upcomingBooking)}
                            className="bg-green-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                            title="Share on WhatsApp"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    className="bg-white rounded-2xl p-8 border border-gray-200"
                    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                >
                    <EmptyState
                        variant="no-bookings"
                        title="Start Your First Journey"
                        description="Discover spiritual destinations and book your perfect travel experience with us."
                        action={{
                            label: 'Explore Packages',
                            href: '/packages',
                        }}
                    />
                </motion.div>
            )}
            </motion.div>

            {/* Booking Overview Stats */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerItem}
            >
                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200"
                    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200"
                    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Upcoming Trips</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200"
                    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Completed Trips</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerItem}
            >
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
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
                className="bg-white rounded-xl p-6 border border-gray-200"
                variants={staggerItem}
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                
                {bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                            <div key={booking.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">
                                        Booking for <strong>{booking.package.name}</strong> - {booking.status.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(booking.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
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
            </motion.div>

            {/* Voucher Preview Modal */}
            {selectedBooking && (
                <VoucherPreview
                    booking={selectedBooking}
                    isOpen={showVoucherPreview}
                    onClose={() => {
                        setShowVoucherPreview(false)
                        setSelectedBooking(null)
                    }}
                    onDownload={async () => {
                        try {
                            const blob = await apiService.downloadVoucher(selectedBooking.id)
                            const url = window.URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `ShamBit-Voucher-${selectedBooking.booking_reference || selectedBooking.id}.pdf`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            window.URL.revokeObjectURL(url)
                            toast.success('Voucher downloaded successfully!')
                        } catch (error) {
                            console.error('Download failed:', error)
                            toast.error('Failed to download voucher. Please try again.')
                        }
                    }}
                />
            )}
        </motion.div>
    )
}
