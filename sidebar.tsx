"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Home,
    FileText,
    User,
    LogOut,
    Settings,
    HelpCircle,
    ShieldAlert
} from "lucide-react"

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { href: "/dashboard", icon: Home, label: "Dashboard" },
        { href: "/dashboard/documents", icon: FileText, label: "Documents" },
        { href: "/dashboard/shared", icon: FileText, label: "Shared Links" },
        { href: "/dashboard/profile", icon: User, label: "Profile" },
        { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="p-6">
                <Logo />
            </div>

            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                    href="/help"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <HelpCircle className="h-5 w-5" />
                    Help & Support
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                // Add logout logic link or handler
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
