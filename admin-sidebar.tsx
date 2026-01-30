"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react"

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { href: "/admin", icon: LayoutDashboard, label: "Overview" },
        { href: "/admin", icon: FileText, label: "Document Approvals" },
        { href: "/admin/users", icon: Users, label: "User Management" },
        { href: "/admin/settings", icon: Settings, label: "System Settings" },
    ]

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-blue-500" />
                    <span className="font-bold text-xl text-white">Admin Vault</span>
                </div>
            </div>

            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Menu
                </div>
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">Administrator</div>
                        <div className="text-xs text-slate-500">admin@gov.vault</div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
