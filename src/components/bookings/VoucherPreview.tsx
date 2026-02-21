"use client"

import { useState, useRef } from "react"
import { X, Download, Printer, Loader2 } from "lucide-react"
import { BookingDetail } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import QRCode from "react-qr-code"

interface VoucherPreviewProps {
  booking: BookingDetail
  isOpen: boolean
  onClose: () => void
  onDownload: () => Promise<void>
}

export default function VoucherPreview({ booking, isOpen, onClose, onDownload }: VoucherPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const voucherRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await onDownload()
    } finally {
      setIsDownloading(false)
    }
  }

  const bookingRef = booking.booking_reference || `BK${booking.id}`
  const totalAmount = typeof booking.total_amount_paid === 'string' 
    ? parseFloat(booking.total_amount_paid)
    : booking.total_amount_paid || (parseFloat(booking.total_price) * booking.num_travelers)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 print:hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col print:inset-0 print:rounded-none"
          >
            {/* Header - Hidden on print */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 print:hidden">
              <h2 className="text-xl font-semibold text-gray-900">Voucher Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voucher Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 print:overflow-visible print:p-8">
              <div 
                ref={voucherRef}
                className="max-w-4xl mx-auto bg-white voucher-content"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-playfair font-bold text-orange-600 mb-2">
                    ShamBit
                  </h1>
                  <p className="text-sm text-gray-600">A Bit of Goodness in Every Deal</p>
                </div>

                {/* Voucher Title */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">TRAVEL VOUCHER</h2>
                </div>

                {/* Booking Reference & QR Code */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-gray-900">Booking Reference: </span>
                      <span className="text-gray-700">{bookingRef}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Booking Date: </span>
                      <span className="text-gray-700">
                        {new Date(booking.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Status: </span>
                      <span className="text-green-600 font-medium">
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-2 border-2 border-gray-200 rounded-lg">
                    <QRCode value={bookingRef} size={120} />
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <span className="font-semibold text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-600">{booking.customer_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-600">{booking.customer_email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Phone:</span>
                      <span className="ml-2 text-gray-600">{booking.customer_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Package Details</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <span className="font-semibold text-gray-700">Package:</span>
                      <span className="ml-2 text-gray-600">{booking.package.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Destination:</span>
                      <span className="ml-2 text-gray-600">{booking.package.city_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Travel Date:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Number of Travelers:</span>
                      <span className="ml-2 text-gray-600">{booking.num_travelers}</span>
                    </div>
                  </div>
                </div>

                {/* Traveler Details */}
                {booking.traveler_details && booking.traveler_details.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Traveler Details</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-orange-600 text-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.traveler_details.map((traveler, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                            <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{traveler.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{traveler.age}</td>
                            <td className="border border-gray-300 px-4 py-2">{traveler.gender || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Itinerary Components */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Itinerary Components</h3>
                  
                  {booking.selected_experiences && booking.selected_experiences.length > 0 && (
                    <div className="mb-3">
                      <p className="font-semibold text-gray-700 mb-1">Experiences:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {booking.selected_experiences.map((exp) => (
                          <li key={exp.id} className="text-gray-600">{exp.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Accommodation:</span>
                    <span className="ml-2 text-gray-600">{booking.selected_hotel_tier.name}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">Transport:</span>
                    <span className="ml-2 text-gray-600">{booking.selected_transport.name}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Price Breakdown</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-4 py-2">Per Person Price</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrency(parseFloat(booking.total_price))}
                        </td>
                      </tr>
                      <tr className="bg-orange-50">
                        <td className="border border-gray-300 px-4 py-2">Number of Travelers</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {booking.num_travelers}
                        </td>
                      </tr>
                      <tr className="bg-orange-100 font-bold">
                        <td className="border border-gray-300 px-4 py-2">Total Amount Paid</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrency(totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Special Requests</h3>
                    <p className="text-gray-600">{booking.special_requests}</p>
                  </div>
                )}

                {/* Important Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Important Information</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Please carry a valid photo ID proof during your travel</li>
                    <li>• Reach the pickup point 15 minutes before the scheduled time</li>
                    <li>• This voucher must be presented at the time of service</li>
                    <li>• For any changes or cancellations, please contact us at least 48 hours in advance</li>
                    <li>• Emergency contact: +91 9005457111</li>
                  </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Terms & Conditions</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• All bookings are subject to availability</li>
                    <li>• Cancellation charges apply as per our refund policy</li>
                    <li>• The company reserves the right to modify the itinerary due to unforeseen circumstances</li>
                    <li>• Travel insurance is recommended but not included</li>
                    <li>• Please refer to our website for complete terms and conditions</li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 border-t border-gray-200 text-sm text-gray-600">
                  <p className="font-semibold mb-1">Thank you for choosing ShamBit!</p>
                  <p>For support: support@shambit.com | +91 9005457111</p>
                  <p>www.shambit.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
