import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
                <div className="w-full max-w-md">
                    <ForgotPasswordForm />
                </div>
            </div>
            <Footer />
        </main>
    )
}
