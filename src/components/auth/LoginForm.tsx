"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Loader2, Phone, Mail, Lock, AlertCircle } from "lucide-react"

// Schemas
const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

const phoneSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    otp: z.string().length(6, "OTP must be 6 digits").optional(),
})

export default function LoginForm() {
    const showFacebookAuth = process.env.NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED === "true"
    const [method, setMethod] = useState<"email" | "phone">("email")
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Get returnUrl from query params
    const returnUrl = searchParams.get('returnUrl') || '/dashboard'

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
    })

    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
    })

    const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
        setLoading(true)
        setError("")
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (result?.error) {
                setError("Invalid email or password")
            } else {
                // Check for pending booking and restore state
                const pendingBooking = sessionStorage.getItem('pendingBooking')
                if (pendingBooking) {
                    console.log('Restoring pending booking after login')
                }
                
                router.push(returnUrl)
                router.refresh()
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const onSendOtp = async () => {
        const phone = phoneForm.getValues("phone")
        const validation = await phoneForm.trigger("phone")

        if (!validation) return

        setLoading(true)
        setError("")
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp/`, {
                phone: phone,
            })
            setOtpSent(true)
        } catch (e) {
            console.error(e)
            setError("Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const onPhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
        if (!otpSent) {
            await onSendOtp()
            return
        }

        if (!data.otp) {
            phoneForm.setError("otp", { message: "OTP is required" })
            return
        }

        setLoading(true)
        setError("")
        try {
            const result = await signIn("credentials", {
                redirect: false,
                phone: data.phone,
                otp: data.otp,
            })

            if (result?.error) {
                setError("Invalid OTP")
            } else {
                // Check for pending booking and restore state
                const pendingBooking = sessionStorage.getItem('pendingBooking')
                if (pendingBooking) {
                    console.log('Restoring pending booking after login')
                }
                
                router.push(returnUrl)
                router.refresh()
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="text-3xl font-playfair font-bold tracking-tight">
                        <span className="midnight-blue-gradient-text">Sham</span>
                        <span className="sacred-gradient-text">Bit</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                    Welcome Back
                </h2>
                <p className="text-sm text-gray-500 mt-2">Sign in to manage your bookings</p>
            </div>

            <div className="flex p-1 bg-gray-50 rounded-lg">
                <button
                    onClick={() => { setMethod("email"); setError(""); }}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${method === "email" ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                </button>
                <button
                    onClick={() => { setMethod("phone"); setError(""); phoneForm.reset(); setOtpSent(false); }}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${method === "phone" ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Phone className="w-4 h-4 mr-2" />
                    Mobile
                </button>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {method === "email" ? (
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                {...emailForm.register("email")}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        {emailForm.formState.errors.email && (
                            <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a href="/forgot-password" className="text-xs text-orange-600 hover:text-orange-700">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                {...emailForm.register("password")}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        {emailForm.formState.errors.password && (
                            <p className="text-xs text-red-500">{emailForm.formState.errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-md hover:shadow-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            ) : (
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                {...phoneForm.register("phone")}
                                placeholder="9876543210"
                                disabled={otpSent}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100"
                            />
                        </div>
                        {phoneForm.formState.errors.phone && (
                            <p className="text-xs text-red-500">{phoneForm.formState.errors.phone.message}</p>
                        )}
                    </div>

                    {otpSent && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                                <button type="button" onClick={() => { setOtpSent(false); }} className="text-xs text-orange-600 hover:text-orange-700">
                                    Change Number / Resend
                                </button>
                            </div>
                            <input
                                {...phoneForm.register("otp")}
                                placeholder="123456"
                                className="w-full px-3 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                maxLength={6}
                            />
                            {phoneForm.formState.errors.otp && (
                                <p className="text-xs text-red-500">{phoneForm.formState.errors.otp.message}</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-md hover:shadow-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (otpSent ? "Verify & Sign In" : "Send OTP")}
                    </button>
                </form>
            )}

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: returnUrl })}
                className="w-full py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all flex justify-center items-center"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Google
            </button>

            {showFacebookAuth && (
                <button
                    type="button"
                    onClick={() => signIn("facebook", { callbackUrl: returnUrl })}
                    className="w-full py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all flex justify-center items-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            className="text-blue-600"
                            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.017 4.388 11.005 10.125 11.927v-8.437H7.078V12.07h3.047V9.41c0-3.021 1.793-4.689 4.533-4.689 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.49 0-1.955.93-1.955 1.885v2.26h3.328l-.532 3.494h-2.796V24C19.612 23.078 24 18.09 24 12.073z"
                        />
                    </svg>
                    Facebook
                </button>
            )}

            <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                    Sign up
                </a>
            </p>
        </div>
    )
}
