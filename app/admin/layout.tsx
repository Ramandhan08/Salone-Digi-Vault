import { Sidebar } from "@/components/admin-sidebar" // Admin specific sidebar
import { DashboardHeader } from "@/components/dashboard-header" // Reusing header
import { Toaster } from "@/components/ui/toaster"
import { AdminGuard } from "@/components/admin-guard"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="lg:pl-64 flex-1 pb-16 lg:pb-0">
                    <DashboardHeader />
                    <main className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
                        {children}
                    </main>
                </div>
                <Toaster />
            </div>
        </AdminGuard>
    )
}
