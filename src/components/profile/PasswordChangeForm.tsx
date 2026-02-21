"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Loader2, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import PasswordStrengthMeter from "../auth/PasswordStrengthMeter"

const passwordChangeSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

export default function PasswordChangeForm() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<PasswordChangeFormData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        }
    })

    const newPassword = form.watch("new_password")

    const onSubmit = async (data: PasswordChangeFormData) => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password/`,
                {
                    current_password: data.current_password,
                    new_password: data.new_password,
                },
                {
                    headers: { Authorization: `Bearer ${session?.accessToken}` }
                }
            )

            setSuccess("Password changed successfully")
            form.reset()
            setShowCurrentPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const e = err as any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((axios as any).isAxiosError(e) && e.response) {
                const errorData = e.response.data
                setError(errorData.error || "Failed to change password")
            } else {
                setError("Failed to change password")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <p className="text-gray-500 mt-1">Update your password to keep your account secure</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            {...form.register("current_password")}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {form.formState.errors.current_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.current_password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type={showNewPassword ? "text" : "password"}
                            {...form.register("new_password")}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {form.formState.errors.new_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.new_password.message}</p>
                    )}
                    {newPassword && <PasswordStrengthMeter password={newPassword} />}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...form.register("confirm_password")}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {form.formState.errors.confirm_password && (
                        <p className="text-xs text-red-500">{form.formState.errors.confirm_password.message}</p>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 flex items-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    )
}
