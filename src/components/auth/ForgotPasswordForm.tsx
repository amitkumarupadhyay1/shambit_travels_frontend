"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react"

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`, {
                email: data.email,
            })

            setSuccess(true)
            
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
            }, 2000)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string; detail?: string }; status?: number } }
            if (e.response) {
                const errorData = e.response.data
                if (e.response.status === 404) {
                    setError("No account found with this email address")
                } else {
                    setError(errorData?.error || errorData?.detail || "Failed to send reset code. Please try again.")
                }
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                    Forgot Password
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                    Enter your email address and we&apos;ll send you a code to reset your password
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
                    Reset code sent! Redirecting to reset password page...
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("email")}
                            type="email"
                            placeholder="you@example.com"
                            disabled={success}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
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
                        "Code Sent!"
                    ) : (
                        "Send Reset Code"
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
