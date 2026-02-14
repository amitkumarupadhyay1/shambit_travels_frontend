
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Loader2, Save, User, Phone, Mail } from "lucide-react"

const profileSchema = z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().optional(),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    email: z.string().email(), // Read-only mostly
})

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
        }
    })

    // Fetch verified user data from backend on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (session?.accessToken) {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` }
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form.reset(res.data as any)
                }
            } catch (e) {
                console.error("Failed to fetch profile", e)
            }
        }
        fetchProfile()
    }, [session, form])

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
            }, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            })

            // Update session
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: `${data.first_name} ${data.last_name || ""}`.trim(),
                }
            })

            setSuccess("Profile updated successfully")
        } catch {
            setError("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your personal information</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                {...form.register("first_name")}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            />
                        </div>
                        {form.formState.errors.first_name && (
                            <p className="text-xs text-red-500">{form.formState.errors.first_name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            {...form.register("last_name")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("phone")}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                    </div>
                    {form.formState.errors.phone && (
                        <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            {...form.register("email")}
                            disabled
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 flex items-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
