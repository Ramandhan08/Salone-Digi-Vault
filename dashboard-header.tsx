"use client"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 lg:hidden">
                    SaloneVault
                </h1>

                <div className="hidden lg:block">
                    {/* Breadcrumbs could go here */}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <ThemeToggle />
                    <LanguageToggle />
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
