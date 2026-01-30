"use client"

import Link from "next/link"
import { Home, FileText, Share2, Settings } from "lucide-react"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto max-w-md grid grid-cols-4 gap-2 px-4 py-3">
        <Link href="/dashboard" className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-300">
          <Home className="h-5 w-5 mb-1" />
          Home
        </Link>
        <Link href="/dashboard/upload" className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-300">
          <FileText className="h-5 w-5 mb-1" />
          Docs
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-300">
          <Share2 className="h-5 w-5 mb-1" />
          Share
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-300">
          <Settings className="h-5 w-5 mb-1" />
          Settings
        </Link>
      </div>
    </nav>
  )
}
