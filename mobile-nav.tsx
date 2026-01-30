"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Calendar, User, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            icon: Home,
            label: "Home",
        },
        {
            href: "/dashboard/documents",
            icon: FileText,
            label: "Docs",
        },
        {
            href: "/dashboard/events",
            icon: Calendar,
            label: "Events",
        },
        {
            href: "/dashboard/qr-code", // Personal QR
            icon: QrCode,
            label: "Pass",
        },
        {
            href: "/dashboard/profile",
            icon: User,
            label: "Profile",
        },
    ]

    // Only show on mobile (hidden on large screens)
    // Sticky bottom
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 lg:hidden">
            <div className="flex justify-around items-center h-16 pb-safe">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
