"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkAdminAccess() {
            try {
                const token = localStorage.getItem("auth_token")

                if (!token) {
                    router.push("/login?redirect=/admin&admin=true")
                    return
                }

                // Verify admin access
                const response = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Unauthorized")
                }

                const data = await response.json()

                // Only allow admin role
                if (data.user?.role !== "admin") {
                    alert("⛔ Access Denied: You do not have admin privileges.\n\nOnly the super administrator can access this area.")
                    router.push("/dashboard")
                    return
                }

                setIsAuthorized(true)
            } catch (error) {
                console.error("Admin access check failed:", error)
                router.push("/login?redirect=/admin&admin=true")
            } finally {
                setIsLoading(false)
            }
        }

        checkAdminAccess()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400">Verifying admin access...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}
