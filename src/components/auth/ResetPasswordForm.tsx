"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Loader2, Phone, Lock, AlertCircle, CheckCircle, Key } from "lucide-react"
import PasswordStrengthMeter from "./PasswordStrengthMeter"

const resetPasswordSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+]{10,13}$/, "Invalid phone number format"),
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
})

function ResetPasswordFormContent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const phoneFromUrl = searchParams.get("phone") || ""

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            phone: phoneFromUrl,
            otp: "",
            password: "",
            password_confirm: "",
        },
    })

    const password = form.watch("password")

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/`, {
                phone: data.phone,
                otp: data.otp,
                password: data.password,
                password_confirm: data.password_confirm,
            })

            setSuccess(true)
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push("/login?reset=success")
            }, 2000)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string; detail?: string }; status?: number } }
            if (e.response) {
                const errorData = e.response.data
                if (e.response.status === 400) {
                    setError(errorData?.error || "Invalid or expired OTP. Please try again.")
                } else if (e.response.status === 404) {
                    setError("User not found. Please check your phone number.")
                } else {
                    setError(errorData?.error || errorData?.detail || "Failed to reset password. Please try again.")
                }
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        const phone = form.getValues("phone")
        if (!phone) {
            setError("Please enter your phone number")
            return
        }

        setLoading(true)
        setError("")

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`, {
                phone: phone,
            })
            setError("") // Clear any previous errors
            // Show success in a non-intrusive way
            form.setError("otp", { 
                type: "manual", 
                message: "New OTP sent to your phone" 
            })
        } catch {
            setError("Failed to resend OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                    Reset Password
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                    Enter the OTP sent to your phone and create a new password
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    Password reset successful! Redirecting to login...
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("phone")}
                            type="tel"
                            placeholder="+919876543210 or 9876543210"
                            disabled={success}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    {form.formState.errors.phone && (
                        <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">OTP Code</label>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading || success}
                            className="text-xs text-orange-600 hover:text-orange-700 disabled:opacity-50"
                        >
                            Resend OTP
                        </button>
                    </div>
                    <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("otp")}
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            disabled={success}
                            className="w-full pl-10 pr-3 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    {form.formState.errors.otp && (
                        <p className="text-xs text-green-600">{form.formState.errors.otp.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={success}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                    )}
                    {password && <PasswordStrengthMeter password={password} />}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("password_confirm")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={success}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    {form.formState.errors.password_confirm && (
                        <p className="text-xs text-red-500">{form.formState.errors.password_confirm.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success ? (
                        "Password Reset!"
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <a href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default function ResetPasswordForm() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                        Reset Password
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">Loading...</p>
                </div>
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            </div>
        }>
            <ResetPasswordFormContent />
        </Suspense>
    )
}
